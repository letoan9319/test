/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BASE_OUTFIT_PRESETS,
  COLOR_PALETTES,
  COSTUME_ITEMS,
  CULTURAL_SOURCES,
  OCCASIONS,
  STYLES,
} from '../data/catalog';
import {
  CostumeFamilyId,
  CulturalLabel,
  CulturalSource,
  OutfitState,
} from '../types';

export interface OutfitAnalysisResult {
  culturalLabel: CulturalLabel;
  suitabilityTitle: string;
  suitabilityExplanation: string;
  colorHarmonyNote: string;
  culturalNote: string;
  primarySource?: CulturalSource;
  compatibilityAdvice?: string;
  isCrossFamily: boolean;
}

export function validateAndAdaptOutfit(
  targetFamilyId: CostumeFamilyId,
  currentOutfit: OutfitState
): OutfitState {
  const preset = BASE_OUTFIT_PRESETS[targetFamilyId];

  // Kiểm tra tương thích của Quần / Váy
  const currentBottom = COSTUME_ITEMS.find((i) => i.id === currentOutfit.bottomId);
  let adaptedBottomId = currentOutfit.bottomId;
  if (!currentBottom || !currentBottom.compatibleWith.includes(targetFamilyId)) {
    adaptedBottomId = preset.items.bottomId;
  }

  // Kiểm tra tương thích của Dải bao (chỉ tứ thân có dải bao mặc định)
  let adaptedSashId = currentOutfit.sashId;
  if (targetFamilyId !== 'ao_tu_than') {
    adaptedSashId = null;
  } else if (!adaptedSashId) {
    adaptedSashId = preset.items.sashId || null;
  }

  // Kiểm tra tương thích của Phụ kiện đầu
  const currentHead = currentOutfit.headwearId
    ? COSTUME_ITEMS.find((i) => i.id === currentOutfit.headwearId)
    : null;
  let adaptedHeadId = currentOutfit.headwearId;
  if (currentHead && !currentHead.compatibleWith.includes(targetFamilyId)) {
    adaptedHeadId = preset.items.headwearId || null;
  }

  return {
    ...currentOutfit,
    familyId: targetFamilyId,
    topId: preset.items.topId,
    bottomId: adaptedBottomId,
    sashId: adaptedSashId,
    headwearId: adaptedHeadId,
    handheldId: currentOutfit.handheldId,
  };
}

export function analyzeOutfit(outfit: OutfitState): OutfitAnalysisResult {
  const top = COSTUME_ITEMS.find((i) => i.id === outfit.topId);
  const bottom = COSTUME_ITEMS.find((i) => i.id === outfit.bottomId);
  const head = outfit.headwearId ? COSTUME_ITEMS.find((i) => i.id === outfit.headwearId) : null;
  const sash = outfit.sashId ? COSTUME_ITEMS.find((i) => i.id === outfit.sashId) : null;
  const hand = outfit.handheldId ? COSTUME_ITEMS.find((i) => i.id === outfit.handheldId) : null;

  const palette = COLOR_PALETTES.find((p) => p.id === outfit.paletteId) || COLOR_PALETTES[0];
  const occasion = OCCASIONS.find((o) => o.id === outfit.occasionId) || OCCASIONS[0];
  const style = STYLES.find((s) => s.id === outfit.styleId) || STYLES[0];

  // Kiểm tra lai ghép khác dòng (cross-family)
  const isCrossFamily =
    Boolean(head && !head.compatibleWith.includes(outfit.familyId)) ||
    Boolean(bottom && !bottom.compatibleWith.includes(outfit.familyId)) ||
    Boolean(sash && outfit.familyId !== 'ao_tu_than');

  // Xác định nhãn văn hóa
  let culturalLabel: CulturalLabel = 'Tham khảo tư liệu';
  if (isCrossFamily) {
    culturalLabel = 'Phối sáng tạo';
  } else if (
    top?.culturalLabel === 'Phối đương đại' ||
    head?.culturalLabel === 'Phối đương đại' ||
    hand?.culturalLabel === 'Phối đương đại' ||
    sash?.culturalLabel === 'Phối đương đại'
  ) {
    culturalLabel = 'Phối đương đại';
  }

  // Giải thích sự phù hợp với Tình huống (Occasion)
  let occasionReason = '';
  switch (outfit.occasionId) {
    case 'ky_yeu':
      occasionReason = `Phù hợp với chụp ảnh kỷ yếu học đường nhờ phom dáng thanh lịch, đường nét chỉn chu và trang nhã, tạo nét duyên dáng hoài niệm.`;
      break;
    case 'ngay_hoi':
      occasionReason = `Tạo ấn tượng trang trọng và đậm đà bản sắc dân tộc trong ngày hội văn hóa, tôn vinh cội nguồn văn hóa truyền thống.`;
      break;
    case 'du_xuan':
      occasionReason = `Lý tưởng cho trẩy hội du xuân đầu năm, dễ chịu khi tản bộ, hòa sắc tươi tắn ấm cúng.`;
      break;
    case 'tham_quan':
      occasionReason = `Lịch thiệp và trang nhã khi tham quan di tích lịch sử, bảo tàng cổ kính, thể hiện sự trân trọng không gian văn hóa.`;
      break;
  }

  // Giải thích phong cách thẩm mỹ (Style)
  let styleReason = '';
  switch (outfit.styleId) {
    case 'nhe_nhang':
      styleReason = `Định hướng nhẹ nhàng tôn lên chất liệu vải mềm rủ, phụ kiện tiết chế giúp diện mạo thanh thoát.`;
      break;
    case 'toi_gian':
      styleReason = `Định hướng tối giản tập trung vào hình khối thuần khiết của trang phục, lược bỏ chi tiết rườm rà.`;
      break;
    case 'noi_bat':
      styleReason = `Định hướng nổi bật tạo điểm nhấn sắc nét qua tương phản màu sắc và các phụ kiện mang dấu ấn rực rỡ.`;
      break;
  }

  const suitabilityTitle = `Phối đồ cho ${occasion.name} theo phong cách ${style.name}`;
  const suitabilityExplanation = `${occasionReason} ${styleReason}`;

  // Lời khuyên văn hóa mang tính tôn trọng, xây dựng
  let culturalAdvice = '';
  if (culturalLabel === 'Phối sáng tạo') {
    culturalAdvice =
      'Phương án này kết hợp các chi tiết thuộc nhiều dòng trang phục khác nhau theo cảm hứng cá nhân. Bạn có thể tự tin lưu dưới nhãn "Phối sáng tạo"; phần diễn giải lưu ý không mô tả đây là phục dựng lịch sử nguyên bản.';
  } else if (culturalLabel === 'Phối đương đại') {
    culturalAdvice =
      'Trang phục giữ phom dáng nền tảng truyền thống và ứng dụng các cải biên đương đại (như cổ tròn mở nhẹ hay chuỗi ngọc) giúp thuận tiện trong sinh hoạt của người trẻ hôm nay.';
  } else {
    culturalAdvice =
      'Bộ trang phục tuân thủ các quy tắc phục sức và phối phụ kiện ghi nhận trong các tài liệu khảo cứu bảo tàng chính thức.';
  }

  // Lấy nguồn khảo cứu đại diện
  const primarySourceId = top?.sourceIds[0] || 'src_nguyen_01';
  const primarySource = CULTURAL_SOURCES[primarySourceId];

  return {
    culturalLabel,
    suitabilityTitle,
    suitabilityExplanation,
    colorHarmonyNote: palette.harmonyNote,
    culturalNote: top?.culturalNote || '',
    primarySource,
    compatibilityAdvice: culturalAdvice,
    isCrossFamily,
  };
}

