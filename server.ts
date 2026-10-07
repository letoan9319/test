/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  COLOR_PALETTES,
  COSTUME_ITEMS,
  CULTURAL_SOURCES,
  OCCASIONS,
  STYLES,
} from './src/data/catalog.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

// Khởi tạo Gemini client an toàn từ biến môi trường server
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey && apiKey !== 'MY_GEMINI_API_KEY' ? new GoogleGenAI({ apiKey }) : null;

// ================= API 1: GỢI Ý PHỐI ĐỒ VỚI GEMINI (STRUCTURED OUTPUT) =================
app.post('/api/gemini/suggest', async (req: Request, res: Response) => {
  try {
    const { currentOutfit, occasionId, styleId, familyId } = req.body;

    const occasion = OCCASIONS.find((o) => o.id === occasionId) || OCCASIONS[0];
    const style = STYLES.find((s) => s.id === styleId) || STYLES[0];
    const targetFamilyId = familyId || currentOutfit?.familyId || 'ao_ngu_than';

    // Lọc danh sách item hợp lệ trong catalog
    const allowedTops = COSTUME_ITEMS.filter((i) => i.slot === 'top' && i.compatibleWith.includes(targetFamilyId));
    const allowedBottoms = COSTUME_ITEMS.filter((i) => i.slot === 'bottom' && i.compatibleWith.includes(targetFamilyId));
    const allowedHeads = COSTUME_ITEMS.filter((i) => i.slot === 'headwear' && i.compatibleWith.includes(targetFamilyId));
    const allowedHands = COSTUME_ITEMS.filter((i) => i.slot === 'handheld' && i.compatibleWith.includes(targetFamilyId));
    const allowedSashes = COSTUME_ITEMS.filter((i) => i.slot === 'sash' && i.compatibleWith.includes(targetFamilyId));

    const catalogContext = {
      allowedTops: allowedTops.map((t) => ({ id: t.id, name: t.name, note: t.culturalNote })),
      allowedBottoms: allowedBottoms.map((b) => ({ id: b.id, name: b.name })),
      allowedHeads: allowedHeads.map((h) => ({ id: h.id, name: h.name })),
      allowedHands: allowedHands.map((h) => ({ id: h.id, name: h.name })),
      allowedSashes: allowedSashes.map((s) => ({ id: s.id, name: s.name })),
      allowedPalettes: COLOR_PALETTES.map((p) => ({ id: p.id, name: p.name, desc: p.description })),
      historicalSources: Object.values(CULTURAL_SOURCES).map((s) => ({ id: s.id, title: s.title, excerpt: s.excerpt })),
    };

    // Nếu không có API Key, trả về gợi ý tuyển chọn mẫu được chuẩn bị trước
    if (!ai) {
      return res.json({
        isFallback: true,
        fallbackNotice: 'Gợi ý có sẵn (Dự phòng: Chưa phát hiện GEMINI_API_KEY ở môi trường máy chủ)',
        suggestions: getCuratedFallbackSuggestions(targetFamilyId, occasionId, styleId),
      });
    }

    const systemPrompt = `Bạn là chuyên gia tư vấn phục trang và nghiên cứu văn hóa trong ứng dụng Nếp Việt (Việt phục Remix).
Nhiệm vụ: Đề xuất tối đa 3 phương án phối đồ hoàn chỉnh cho người dùng.

RÀNG BUỘC NGHIÊM NGẶT:
1. CHỈ ĐƯỢC CHỌN các itemId và paletteId có thật trong danh mục được cung cấp dưới đây. Tuyệt đối không tự bịa ID.
2. Phân biệt rõ ràng giữa tư liệu bảo tàng (Tham khảo tư liệu) và phối hợp thời trang đương đại (Phối đương đại).
3. Không tự tạo nguồn hoặc trích dẫn sai.
4. Trả về đúng định dạng JSON chuẩn theo Schema.

DANH MỤC ĐƯỢC PHÉP DÙNG:
${JSON.stringify(catalogContext, null, 2)}
`;

    const userPrompt = `Yêu cầu phối đồ:
- Dòng trang phục: ${targetFamilyId}
- Tình huống: ${occasion.name} (${occasion.description})
- Định hướng thẩm mỹ: ${style.name} (${style.description})
Hãy đề xuất 2-3 phương án phối đồ phù hợp nhất.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData: any;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = { suggestions: [] };
    }

    // Kiểm tra tính hợp lệ của itemId trả về
    const validSuggestions = (parsedData.suggestions || parsedData || [])
      .map((item: any) => {
        const topExists = allowedTops.find((t) => t.id === item.topId) || allowedTops[0];
        const bottomExists = allowedBottoms.find((b) => b.id === item.bottomId) || allowedBottoms[0];
        const headExists = allowedHeads.find((h) => h.id === item.headwearId);
        const handExists = allowedHands.find((h) => h.id === item.handheldId);
        const sashExists = allowedSashes.find((s) => s.id === item.sashId);
        const paletteExists = COLOR_PALETTES.find((p) => p.id === item.paletteId) || COLOR_PALETTES[0];

        return {
          title: item.title || `Phương án phối ${occasion.name}`,
          topId: topExists.id,
          bottomId: bottomExists.id,
          headwearId: headExists ? headExists.id : null,
          handheldId: handExists ? handExists.id : null,
          sashId: sashExists ? sashExists.id : null,
          paletteId: paletteExists.id,
          stylingReason: item.stylingReason || `Phối màu ${paletteExists.name} thanh lịch, phù hợp cho dịp ${occasion.name}.`,
          culturalNotes: item.culturalNotes || topExists.culturalNote,
          culturalLabel: item.culturalLabel || topExists.culturalLabel,
          uncertainty: item.uncertainty || 'Các chi tiết phụ kiện đương đại là lựa chọn thẩm mỹ, không phải phục dựng lịch sử hoàn toàn.',
        };
      })
      .slice(0, 3);

    return res.json({
      isFallback: false,
      suggestions: validSuggestions.length > 0 ? validSuggestions : getCuratedFallbackSuggestions(targetFamilyId, occasionId, styleId),
    });
  } catch (error: any) {
    console.error('Gemini API suggest error:', error);
    return res.json({
      isFallback: true,
      fallbackNotice: 'Gợi ý có sẵn (Dự phòng: API tạm thời gián đoạn hoặc quá giới hạn yêu cầu)',
      suggestions: getCuratedFallbackSuggestions(req.body?.familyId || 'ao_ngu_than', req.body?.occasionId || 'ky_yeu', req.body?.styleId || 'nhe_nhang'),
    });
  }
});

// ================= API 2: VIẾT CÂU CHUYỆN LOOKBOOK (60-100 TỪ) =================
app.post('/api/gemini/story', async (req: Request, res: Response) => {
  try {
    const { outfit, lookName } = req.body;
    const palette = COLOR_PALETTES.find((p) => p.id === outfit?.paletteId) || COLOR_PALETTES[0];
    const top = COSTUME_ITEMS.find((i) => i.id === outfit?.topId) || COSTUME_ITEMS[0];
    const occasion = OCCASIONS.find((o) => o.id === outfit?.occasionId) || OCCASIONS[0];

    if (!ai) {
      return res.json({
        isFallback: true,
        story: `Bộ phối ${lookName || top.name} mang sắc ${palette.name} trầm mặc mà đoan trang. Dáng áo buông rủ thanh tao, kết hợp hài hòa cùng nếp sống trẻ trung, ghi lại khoảnh khắc thanh xuân trọn vẹn trong dịp ${occasion.name}.`,
      });
    }

    const storyPrompt = `Hãy viết một đoạn câu chuyện lookbook ngắn từ 60 đến 100 từ tiếng Việt cho bộ trang phục truyền thống sau:
- Tên bộ: ${lookName || top.name}
- Mẫu áo: ${top.name}
- Sắc màu: ${palette.name} (${palette.description})
- Dịp mặc: ${occasion.name}
YÊU CẦU:
- Văn phong thanh lịch, giàu chất thơ và tôn vinh nếp áo Việt Nam.
- Độ dài chính xác từ 60 đến 100 từ.
- Không bịa sự kiện lịch sử không có thật. Chỉ trả về duy nhất đoạn văn bản.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: storyPrompt,
    });

    const story = response.text?.trim() || '';

    return res.json({
      isFallback: false,
      story: story.length > 20 ? story : `Bộ phối ${lookName || top.name} kết hợp sắc ${palette.name} tôn lên nét duyên dáng của tà áo truyền thống trong dịp ${occasion.name}.`,
    });
  } catch (error: any) {
    console.error('Gemini story error:', error);
    return res.json({
      isFallback: true,
      story: `Sắc áo cổ truyền buông rủ thanh tao hòa cùng nét tươi mới của thế hệ trẻ hôm nay, lưu giữ trọn vẹn vẻ đẹp của văn hóa dân tộc qua từng đường kim nếp vải.`,
    });
  }
});

