/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BASE_OUTFIT_PRESETS, COLOR_PALETTES } from '../../data/catalog';
import { CostumeFamilyId, CulturalLabel, OutfitState, SavedLook } from '../../types';
import { analyzeOutfit } from '../../utils/compatibility';
import {
  encodeOutfitToShareUrl,
  exportLookbookCardAsPNG,
} from '../../utils/shareAndExport';
import { CharacterCanvas } from '../character/CharacterCanvas';

interface LookbookViewProps {
  savedLooks: SavedLook[];
  onOpenLook: (state: OutfitState) => void;
  onDeleteLook: (id: string) => void;
  onRenameLook?: (id: string, newName: string) => void;
  onGoToStudio: () => void;
}

type FamilyFilter = 'all' | CostumeFamilyId;
type LabelFilter = 'all' | CulturalLabel;
type SortOption = 'newest' | 'oldest' | 'name_asc';

interface FilterTabOption {
  id: FamilyFilter;
  label: string;
  shortLabel: string;
}

const FAMILY_FILTER_TABS: FilterTabOption[] = [
  { id: 'all', label: 'Tất cả trang phục', shortLabel: 'Tất cả' },
  { id: 'ao_ngu_than', label: 'Áo ngũ thân', shortLabel: 'Áo ngũ thân' },
  { id: 'ao_dai', label: 'Áo dài', shortLabel: 'Áo dài' },
  { id: 'ao_tu_than', label: 'Áo tứ thân', shortLabel: 'Áo tứ thân' },
];

