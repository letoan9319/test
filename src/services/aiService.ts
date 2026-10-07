/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OutfitState } from '../types';

export interface GeminiSuggestion {
  title: string;
  topId: string;
  bottomId: string;
  headwearId: string | null;
  handheldId: string | null;
  sashId: string | null;
  paletteId: string;
  stylingReason: string;
  culturalNotes: string;
  culturalLabel: string;
  uncertainty?: string;
}

export interface SuggestionResponse {
  isFallback: boolean;
  fallbackNotice?: string;
  suggestions: GeminiSuggestion[];
}

export interface StoryResponse {
  isFallback: boolean;
  story: string;
}

export async function fetchGeminiSuggestions(outfit: OutfitState): Promise<SuggestionResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 giây timeout

  try {
    const res = await fetch('/api/gemini/suggest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentOutfit: outfit,
        occasionId: outfit.occasionId,
        styleId: outfit.styleId,
        familyId: outfit.familyId,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    return {
      isFallback: data.isFallback || false,
      fallbackNotice: data.fallbackNotice,
      suggestions: data.suggestions || [],
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('Lỗi gọi API Gemini (chuyển sang gợi ý có sẵn):', error);

    // Fallback chuẩn bị trước
    return {
      isFallback: true,
      fallbackNotice: 'Gợi ý có sẵn (Dự phòng mạng/API)',
      suggestions: [
        {
          title: 'Phối màu chuẩn mực thanh lịch',
          topId: outfit.topId,
          bottomId: outfit.bottomId,
          headwearId: outfit.headwearId,
          handheldId: outfit.handheldId,
          sashId: outfit.sashId,
          paletteId: 'pal_cham_suong',
          stylingReason: 'Sắc chàm sương trang nhã kết hợp hài hòa cùng phom áo truyền thống.',
          culturalNotes: 'Tuân thủ các quy tắc phối màu tự nhiên từ chất liệu tơ tằm cổ truyền.',
          culturalLabel: 'Tham khảo tư liệu',
        },
      ],
    };
  }
}

export async function fetchGeminiStory(outfit: OutfitState, lookName: string): Promise<StoryResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch('/api/gemini/story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        outfit,
        lookName,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    return {
      isFallback: data.isFallback || false,
      story: data.story || '',
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('Lỗi gọi API câu chuyện Gemini:', error);
    return {
      isFallback: true,
      story: `Sắc áo cổ truyền buông rủ thanh tao hòa cùng nét tươi mới của thế hệ trẻ hôm nay, lưu giữ trọn vẹn vẻ đẹp của văn hóa dân tộc qua từng đường kim nếp vải.`,
    };
  }
}
