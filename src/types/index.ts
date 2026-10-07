/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CostumeFamilyId = 'ao_dai' | 'ao_ngu_than' | 'ao_tu_than';

export type SlotType = 'base_body' | 'top' | 'bottom' | 'sash' | 'headwear' | 'handheld';

export type CulturalLabel = 'Tham khảo tư liệu' | 'Phối đương đại' | 'Phối sáng tạo';

export interface CulturalSource {
  id: string;
  title: string;
  authorOrOrg: string;
  sourceType: 'Bảo tàng' | 'Công trình khảo cứu' | 'Tư liệu lịch sử' | 'Người thực hành văn hóa';
  yearOrPeriod: string;
  excerpt: string;
  detailedArticle?: string;
  url?: string;
  verificationStatus: 'Đã đối chiếu tài liệu' | 'Chưa đối chiếu' | 'Đã được chuyên môn rà soát';
}

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  primary: string;    // Main garment fabric
  secondary: string;  // Inner / collar / lining
  accent: string;     // Sash / hem / detail
  bottom: string;     // Pants / skirt
  harmonyNote: string;
}

export interface CostumeItem {
  id: string;
  familyId: CostumeFamilyId;
  name: string;
  slot: SlotType;
  description: string;
  culturalLabel: CulturalLabel;
  culturalNote: string;
  sourceIds: string[];
  compatibleWith: CostumeFamilyId[];
  isRemovable: boolean;
}

export interface BaseOutfitPreset {
  id: string;
  familyId: CostumeFamilyId;
  name: string;
  subtitle: string;
  eraContext: string;
  description: string;
  items: {
    topId: string;
    bottomId: string;
    sashId?: string;
    headwearId?: string;
    handheldId?: string;
  };
  defaultPaletteId: string;
  sourceIds: string[];
}

export type OccasionId = 'ky_yeu' | 'ngay_hoi' | 'du_xuan' | 'tham_quan';
export type StyleId = 'nhe_nhang' | 'toi_gian' | 'noi_bat';

export interface OutfitState {
  familyId: CostumeFamilyId;
  topId: string;
  bottomId: string;
  sashId: string | null;
  headwearId: string | null;
  handheldId: string | null;
  paletteId: string;
  occasionId: OccasionId;
  styleId: StyleId;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface RigAnchorPoints {
  headTop: Point2D;
  neckCenter: Point2D;
  shoulderLeft: Point2D;
  shoulderRight: Point2D;
  waistCenter: Point2D;
  wristLeft: Point2D;
  wristRight: Point2D;
  feetCenter: Point2D;
}

export const DEFAULT_RIG_ANCHORS: RigAnchorPoints = {
  headTop: { x: 300, y: 95 },
  neckCenter: { x: 300, y: 195 },
  shoulderLeft: { x: 255, y: 225 },
  shoulderRight: { x: 345, y: 225 },
  waistCenter: { x: 300, y: 360 },
  wristLeft: { x: 212, y: 425 },
  wristRight: { x: 388, y: 425 },
  feetCenter: { x: 300, y: 835 },
};

export interface SavedLook {
  id: string;
  name: string;
  createdAt: string;
  state: OutfitState;
  storyNote: string;
}