// ================= DỰ PHÒNG CHUẨN ĐƯỢC TUYỂN CHỌN TRƯỚC =================
function getCuratedFallbackSuggestions(familyId: string, occasionId: string, styleId: string) {
  if (familyId === 'ao_dai') {
    return [
      {
        title: 'Áo dài trắng mộc thanh xuân',
        topId: 'top_aodai_truyenthong',
        bottomId: 'bot_quan_lua_trang',
        headwearId: 'head_non_la',
        handheldId: 'hand_chuoi_ngoc',
        sashId: null,
        paletteId: 'pal_to_nu',
        stylingReason: 'Sắc trắng mộc tối giản kinh điển, tôn vinh phom dáng thanh thoát cho chụp ảnh kỷ yếu.',
        culturalNotes: 'Kế thừa vẻ kín đáo của áo ngũ thân truyền thống, phối cùng nón lá quai lụa và chuỗi ngọc tân thời.',
        culturalLabel: 'Tham khảo tư liệu',
        uncertainty: 'Chuỗi ngọc là biến thể thị dân đầu thế kỷ XX, mang dấu ấn đương đại nhẹ nhàng.',
      },
      {
        title: 'Mây lam dạo phố dịu mát',
        topId: 'top_aodai_cachtan',
        bottomId: 'bot_quan_lua_trang',
        headwearId: 'head_tram_cai_ngoc',
        handheldId: 'hand_quat_tranh',
        sashId: null,
        paletteId: 'pal_may_lam',
        stylingReason: 'Sắc lam cổ điển phối cổ tròn cách tân mở nhẹ, mang lại sự dễ chịu khi dạo phố tham quan.',
        culturalNotes: 'Cổ tròn suông mềm giúp di chuyển linh hoạt, điểm xuyết trâm cài gỗ xà cừ.',
        culturalLabel: 'Phối đương đại',
        uncertainty: 'Cổ tròn mở rộng là thiết kế cách tân thế kỷ XXI, không phải quy chuẩn lịch sử triều Nguyễn.',
      },
    ];
  } else if (familyId === 'ao_tu_than') {
    return [
      {
        title: 'Tứ thân trẩy hội son gạch',
        topId: 'top_tu_than_kinhbac',
        bottomId: 'bot_vay_xoe_den',
        headwearId: 'head_non_quai_thao',
        handheldId: 'hand_quat_tranh',
        sashId: 'sash_dai_bao_lua',
        paletteId: 'pal_chu_sa',
        stylingReason: 'Sắc đỏ chu sa trầm phối váy sồi đen và dải thắt bao hồng hoa, đậm đà không khí lễ hội Kinh Bắc.',
        culturalNotes: 'Bốn thân vải mộc tượng trưng cho tứ thân phụ mẫu, đi liền cùng nón ba tầm quai thao bện tơ.',
        culturalLabel: 'Tham khảo tư liệu',
        uncertainty: 'Trang phục trẩy hội dân gian đồng bằng Bắc Bộ, phù hợp ngày hội văn hóa.',
      },
      {
        title: 'Tứ thân buộc vạt thanh trà',
        topId: 'top_tu_than_cachdieuviet',
        bottomId: 'bot_vay_xoe_den',
        headwearId: null,
        handheldId: 'hand_tui_gam',
        sashId: 'sash_that_lung_goi',
        paletteId: 'pal_thanh_tra',
        stylingReason: 'Vạt trước buộc nút ngang eo năng động, gam xanh ngọc thanh trà dịu mát.',
        culturalNotes: 'Cách buộc hai vạt trước là lối vận đồ lao động hoặc dạo chơi thoải mái của phụ nữ Bắc Bộ xưa.',
        culturalLabel: 'Phối sáng tạo',
        uncertainty: 'Phối màu xanh thanh trà là sáng tạo đương đại giúp diện mạo tươi mới.',
      },
    ];
  } else {
    return [
      {
        title: 'Ngũ thân lập lĩnh chàm sương',
        topId: 'top_ngu_than_chen',
        bottomId: 'bot_quan_lua_trang',
        headwearId: 'head_khan_dong',
        handheldId: 'hand_quat_tranh',
        sashId: null,
        paletteId: 'pal_cham_suong',
        stylingReason: 'Phom áo năm thân kín đáo, cổ đứng ngay ngắn, khuy ngọc tay chẽn đĩnh đạc và nghiêm cẩn.',
        culturalNotes: 'Cấu trúc năm thân biểu trưng ngũ thường và tứ thân phụ mẫu che chở thân con bên trong.',
        culturalLabel: 'Tham khảo tư liệu',
        uncertainty: 'Chuẩn mực trang phục thường nhật thời Nguyễn được lưu giữ tại Bảo tàng Cổ vật Cung đình Huế.',
      },
      {
        title: 'Áo tấc gấm hoàng trang nghiêm',
        topId: 'top_ngu_than_thung',
        bottomId: 'bot_quan_lua_trang',
        headwearId: 'head_khan_dong',
        handheldId: 'hand_quat_tranh',
        sashId: null,
        paletteId: 'pal_gam_hoang',
        stylingReason: 'Áo tấc tay rộng buông rủ chấm gối, sắc vàng nghệ cung đình rực rỡ cho ngày hội lớn.',
        culturalNotes: 'Lễ phục ngũ thân tay thụng trang trọng khi tham dự nghi lễ hoặc ngày hội cội nguồn.',
        culturalLabel: 'Tham khảo tư liệu',
        uncertainty: 'Trang phục mang tính tôn nghiêm, cử chỉ hai tay chấp trước ngực để tà tay buông cân đối.',
      },
    ];
  }
}

// ================= SERVE STATIC / VITE MIDDLEWARE =================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Nep Viet full-stack app running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