export interface ComparisonDiffItem {
  attribute: string;
  valueA: string;
  valueB: string;
  isDifferent: boolean;
}

export function compareOutfits(
  lookA: OutfitState,
  lookB: OutfitState
): ComparisonDiffItem[] {
  const presetA = BASE_OUTFIT_PRESETS[lookA.familyId];
  const presetB = BASE_OUTFIT_PRESETS[lookB.familyId];

  const topA = COSTUME_ITEMS.find((i) => i.id === lookA.topId);
  const topB = COSTUME_ITEMS.find((i) => i.id === lookB.topId);

  const bottomA = COSTUME_ITEMS.find((i) => i.id === lookA.bottomId);
  const bottomB = COSTUME_ITEMS.find((i) => i.id === lookB.bottomId);

  const headA = lookA.headwearId ? COSTUME_ITEMS.find((i) => i.id === lookA.headwearId) : null;
  const headB = lookB.headwearId ? COSTUME_ITEMS.find((i) => i.id === lookB.headwearId) : null;

  const handA = lookA.handheldId ? COSTUME_ITEMS.find((i) => i.id === lookA.handheldId) : null;
  const handB = lookB.handheldId ? COSTUME_ITEMS.find((i) => i.id === lookB.handheldId) : null;

  const palA = COLOR_PALETTES.find((p) => p.id === lookA.paletteId) || COLOR_PALETTES[0];
  const palB = COLOR_PALETTES.find((p) => p.id === lookB.paletteId) || COLOR_PALETTES[0];

  const analysisA = analyzeOutfit(lookA);
  const analysisB = analyzeOutfit(lookB);

  return [
    {
      attribute: 'Dòng trang phục',
      valueA: presetA.name,
      valueB: presetB.name,
      isDifferent: lookA.familyId !== lookB.familyId,
    },
    {
      attribute: 'Mẫu áo',
      valueA: topA?.name || 'Chưa chọn',
      valueB: topB?.name || 'Chưa chọn',
      isDifferent: lookA.topId !== lookB.topId,
    },
    {
      attribute: 'Quần hoặc váy',
      valueA: bottomA?.name || 'Chưa chọn',
      valueB: bottomB?.name || 'Chưa chọn',
      isDifferent: lookA.bottomId !== lookB.bottomId,
    },
    {
      attribute: 'Bảng màu chính',
      valueA: palA.name,
      valueB: palB.name,
      isDifferent: lookA.paletteId !== lookB.paletteId,
    },
    {
      attribute: 'Phụ kiện đầu',
      valueA: headA ? headA.name : 'Không dùng',
      valueB: headB ? headB.name : 'Không dùng',
      isDifferent: lookA.headwearId !== lookB.headwearId,
    },
    {
      attribute: 'Phụ kiện tay',
      valueA: handA ? handA.name : 'Không dùng',
      valueB: handB ? handB.name : 'Không dùng',
      isDifferent: lookA.handheldId !== lookB.handheldId,
    },
    {
      attribute: 'Nhãn văn hóa',
      valueA: analysisA.culturalLabel,
      valueB: analysisB.culturalLabel,
      isDifferent: analysisA.culturalLabel !== analysisB.culturalLabel,
    },
  ];
}
