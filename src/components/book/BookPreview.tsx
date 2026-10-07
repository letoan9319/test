/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CULTURAL_SOURCES } from '../../data/catalog';
import { CostumeFamilyId, CulturalSource } from '../../types';
import { BookSpreadData, InteractiveBook } from './InteractiveBook';

interface BookPreviewProps {
  onStartStyling: (familyId?: CostumeFamilyId) => void;
  onGoToStudio: () => void;
}

export const BookPreview: React.FC<BookPreviewProps> = ({
  onStartStyling,
  onGoToStudio,
}) => {
  const [spreadIndex, setSpreadIndex] = useState<number>(0);
  const [activeSourceModal, setActiveSourceModal] = useState<CulturalSource | null>(null);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [showBibliographyModal, setShowBibliographyModal] = useState<boolean>(false);
  const [selectedSourceTypeFilter, setSelectedSourceTypeFilter] = useState<string>('all');

  // Đóng toàn bộ modals/popover khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeSourceModal) setActiveSourceModal(null);
        if (showToc) setShowToc(false);
        if (showBibliographyModal) setShowBibliographyModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSourceModal, showToc, showBibliographyModal]);

  // Sáu cặp trang nội dung chuẩn theo đặc tả (12 trang hoàn thiện)
  const spreads: BookSpreadData[] = [
    // CẶP 1: BÌA & LỜI MỞ ĐẦU
    {
      id: 'spread_intro',
      title: 'Mở cuốn sổ & Lời ngỏ',
      leftPage: {
        pageNumber: 1,
        category: 'Giới thiệu sản phẩm',
        title: 'Nếp Việt',
        subtitle: 'Mở trang xưa, phối chất riêng',
        content: `Nếp Việt là cuốn sổ phác thảo tương tác về trang phục truyền thống Việt Nam, nơi vẻ đẹp lịch sử nghìn năm của tà áo dân tộc gặp gỡ tư duy thẩm mỹ đương đại của người trẻ.

Chúng tôi tuyển chọn ba dòng trang phục tiêu biểu cho bản thử nghiệm: Áo ngũ thân (thời Nguyễn), Áo dài truyền thống và Áo tứ thân Kinh Bắc. Mỗi dáng áo là một câu chuyện về nếp sống, cốt cách và tinh thần văn hóa của người Việt qua từng thời kỳ.`,
        footnote: 'Dự án bài thi "Việt phục Remix" - Nghiên cứu và số hóa trang phục dân tộc.',
      },
      rightPage: {
        pageNumber: 2,
        category: 'Mục lục & Phạm vi',
        title: 'Hành trình khám phá',
        subtitle: 'Từ nghiên cứu tư liệu đến thực hành phối đồ',
        content: `Phạm vi tuyển chọn trong bản thử nghiệm này tập trung vào 3 nhóm trang phục phổ biến nhất, không đại diện cho toàn bộ trang phục của 54 dân tộc anh em.

Mục lục các trang:
• Trang 3 - 4: Áo dài và dòng chảy thời gian
• Trang 5 - 6: Áo ngũ thân lập lĩnh thời Nguyễn
• Trang 7 - 8: Áo tứ thân và nét duyên Kinh Bắc
• Trang 9 - 10: Phụ kiện truyền thống & Bảng màu
• Trang 11 - 12: Nguyên tắc phối đồ và Xưởng may đo 2D

Mỗi trang đều có liên kết tư liệu khảo cứu đã đối chiếu nguồn bảo tàng.`,
        sourceId: 'src_nguyen_01',
      },
    },

    // CẶP 2: ÁO DÀI
    {
      id: 'spread_aodai',
      title: 'Áo dài và dòng chảy biến thiên',
      leftPage: {
        pageNumber: 3,
        category: 'Khảo cứu hình thức',
        title: 'Dáng áo thanh tao',
        subtitle: 'Kế thừa từ áo ngũ thân truyền thống',
        content: `Áo dài Việt Nam hiện đại không xuất hiện ngẫu nhiên mà là kết quả của quá trình biến chuyển lịch sử từ áo ngũ thân lập lĩnh.

Đặc điểm nhận diện chính:
Cổ đứng cao vừa vặn ôm cổ, thân áo ôm sát phần ngực eo, hai tà áo buông rủ dài quá gối thướt tha khi sải bước. Tà áo xẻ cao ngang thắt lưng tạo độ chuyển động nhịp nhàng cùng ống quần lụa rộng buông chấm gót chân.

Trang phục tôn vinh sự kín đáo, nhã nhặn mà vẫn tràn đầy nét uyển chuyển của người phụ nữ Việt Nam.`,
        illustrationSilhouette: 'ao_dai',
        sourceId: 'src_aodai_modern_03',
      },
      rightPage: {
        pageNumber: 4,
        category: 'Ngữ cảnh sử dụng',
        title: 'Áo dài trong đời sống',
        subtitle: 'Từ lễ nghi cung đình đến sân trường kỷ yếu',
        content: `Trong thế kỷ XX, áo dài nhanh chóng trở thành quốc phục và đồng phục học đường thân thương của nữ sinh Việt Nam.

Lưu ý khi phối đồ:
• Phối kinh điển: Áo dài trơn lụa màu kết hợp cùng quần lụa trắng hoặc đen, nón lá chóp nhọn quai lụa tơ tằm.
• Phối đương đại: Cổ tròn suông nhẹ, chuỗi ngọc đeo ngực, trâm cài tóc xà cừ.

Sản phẩm ghi nhận rõ ràng các cải biên đương đại để người mặc hiểu đâu là giá trị nguyên bản và đâu là sáng tạo mới.`,
        actionPreset: 'ao_dai',
        actionLabel: 'Thử phối Áo dài ngay',
        sourceId: 'src_aodai_modern_03',
      },
    },

    // CẶP 3: ÁO NGŨ THÂN
    {
      id: 'spread_nguthan',
      title: 'Áo ngũ thân lập lĩnh',
      leftPage: {
        pageNumber: 5,
        category: 'Cấu trúc di sản',
        title: 'Năm thân đoan chính',
        subtitle: 'Chuẩn mực trang phục thời Nguyễn',
        content: `Áo ngũ thân được định hình và quy định chặt chẽ từ thời Chúa Nguyễn Phúc Khoát (1744) và vua Minh Mạng (thế kỷ XIX), là trang phục phổ biến của cả nam và nữ từ thứ dân đến quan lại.

Cấu trúc năm thân mang triết lý sâu sắc:
• Bốn thân ngoài tượng trưng cho "tứ thân phụ mẫu" (cha mẹ đẻ và cha mẹ chồng).
• Thân con thứ năm nằm ẩn bên trong tượng trưng cho bản thân người mặc, được gia đình bao bọc.
• Cổ đứng (lập lĩnh) giữ tư thế ngay ngắn. Năm chiếc khuy cài tượng trưng cho "Ngũ thường": Nhân, Lễ, Nghĩa, Trí, Tín.`,
        illustrationSilhouette: 'ao_ngu_than',
        sourceId: 'src_nguyen_01',
      },
      rightPage: {
        pageNumber: 6,
        category: 'Biến thể & Quy tắc',
        title: 'Tay chẽn và Áo tấc',
        subtitle: 'Phân định sinh hoạt thường nhật và lễ phục',
        content: `Áo ngũ thân có hai biến thể tay chính:
1. Tay chẽn: Cánh tay may thu nhỏ dần ôm cổ tay, tiện cho công việc, đi lại và giao tế hằng ngày.
2. Tay thụng (Áo tấc): Ống tay rộng thụng, buông dài ngang gối, chuyên dùng trong dịp lễ bái, cưới hỏi và đại lễ triều đình.

Khi mặc áo ngũ thân chuẩn mực, người xưa luôn kết hợp cùng khăn đóng xếp nếp gọn gàng trên trán, quần lụa trắng hoặc đen và quạt giấy nan tre.`,
        actionPreset: 'ao_ngu_than',
        actionLabel: 'Thử phối Áo ngũ thân ngay',
        sourceId: 'src_nguyen_01',
      },
    },

    // CẶP 4: ÁO TỨ THÂN
    {
      id: 'spread_tuthan',
      title: 'Áo tứ thân Kinh Bắc',
      leftPage: {
        pageNumber: 7,
        category: 'Dân gian truyền thống',
        title: 'Duyên dáng đất quan họ',
        subtitle: 'Vẻ đẹp mộc mạc châu thổ sông Hồng',
        content: `Áo tứ thân là trang phục truyền thống tiêu biểu của phụ nữ miền Bắc Việt Nam, đặc biệt gắn với vùng văn hóa Kinh Bắc và các hội làng mùa xuân.

Đặc điểm cấu tạo:
Áo dài ngang bắp chân, gồm bốn thân vải ghép lại: hai thân sau may liền ở sống lưng (sống áo), hai thân trước xẻ rời buông lửng hoặc buộc vạt phía trước bụng khi làm lụng hay trẩy hội.

Bên trong áo tứ thân luôn là chiếc yếm cổ xây kín đáo, khoác ngoài bằng áo cánh mỏng và thắt dải bao lụa hồng hoa.`,
        illustrationSilhouette: 'ao_tu_than',
        sourceId: 'src_kinh_bac_02',
      },
      rightPage: {
        pageNumber: 8,
        category: 'Phụ kiện đi kèm',
        title: 'Nón ba tầm & Váy sồi',
        subtitle: 'Hòa sắc rực rỡ mà đằm thắm',
        content: `Bộ trang phục tứ thân chuẩn hội làng không thể thiếu:
• Váy lụa sồi đen buông dài kín gót, dập dờn theo bước chân.
• Dải thắt lưng bao bằng lụa màu đào hoặc xanh cốm, thắt nút ngang eo buông hai đầu dải mềm mại.
• Nón ba tầm (nón quai thao) tròn rộng che mát, có hai chùm tua thao rủ bên vai.

Đây là mẫu trang phục hoàn hảo cho ngày hội văn hóa sinh viên và các chương trình nghệ thuật dân gian.`,
        actionPreset: 'ao_tu_than',
        actionLabel: 'Thử phối Áo tứ thân ngay',
        sourceId: 'src_kinh_bac_02',
      },
    },

    // CẶP 5: PHỤ KIỆN & BẢNG MÀU
    {
      id: 'spread_phukien_mau',
      title: 'Phụ kiện và quy tắc hòa sắc',
      leftPage: {
        pageNumber: 9,
        category: 'Phụ kiện tuyển chọn',
        title: 'Vật phẩm tôn dáng',
        subtitle: 'Sự ăn ý giữa trang phục và phụ kiện',
        content: `Mỗi phụ kiện trong Nếp Việt đều được tạo hình chính xác theo tỷ lệ cơ thể nhân vật:
• Khăn đóng: Tạo khối nghiêm cẩn cho áo ngũ thân.
• Nón lá chóp nhọn: Đi liền với tà áo dài hai tà.
• Nón quai thao: Điểm nhấn không thể thay thế của áo tứ thân.
• Quạt nan tre giấy dó: Phụ kiện cầm tay thanh nhã, đa dụng.
• Trâm cài & chuỗi ngọc: Dấu ấn tân thời trang nhã cho sự kiện kỷ yếu.`,
        illustrationSilhouette: 'phu_kien',
        sourceId: 'src_phukien_04',
      },
      rightPage: {
        pageNumber: 10,
        category: 'Hài hòa màu sắc',
        title: 'Sáu bảng màu tự nhiên',
        subtitle: 'Lấy cảm hứng từ chất nhuộm và thẩm mỹ Việt',
        content: `Bảng màu trong ứng dụng được thiết kế dựa trên các gam màu truyền thống:
• Chu sa trầm: Đỏ son đất ấm cúng, sang trọng.
• Thanh trà: Xanh ngọc mát lành, điềm tĩnh.
• Mây lam: Xanh chàm cổ điển thanh tao.
• Gấm hoàng: Vàng nghệ rực rỡ cung đình.
• Tố nữ: Trắng ngà và đen mộc mạc tối giản.
• Chàm sương: Khói lam tím thanh lịch.

Mỗi bảng màu được phân bổ chính xác vào thân áo, cổ áo, dải thắt và quần lụa để bảo đảm tương phản hài hòa.`,
        sourceId: 'src_phukien_04',
      },
    },

    // CẶP 6: CHUYỂN GIAO XƯỞNG PHỐI
    {
      id: 'spread_thuchanh',
      title: 'Từ tìm hiểu đến thực hành',
      leftPage: {
        pageNumber: 11,
        category: 'Sáng tạo có ý thức',
        title: 'Phối đồ có nguồn gốc',
        subtitle: 'Tự tin mặc đẹp với kiến thức chuẩn xác',
        content: `Việc cách tân trang phục truyền thống là dòng chảy tự nhiên của thời đại, nhưng sự sáng tạo đẹp nhất luôn bắt đầu từ việc hiểu đúng nguyên bản.

Khi phối đồ trong Xưởng phối:
• Ứng dụng sẽ tự động phân loại rõ: "Tham khảo tư liệu", "Phối đương đại" hay "Phối sáng tạo".
• Không bao giờ chấm điểm đúng sai giả tạo, mà giải thích cụ thể chi tiết nào dựa trên hiện vật lịch sử và chi tiết nào là cải biên thẩm mỹ.
• Bạn luôn có thể đối chiếu nguồn bảo tàng bất cứ lúc nào.`,
        sourceId: 'src_sangtao_05',
      },
      rightPage: {
        pageNumber: 12,
        category: 'Bắt đầu',
        title: 'Bước vào Xưởng phối 2D',
        subtitle: 'Mở trang xưa, phối chất riêng',
        content: `Bạn đã sẵn sàng hóa thân thành nhà thiết kế thời trang cho chính mình?

Chọn một trong ba phom dáng nền tảng hoặc bước thẳng vào xưởng để tự do thay đổi từng lớp trang phục, màu sắc và phụ kiện trên nhân vật mẫu.

Sau khi phối xong, bạn có thể nhận gợi ý từ trí tuệ nhân tạo Gemini, so sánh hai phương án và xuất thẻ Lookbook cá nhân.`,
        isFinalPage: true,
        sourceId: 'src_sangtao_05',
      },
    },
  ];

  const allSourcesList = Object.values(CULTURAL_SOURCES);
  const filteredSources = selectedSourceTypeFilter === 'all'
    ? allSourcesList
    : allSourcesList.filter((s) => s.sourceType === selectedSourceTypeFilter);

  return (
    <div className="relative w-full max-w-5xl mx-auto py-4 px-4 flex flex-col items-center">
      {/* Thanh điều hướng trên cùng */}
      <div className="w-full flex items-center justify-between mb-3 border-b border-[#DED7CB] pb-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-[#302C27] tracking-wide">
            Cuốn sổ minh họa Nếp Việt
          </span>
          <span className="text-[#71685E]">
            (Cặp {spreadIndex + 1}/{spreads.length})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowToc(!showToc)}
            className="px-3 py-1.5 border border-[#DED7CB] bg-[#FFFCF5] hover:bg-[#F0EAE1] text-[#302C27] font-medium rounded transition"
          >
            {showToc ? 'Đóng mục lục' : 'Mục lục sách'}
          </button>
          <button
            onClick={() => setShowBibliographyModal(true)}
            className="px-3 py-1.5 border border-[#71806A] text-[#71806A] hover:bg-[#71806A]/10 font-medium rounded transition"
          >
            Danh mục nguồn khảo cứu
          </button>
          <button
            onClick={onGoToStudio}
            className="px-3 py-1.5 bg-[#A94D3C] hover:bg-[#8F3F30] text-[#FFFCF5] font-medium rounded transition shadow-sm"
          >
            Vào xưởng phối ngay
          </button>
        </div>
      </div>

      {/* Popover mục lục */}
      {showToc && (
        <div className="w-full mb-3 p-3 bg-[#FFFCF5] border border-[#DED7CB] rounded shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs z-30">
          {spreads.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setSpreadIndex(idx);
                setShowToc(false);
              }}
              className={`text-left p-2 rounded border transition ${
                idx === spreadIndex
                  ? 'border-[#A94D3C] bg-[#A94D3C]/5 font-semibold text-[#A94D3C]'
                  : 'border-[#DED7CB] hover:bg-[#F7F4ED] text-[#302C27]'
              }`}
            >
              <div className="text-[10px] text-[#71685E]">Trang {idx * 2 + 1} - {idx * 2 + 2}</div>
              <div className="text-xs mt-0.5 font-medium">{s.title}</div>
            </button>
          ))}
        </div>
      )}

      {/* Sách tương tác CSS 3D nhiều dải */}
      <InteractiveBook
        spreads={spreads}
        currentSpreadIndex={spreadIndex}
        onSpreadChange={setSpreadIndex}
        onOpenSourceModal={(sourceId) => {
          if (CULTURAL_SOURCES[sourceId]) {
            setActiveSourceModal(CULTURAL_SOURCES[sourceId]);
          }
        }}
        onStartStylingPreset={(familyId) => onStartStyling(familyId as CostumeFamilyId)}
        onGoToStudio={onGoToStudio}
      />

      {/* MODAL 1: Bảng đọc sâu bài nghiên cứu chuyên đề (250-450 từ) */}
      {activeSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302C27]/50 backdrop-blur-xs">
          <div className="bg-[#FFFCF5] border border-[#DED7CB] max-w-2xl w-full rounded-lg shadow-2xl p-6 text-[#302C27] max-h-[85vh] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between border-b border-[#DED7CB] pb-3 mb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#71806A] block">
                    {activeSourceModal.sourceType} • {activeSourceModal.verificationStatus}
                  </span>
                  <h3 className="text-xl font-serif-title font-semibold text-[#302C27] mt-1">
                    {activeSourceModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSourceModal(null)}
                  className="text-xs px-2.5 py-1 border border-[#DED7CB] rounded hover:bg-[#F0EAE1] text-[#71685E]"
                >
                  Đóng bảng đọc
                </button>
              </div>

              <div className="text-xs text-[#71685E] mb-3">
                Đơn vị nghiên cứu / Bảo tồn: <span className="font-medium text-[#302C27]">{activeSourceModal.authorOrOrg}</span>
                <br />
                Niên đại / Phạm vi: <span className="font-medium text-[#302C27]">{activeSourceModal.yearOrPeriod}</span>
              </div>

              {/* Đoạn trích dẫn ngắn */}
              <div className="bg-[#F7F4ED] p-3 rounded border border-[#DED7CB] text-xs leading-relaxed italic text-[#302C27] mb-4">
                "{activeSourceModal.excerpt}"
              </div>

              {/* Bài khảo cứu chuyên sâu (250-450 từ) */}
              {activeSourceModal.detailedArticle && (
                <div className="text-xs leading-relaxed text-[#302C27] space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
                  <span className="font-semibold text-[#302C27] block uppercase tracking-wider text-[11px] font-serif-title">
                    Khảo cứu chi tiết từ tài liệu
                  </span>
                  <div className="whitespace-pre-line text-[#302C27]">
                    {activeSourceModal.detailedArticle}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#DED7CB] flex items-center justify-between text-xs mt-4">
              {activeSourceModal.url ? (
                <div className="truncate mr-3">
                  <span className="text-[#71685E]">Cổng tra cứu: </span>
                  <a
                    href={activeSourceModal.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#A94D3C] underline hover:text-[#8F3F30]"
                  >
                    {activeSourceModal.url}
                  </a>
                </div>
              ) : (
                <span className="text-[#71685E] italic">Lưu trữ hiện vật thực tế</span>
              )}

              <button
                onClick={() => setActiveSourceModal(null)}
                className="px-4 py-1.5 bg-[#302C27] text-[#FFFCF5] rounded hover:bg-[#453F39] font-medium"
              >
                Đã tiếp thu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Danh mục nguồn khảo cứu & Ghi công tập trung (Centralized Bibliography) */}
      {showBibliographyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302C27]/50 backdrop-blur-xs">
          <div className="bg-[#FFFCF5] border border-[#DED7CB] max-w-3xl w-full rounded-lg shadow-2xl p-6 text-[#302C27] max-h-[85vh] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between border-b border-[#DED7CB] pb-3 mb-4">
                <div>
                  <h3 className="text-xl font-serif-title font-semibold text-[#302C27]">
                    Danh mục nguồn khảo cứu & Ghi công di sản
                  </h3>
                  <p className="text-xs text-[#71685E] mt-1">
                    Toàn bộ tư liệu đối chiếu cho ba dòng trang phục: Áo ngũ thân, Áo dài và Áo tứ thân.
                  </p>
                </div>
                <button
                  onClick={() => setShowBibliographyModal(false)}
                  className="text-xs px-2.5 py-1 border border-[#DED7CB] rounded hover:bg-[#F0EAE1] text-[#71685E]"
                >
                  Đóng danh mục
                </button>
              </div>

              {/* Bộ lọc phân loại nguồn */}
              <div className="flex items-center space-x-2 mb-4 text-xs">
                <span className="text-[#71685E]">Lọc theo loại:</span>
                {['all', 'Bảo tàng', 'Công trình khảo cứu', 'Tư liệu lịch sử'].map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setSelectedSourceTypeFilter(filterKey)}
                    className={`px-2.5 py-1 rounded border transition ${
                      selectedSourceTypeFilter === filterKey
                        ? 'border-[#302C27] bg-[#302C27] text-[#FFFCF5]'
                        : 'border-[#DED7CB] bg-[#FFFCF5] hover:bg-[#F7F4ED] text-[#302C27]'
                    }`}
                  >
                    {filterKey === 'all' ? 'Tất cả nguồn' : filterKey}
                  </button>
                ))}
              </div>

              {/* Danh sách các nguồn khảo cứu */}
              <div className="flex flex-col space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {filteredSources.map((source) => (
                  <div
                    key={source.id}
                    className="p-3.5 rounded border border-[#DED7CB] bg-[#F7F4ED] text-xs flex flex-col space-y-1.5"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-sm text-[#302C27]">{source.title}</span>
                      <span className="text-[10px] font-medium bg-[#71806A]/15 text-[#71806A] px-2 py-0.5 rounded">
                        {source.verificationStatus}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#71685E]">
                      {source.authorOrOrg} • Niên đại: {source.yearOrPeriod}
                    </div>

                    <p className="text-[11px] text-[#302C27] leading-relaxed italic">
                      "{source.excerpt}"
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => {
                          setShowBibliographyModal(false);
                          setActiveSourceModal(source);
                        }}
                        className="text-[#A94D3C] hover:underline font-medium"
                      >
                        Đọc toàn văn bài khảo cứu
                      </button>

                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#71685E] underline hover:text-[#302C27]"
                        >
                          Cổng bảo tàng
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#DED7CB] flex justify-end text-xs mt-4">
              <button
                onClick={() => setShowBibliographyModal(false)}
                className="px-4 py-2 bg-[#302C27] text-[#FFFCF5] rounded hover:bg-[#453F39] font-medium"
              >
                Đóng danh mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
