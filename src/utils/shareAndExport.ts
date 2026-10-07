/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BASE_OUTFIT_PRESETS,
  COLOR_PALETTES,
  COSTUME_ITEMS,
} from '../data/catalog';
import { OutfitState, SavedLook } from '../types';
import { analyzeOutfit } from './compatibility';

// ================= 1. MÃ HÓA VÀ GIẢI MÃ LIÊN KẾT CHIA SẺ BỘ PHỐI =================
export function encodeOutfitToShareUrl(outfit: OutfitState): string {
  const params = new URLSearchParams();
  params.set('f', outfit.familyId);
  params.set('top', outfit.topId);
  params.set('bot', outfit.bottomId);
  params.set('pal', outfit.paletteId);
  params.set('occ', outfit.occasionId);
  params.set('sty', outfit.styleId);
  if (outfit.sashId) params.set('sash', outfit.sashId);
  if (outfit.headwearId) params.set('head', outfit.headwearId);
  if (outfit.handheldId) params.set('hand', outfit.handheldId);

  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?${params.toString()}`;
}

export function decodeOutfitFromShareUrl(search: string): OutfitState | null {
  try {
    const params = new URLSearchParams(search);
    const familyId = params.get('f') as any;
    const topId = params.get('top');
    const bottomId = params.get('bot');
    const paletteId = params.get('pal');
    const occasionId = (params.get('occ') || 'ky_yeu') as any;
    const styleId = (params.get('sty') || 'nhe_nhang') as any;
    const sashId = params.get('sash');
    const headwearId = params.get('head');
    const handheldId = params.get('hand');

    if (!familyId || !topId || !bottomId || !paletteId) {
      return null;
    }

    // Kiểm tra tính hợp lệ cơ bản
    const topExists = COSTUME_ITEMS.some((i) => i.id === topId);
    const bottomExists = COSTUME_ITEMS.some((i) => i.id === bottomId);
    const palExists = COLOR_PALETTES.some((p) => p.id === paletteId);

    if (!topExists || !bottomExists || !palExists) {
      return null;
    }

    return {
      familyId,
      topId,
      bottomId,
      paletteId,
      occasionId,
      styleId,
      sashId: sashId || null,
      headwearId: headwearId || null,
      handheldId: handheldId || null,
    };
  } catch (error) {
    console.warn('Lỗi phân tích URL chia sẻ:', error);
    return null;
  }
}

// ================= 2. XUẤT ẢNH THẺ LOOKBOOK PNG ĐỘ PHÂN GIẢI CAO (800x1200) =================
export async function exportLookbookCardAsPNG(
  look: SavedLook,
  svgElement?: SVGSVGElement | null
): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 800;
  const height = 1200;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Không thể khởi tạo Canvas 2D context.');

  const palette = COLOR_PALETTES.find((p) => p.id === look.state.paletteId) || COLOR_PALETTES[0];
  const preset = BASE_OUTFIT_PRESETS[look.state.familyId];
  const analysis = analyzeOutfit(look.state);

  // 1. NỀN GIẤY ẤM (#FFFCF5)
  ctx.fillStyle = '#FFFCF5';
  ctx.fillRect(0, 0, width, height);

  // 2. KHUNG VIỀN ĐÔI TRANG NHÃ (#DED7CB)
  ctx.strokeStyle = '#DED7CB';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, width - 48, height - 48);
  ctx.lineWidth = 1;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // 3. TIÊU ĐỀ THƯƠNG HIỆU NẾP VIỆT
  ctx.fillStyle = '#302C27';
  ctx.font = 'bold 28px "Noto Serif", serif';
  ctx.textAlign = 'center';
  ctx.fillText('NẾP VIỆT', width / 2, 85);

  ctx.fillStyle = '#A94D3C';
  ctx.font = '500 13px "Be Vietnam Pro", sans-serif';
  ctx.fillText('MỞ TRANG XƯA, PHỐI CHẤT RIÊNG', width / 2, 110);

  // Đường kẻ phân cách
  ctx.strokeStyle = '#DED7CB';
  ctx.beginPath();
  ctx.moveTo(250, 125);
  ctx.lineTo(550, 125);
  ctx.stroke();

  // 4. THÔNG TIN BỘ PHỐI & NHÃN VĂN HÓA
  ctx.fillStyle = '#302C27';
  ctx.font = 'bold 22px "Noto Serif", serif';
  ctx.fillText(look.name, width / 2, 160);

  ctx.fillStyle = '#71685E';
  ctx.font = '13px "Be Vietnam Pro", sans-serif';
  ctx.fillText(`${preset.name} • ${analysis.culturalLabel} • ${look.createdAt}`, width / 2, 185);

  // 5. VẼ NHÂN VẬT MINH HỌA 2D
  if (svgElement) {
    try {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          // Vẽ nhân vật ở trung tâm thẻ (tỷ lệ 2:3: rộng 360, cao 540)
          const charWidth = 360;
          const charHeight = 540;
          const charX = (width - charWidth) / 2;
          const charY = 210;

          // Nền lót nhẹ cho nhân vật
          ctx.fillStyle = '#F7F4ED';
          ctx.fillRect(charX - 10, charY - 10, charWidth + 20, charHeight + 20);
          ctx.strokeStyle = '#DED7CB';
          ctx.strokeRect(charX - 10, charY - 10, charWidth + 20, charHeight + 20);

          ctx.drawImage(img, charX, charY, charWidth, charHeight);
          URL.revokeObjectURL(blobURL);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(blobURL);
          reject(new Error('Lỗi tải SVG nhân vật lên Canvas.'));
        };
        img.src = blobURL;
      });
    } catch (err) {
      console.warn('Lỗi render SVG nhân vật:', err);
      // Fallback khung vẽ nếu không render được SVG
      ctx.fillStyle = '#F7F4ED';
      ctx.fillRect(200, 210, 400, 540);
      ctx.fillStyle = '#71685E';
      ctx.font = '14px "Be Vietnam Pro", sans-serif';
      ctx.fillText('[Hình minh họa 2D]', width / 2, 480);
    }
  }

  // 6. BẢNG MÀU SẮC TUYỂN CHỌN
  const swatchY = 785;
  ctx.fillStyle = '#71685E';
  ctx.font = 'bold 12px "Be Vietnam Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`BẢNG MÀU: ${palette.name.toUpperCase()}`, width / 2, swatchY);

  // 4 vòng màu: Primary, Secondary, Accent, Bottom
  const swatches = [palette.primary, palette.secondary, palette.accent, palette.bottom];
  const startSwatchX = width / 2 - 60;
  swatches.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(startSwatchX + idx * 40, swatchY + 22, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.stroke();
  });

  // 7. CÂU CHUYỆN LOOKBOOK (60-100 TỪ)
  const storyBoxY = 845;
  ctx.fillStyle = '#F7F4ED';
  ctx.fillRect(70, storyBoxY, width - 140, 160);
  ctx.strokeStyle = '#DED7CB';
  ctx.strokeRect(70, storyBoxY, width - 140, 160);

  ctx.fillStyle = '#302C27';
  ctx.font = 'italic 14px "Be Vietnam Pro", sans-serif';
  ctx.textAlign = 'center';

  // Hàm chia dòng văn bản tự động
  const storyText = `"${look.storyNote}"`;
  const words = storyText.split(' ');
  let line = '';
  let lineY = storyBoxY + 36;
  const maxLineWidth = width - 180;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxLineWidth && n > 0) {
      ctx.fillText(line.trim(), width / 2, lineY);
      line = words[n] + ' ';
      lineY += 24;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), width / 2, lineY);

  // 8. CHÂN TRANG & THÔNG TIN ĐỐI CHIẾU BẢO TÀNG
  ctx.fillStyle = '#71685E';
  ctx.font = '11px "Be Vietnam Pro", sans-serif';
  ctx.fillText('Khảo cứu tư liệu: Bảo tàng Lịch sử Quốc gia & Cố đô Huế', width / 2, 1045);
  ctx.fillText('Bài dự thi "Việt phục Remix" • Minh họa phục trang 2D', width / 2, 1065);

  // 9. KÍCH HOẠT TẢI FILE PNG
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const downloadLink = document.createElement('a');
      const filenameSlug = look.name
        .toLowerCase()
        .replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g, '-')
        .replace(/-+/g, '-');
      downloadLink.download = `nep-viet-${filenameSlug || 'lookbook'}.png`;
      downloadLink.href = URL.createObjectURL(blob);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      resolve();
    }, 'image/png');
  });
}