export const LookbookView: React.FC<LookbookViewProps> = ({
  savedLooks,
  onOpenLook,
  onDeleteLook,
  onRenameLook,
  onGoToStudio,
}) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [isExportingId, setIsExportingId] = useState<string | null>(null);

  // Bộ lọc theo loại trang phục
  const [selectedFamily, setSelectedFamily] = useState<FamilyFilter>('all');
  // Bộ lọc phụ theo định hướng văn hóa
  const [selectedLabel, setSelectedLabel] = useState<LabelFilter>('all');
  // Tìm kiếm theo từ khóa
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Sắp xếp
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Modal đổi tên bộ phối
  const [editingLook, setEditingLook] = useState<SavedLook | null>(null);
  const [newTitleInput, setNewTitleInput] = useState<string>('');

  // Map lưu refs của các SVG phần tử để xuất Canvas độ phân giải cao
  const svgRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Đóng modal đổi tên khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingLook) setEditingLook(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingLook]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

  const handleCopyShareLink = (look: SavedLook) => {
    try {
      const shareUrl = encodeOutfitToShareUrl(look.state);
      navigator.clipboard.writeText(shareUrl);
      showToast('Đã sao chép liên kết chia sẻ bộ phối vào bộ nhớ tạm.');
    } catch {
      showToast('Không thể sao chép liên kết, vui lòng thử lại.');
    }
  };

  const handleExportPNG = async (look: SavedLook) => {
    setIsExportingId(look.id);
    try {
      const container = svgRefs.current[look.id];
      const svgElement = container ? container.querySelector('svg') : null;

      await exportLookbookCardAsPNG(look, svgElement);
      showToast(`Đã xuất và tải xuống thẻ Lookbook "${look.name}".`);
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi xuất ảnh, vui lòng thử lại.');
    } finally {
      setIsExportingId(null);
    }
  };

  const handleStartRename = (look: SavedLook) => {
    setEditingLook(look);
    setNewTitleInput(look.name);
  };

  const handleConfirmRename = () => {
    if (editingLook && newTitleInput.trim() && onRenameLook) {
      onRenameLook(editingLook.id, newTitleInput.trim());
      showToast('Đã cập nhật tên bộ phối.');
    }
    setEditingLook(null);
  };

  // Thống kê số lượng trang phục theo từng loại
  const familyCounts = useMemo(() => {
    const counts: Record<FamilyFilter, number> = {
      all: savedLooks.length,
      ao_ngu_than: 0,
      ao_dai: 0,
      ao_tu_than: 0,
    };
    savedLooks.forEach((look) => {
      const fId = look.state.familyId;
      if (counts[fId] !== undefined) {
        counts[fId]++;
      }
    });
    return counts;
  }, [savedLooks]);

  // Lọc và sắp xếp danh sách
  const filteredAndSortedLooks = useMemo(() => {
    const result = savedLooks.filter((look) => {
      // Lọc theo loại trang phục
      if (selectedFamily !== 'all' && look.state.familyId !== selectedFamily) {
        return false;
      }

      // Lọc theo nhãn văn hóa
      if (selectedLabel !== 'all') {
        const analysis = analyzeOutfit(look.state);
        if (analysis.culturalLabel !== selectedLabel) {
          return false;
        }
      }

      // Lọc theo từ khóa tìm kiếm (tên hoặc ghi chú)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = look.name.toLowerCase().includes(query);
        const matchesStory = look.storyNote?.toLowerCase().includes(query);
        if (!matchesName && !matchesStory) {
          return false;
        }
      }

      return true;
    });

    // Sắp xếp
    return result.sort((a, b) => {
      if (sortOption === 'name_asc') {
        return a.name.localeCompare(b.name, 'vi');
      }
      if (sortOption === 'oldest') {
        return a.id.localeCompare(b.id);
      }
      // default: newest
      return b.id.localeCompare(a.id);
    });
  }, [savedLooks, selectedFamily, selectedLabel, searchQuery, sortOption]);

  const handleResetFilters = () => {
    setSelectedFamily('all');
    setSelectedLabel('all');
    setSearchQuery('');
  };

  const isFilterActive = selectedFamily !== 'all' || selectedLabel !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#302C27] text-[#FFFCF5] px-4 py-2.5 rounded shadow-lg text-xs tracking-wide">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#DED7CB] pb-4 mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-serif-title font-semibold text-[#302C27]">
            Lookbook cá nhân
          </h2>
          <p className="text-xs text-[#71685E] mt-1">
            Bộ sưu tập các phương án Việt phục bạn đã lưu và các câu chuyện văn hóa kèm theo.
          </p>
        </div>
        <button
          onClick={onGoToStudio}
          className="px-4 py-2 bg-[#A94D3C] hover:bg-[#8F3F30] text-[#FFFCF5] text-xs font-semibold rounded uppercase tracking-wider transition shadow-sm"
        >
          Tạo bộ phối mới
        </button>
      </div>

      {savedLooks.length === 0 ? (
        <div className="p-12 text-center bg-[#FFFCF5] border border-[#DED7CB] rounded-lg">
          <h3 className="text-lg font-serif-title font-medium text-[#302C27] mb-2">
            Chưa có bộ phối nào được lưu
          </h3>
          <p className="text-xs text-[#71685E] max-w-md mx-auto mb-6">
            Hãy vào Xưởng phối để sáng tạo màu sắc, phụ kiện, nhờ Gemini viết chuyện và lưu các bộ trang phục bạn ưng ý vào Lookbook này.
          </p>
          <button
            onClick={onGoToStudio}
            className="px-5 py-2.5 bg-[#302C27] hover:bg-[#453F39] text-[#FFFCF5] text-xs font-medium rounded transition"
          >
            Vào xưởng phối 2D
          </button>
        </div>
      ) : (
        <>
          {/* THANH BỘ LỌC (FILTERS BAR) */}
          <div className="bg-[#FFFCF5] border border-[#DED7CB] rounded-lg p-3.5 mb-6 shadow-xs">
            {/* Hàng 1: Tabs lọc theo loại trang phục */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#DED7CB]/60 pb-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-[#302C27] mr-1 hidden sm:inline">
                  Loại trang phục:
                </span>
                {FAMILY_FILTER_TABS.map((tab) => {
                  const isSelected = selectedFamily === tab.id;
                  const count = familyCounts[tab.id];

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedFamily(tab.id)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-[#302C27] text-[#FFFCF5] shadow-xs'
                          : 'bg-[#F7F4ED] text-[#71685E] hover:text-[#302C27] hover:bg-[#ECE6DA] border border-[#DED7CB]/70'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                          isSelected
                            ? 'bg-[#A94D3C] text-white'
                            : 'bg-[#DED7CB] text-[#302C27]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bộ đếm kết quả */}
              <div className="text-xs text-[#71685E] flex items-center gap-2 self-end md:self-auto">
                <span>
                  Hiển thị <strong className="text-[#302C27]">{filteredAndSortedLooks.length}</strong> / {savedLooks.length} bộ
                </span>
                {isFilterActive && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-[#A94D3C] hover:underline font-medium"
                  >
                    Bỏ lọc
                  </button>
                )}
              </div>
            </div>

            {/* Hàng 2: Tìm kiếm, lọc định hướng & sắp xếp */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
                {/* Ô tìm kiếm */}
                <div className="relative flex-1 min-w-[180px] max-w-xs">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên bộ phối hoặc ghi chú..."
                    className="w-full text-xs px-3 py-1.5 bg-[#F7F4ED] border border-[#DED7CB] rounded text-[#302C27] placeholder-[#71685E]/70 focus:outline-none focus:border-[#302C27]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1.5 text-xs text-[#71685E] hover:text-[#302C27]"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Lọc theo nhãn văn hóa */}
                <select
                  value={selectedLabel}
                  onChange={(e) => setSelectedLabel(e.target.value as LabelFilter)}
                  className="text-xs px-2.5 py-1.5 bg-[#F7F4ED] border border-[#DED7CB] rounded text-[#302C27] focus:outline-none focus:border-[#302C27]"
                >
                  <option value="all">Tất cả định hướng văn hóa</option>
                  <option value="Tham khảo tư liệu">Tham khảo tư liệu</option>
                  <option value="Phối đương đại">Phối đương đại</option>
                  <option value="Phối sáng tạo">Phối sáng tạo</option>
                </select>
              </div>

              {/* Sắp xếp */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-[#71685E]">Xếp theo:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="text-xs px-2 py-1.5 bg-[#F7F4ED] border border-[#DED7CB] rounded text-[#302C27] focus:outline-none focus:border-[#302C27]"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="name_asc">Tên A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* DANH SÁCH THẺ BỘ PHỐI ĐÃ LỌC */}
          {filteredAndSortedLooks.length === 0 ? (
            <div className="p-10 text-center bg-[#FFFCF5] border border-[#DED7CB] rounded-lg">
              <h4 className="text-base font-serif-title font-medium text-[#302C27] mb-1">
                Không tìm thấy bộ phối nào phù hợp
              </h4>
              <p className="text-xs text-[#71685E] max-w-sm mx-auto mb-4">
                Không có bộ phối nào thuộc loại "
                {FAMILY_FILTER_TABS.find((t) => t.id === selectedFamily)?.label}" hoặc khớp với điều kiện lọc hiện tại.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#302C27] hover:bg-[#453F39] text-[#FFFCF5] text-xs font-medium rounded transition"
                >
                  Đặt lại toàn bộ bộ lọc
                </button>
                <button
                  onClick={onGoToStudio}
                  className="px-4 py-2 bg-[#A94D3C] hover:bg-[#8F3F30] text-[#FFFCF5] text-xs font-medium rounded transition"
                >
                  Vào xưởng phối thêm bộ mới
                </button>
              </div>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredAndSortedLooks.map((look) => {
                  const preset = BASE_OUTFIT_PRESETS[look.state.familyId];
                  const palette =
                    COLOR_PALETTES.find((p) => p.id === look.state.paletteId) ||
                    COLOR_PALETTES[0];
                  const analysis = analyzeOutfit(look.state);

                  return (
                    <motion.div
                      key={look.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-[#FFFCF5] border border-[#DED7CB] rounded-lg p-4 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Top card header */}
                        <div className="flex items-start justify-between border-b border-[#DED7CB] pb-2 mb-3">
                          <div className="flex-1 pr-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-sm font-serif-title text-[#302C27] truncate">
                                {look.name}
                              </h4>
                              <button
                                onClick={() => handleStartRename(look)}
                                className="text-[10px] text-[#71685E] hover:text-[#302C27] underline"
                              >
                                Đổi tên
                              </button>
                            </div>
                            <span className="text-[10px] text-[#71685E] block mt-0.5">
                              {look.createdAt} • {preset.name}
                            </span>
                          </div>

                          <span
                            className={`text-[9px] font-semibold px-2 py-0.5 rounded whitespace-nowrap ${
                              analysis.culturalLabel === 'Tham khảo tư liệu'
                                ? 'bg-[#71806A]/15 text-[#71806A]'
                                : analysis.culturalLabel === 'Phối đương đại'
                                ? 'bg-[#354E6B]/15 text-[#354E6B]'
                                : 'bg-[#A94D3C]/15 text-[#A94D3C]'
                            }`}
                          >
                            {analysis.culturalLabel}
                          </span>
                        </div>

                        {/* Character preview */}
                        <div
                          ref={(el) => {
                            svgRefs.current[look.id] = el;
                          }}
                          className="flex justify-center my-3 bg-[#F7F4ED] p-2 rounded border border-[#DED7CB]"
                        >
                          <CharacterCanvas state={look.state} className="w-[160px]" />
                        </div>

                        {/* Poetic story note */}
                        <div className="text-xs text-[#71685E] leading-relaxed italic bg-[#F7F4ED]/50 p-2.5 rounded border border-[#DED7CB]/60 mb-3">
                          "{look.storyNote}"
                        </div>

                        {/* Color swatches preview */}
                        <div className="flex items-center justify-between text-[11px] text-[#71685E] mb-3 pb-2 border-b border-[#DED7CB]/50">
                          <span>
                            Sắc: <strong className="text-[#302C27]">{palette.name}</strong>
                          </span>
                          <div className="flex items-center space-x-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: palette.primary }}
                            />
                            <span
                              className="w-3 h-3 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: palette.secondary }}
                            />
                            <span
                              className="w-3 h-3 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: palette.accent }}
                            />
                            <span
                              className="w-3 h-3 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: palette.bottom }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card actions */}
                      <div className="flex flex-col space-y-2 pt-1">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => onOpenLook(look.state)}
                            className="py-1.5 px-2 bg-[#302C27] hover:bg-[#453F39] text-[#FFFCF5] text-xs font-medium rounded text-center transition"
                          >
                            Mở trong xưởng
                          </button>
                          <button
                            onClick={() => handleExportPNG(look)}
                            disabled={isExportingId === look.id}
                            className="py-1.5 px-2 bg-[#A94D3C] hover:bg-[#8F3F30] text-[#FFFCF5] text-xs font-medium rounded text-center transition"
                          >
                            {isExportingId === look.id ? 'Đang xuất PNG...' : 'Xuất thẻ PNG'}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleCopyShareLink(look)}
                            className="py-1.5 px-2 border border-[#71806A] hover:bg-[#71806A]/10 text-[#71806A] text-xs font-medium rounded text-center transition"
                          >
                            Sao chép liên kết
                          </button>
                          <button
                            onClick={() => onDeleteLook(look.id)}
                            className="py-1.5 px-2 border border-[#DED7CB] hover:bg-[#F0EAE1] text-[#A94D3C] text-xs font-medium rounded text-center transition"
                          >
                            Xóa bộ phối
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}

      {/* Modal đổi tên bộ phối */}
      <AnimatePresence>
        {editingLook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302C27]/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#FFFCF5] border border-[#DED7CB] max-w-sm w-full rounded-lg shadow-2xl p-5 text-[#302C27]"
            >
              <h3 className="text-base font-serif-title font-semibold mb-2">
                Đổi tên bộ phối
              </h3>
              <p className="text-xs text-[#71685E] mb-3">
                Nhập tên mới cho bộ trang phục trong Lookbook:
              </p>

              <input
                type="text"
                value={newTitleInput}
                onChange={(e) => setNewTitleInput(e.target.value)}
                className="w-full p-2 border border-[#DED7CB] rounded text-xs bg-[#F7F4ED] text-[#302C27] mb-4 focus:outline-none focus:border-[#302C27]"
                placeholder="Nhập tên bộ phối..."
                autoFocus
              />

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingLook(null)}
                  className="px-3 py-1.5 border border-[#DED7CB] text-xs rounded hover:bg-[#F0EAE1]"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmRename}
                  className="px-3 py-1.5 bg-[#302C27] text-[#FFFCF5] text-xs rounded hover:bg-[#453F39] font-medium"
                >
                  Lưu tên mới
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
