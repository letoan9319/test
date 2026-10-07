/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BASE_OUTFIT_PRESETS,
  COLOR_PALETTES,
  COSTUME_ITEMS,
  CULTURAL_SOURCES,
  OCCASIONS,
  STYLES,
} from '../../data/catalog';
import {
  CostumeFamilyId,
  CulturalSource,
  OutfitState,
  SavedLook,
  SlotType,
} from '../../types';
import {
  fetchGeminiStory,
  fetchGeminiSuggestions,
  GeminiSuggestion,
} from '../../services/aiService';
import {
  analyzeOutfit,
  compareOutfits,
  validateAndAdaptOutfit,
} from '../../utils/compatibility';
import { CharacterCanvas } from '../character/CharacterCanvas';

interface StudioViewProps {
  initialFamilyId?: CostumeFamilyId;
  onNavigateToBook: () => void;
  onSaveLook: (look: SavedLook) => void;
}

export const StudioView: React.FC<StudioViewProps> = ({
  initialFamilyId = 'ao_ngu_than',
  onNavigateToBook,
  onSaveLook,
}) => {
  // Current outfit state
  const defaultPreset = BASE_OUTFIT_PRESETS[initialFamilyId];
  const [currentOutfit, setCurrentOutfit] = useState<OutfitState>({
    familyId: initialFamilyId,
    topId: defaultPreset.items.topId,
    bottomId: defaultPreset.items.bottomId,
    sashId: defaultPreset.items.sashId || null,
    headwearId: defaultPreset.items.headwearId || null,
    handheldId: defaultPreset.items.handheldId || null,
    paletteId: defaultPreset.defaultPaletteId,
    occasionId: 'ky_yeu',
    styleId: 'nhe_nhang',
  });

  // Undo / Redo history
  const [history, setHistory] = useState<OutfitState[]>([currentOutfit]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Active slot tab on left sidebar
  const [activeSlotTab, setActiveSlotTab] = useState<SlotType>('top');

  // Mobile active panel ('wardrobe' | 'canvas' | 'options')
  const [mobileTab, setMobileTab] = useState<'canvas' | 'wardrobe' | 'options'>('canvas');

  // Modal / drawer states
  const [activeSourceModal, setActiveSourceModal] = useState<CulturalSource | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [showRigAnchors, setShowRigAnchors] = useState<boolean>(false);
  const [showExplanationModal, setShowExplanationModal] = useState<boolean>(false);

  // Gemini AI state
  const [geminiSuggestions, setGeminiSuggestions] = useState<GeminiSuggestion[]>([]);
  const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);
  const [geminiNotice, setGeminiNotice] = useState<string | null>(null);
  const [isGeminiFallback, setIsGeminiFallback] = useState<boolean>(false);
  const [customStory, setCustomStory] = useState<string | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);

  // Snapshot comparison slot A / B
  const [snapshotA, setSnapshotA] = useState<OutfitState | null>(null);
  const [snapshotB, setSnapshotB] = useState<OutfitState | null>(null);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  // Sync initialFamilyId when user transitions from book preset button
  useEffect(() => {
    if (initialFamilyId && initialFamilyId !== currentOutfit.familyId) {
      const adapted = validateAndAdaptOutfit(initialFamilyId, currentOutfit);
      setCurrentOutfit(adapted);
      setHistory([adapted]);
      setHistoryIndex(0);
    }
  }, [initialFamilyId]);

  // Đóng toàn bộ modals khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showExplanationModal) setShowExplanationModal(false);
        if (showComparisonModal) setShowComparisonModal(false);
        if (activeSourceModal) setActiveSourceModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showExplanationModal, showComparisonModal, activeSourceModal]);

  // Update outfit with history tracking
  const updateOutfit = (newOutfit: OutfitState) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newOutfit);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setCurrentOutfit(newOutfit);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentOutfit(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentOutfit(history[historyIndex + 1]);
    }
  };

  const handleResetToBase = () => {
    const preset = BASE_OUTFIT_PRESETS[currentOutfit.familyId];
    updateOutfit({
      familyId: currentOutfit.familyId,
      topId: preset.items.topId,
      bottomId: preset.items.bottomId,
      sashId: preset.items.sashId || null,
      headwearId: preset.items.headwearId || null,
      handheldId: preset.items.handheldId || null,
      paletteId: preset.defaultPaletteId,
      occasionId: currentOutfit.occasionId,
      styleId: currentOutfit.styleId,
    });
    showToast('Đã khôi phục về bộ nền nguyên bản của dòng áo.');
  };

  // Chọn dòng áo với cơ chế kiểm tra tương thích tự động
  const handleSelectFamily = (familyId: CostumeFamilyId) => {
    const adapted = validateAndAdaptOutfit(familyId, currentOutfit);
    updateOutfit(adapted);
    showToast(`Đã chuyển sang ${BASE_OUTFIT_PRESETS[familyId].name}. Các thành phần đã tự động tương thích.`);
  };

  const showToast = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  // Phân tích văn hóa và thẩm mỹ của bộ phối hiện tại qua Compatibility Engine
  const analysis = analyzeOutfit(currentOutfit);

  const activePalette = COLOR_PALETTES.find((p) => p.id === currentOutfit.paletteId) || COLOR_PALETTES[0];
  const activeOccasion = OCCASIONS.find((o) => o.id === currentOutfit.occasionId) || OCCASIONS[0];
  const activeStyle = STYLES.find((s) => s.id === currentOutfit.styleId) || STYLES[0];

  // Xử lý gọi gợi ý phối đồ từ Gemini
  const handleGetGeminiSuggestions = async () => {
    setIsLoadingGemini(true);
    setGeminiNotice(null);
    try {
      const res = await fetchGeminiSuggestions(currentOutfit);
      setGeminiSuggestions(res.suggestions);
      setIsGeminiFallback(res.isFallback);
      if (res.isFallback) {
        setGeminiNotice(res.fallbackNotice || 'Đang sử dụng gợi ý có sẵn.');
      } else {
        setGeminiNotice('Đề xuất thông minh từ mô hình Gemini');
      }
    } catch {
      setGeminiNotice('Đã chuyển sang gợi ý dự phòng.');
    } finally {
      setIsLoadingGemini(false);
    }
  };

  // Áp dụng phương án gợi ý
  const handleApplySuggestion = (sug: GeminiSuggestion) => {
    const updated: OutfitState = {
      ...currentOutfit,
      topId: sug.topId,
      bottomId: sug.bottomId,
      headwearId: sug.headwearId,
      handheldId: sug.handheldId,
      sashId: sug.sashId,
      paletteId: sug.paletteId,
    };
    updateOutfit(updated);
    showToast(`Đã áp dụng phương án "${sug.title}".`);
  };

  // Tạo câu chuyện Lookbook với Gemini
  const handleGenerateStory = async () => {
    setIsGeneratingStory(true);
    try {
      const res = await fetchGeminiStory(currentOutfit, BASE_OUTFIT_PRESETS[currentOutfit.familyId].name);
      setCustomStory(res.story);
      showToast('Gemini đã soạn xong câu chuyện Lookbook.');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // Filter items for current slot tab
  const slotItems = COSTUME_ITEMS.filter((item) => item.slot === activeSlotTab);

  // Lưu bộ phối vào Lookbook
  const handleSaveCurrentLook = () => {
    const defaultStory = `Bộ phối ${BASE_OUTFIT_PRESETS[currentOutfit.familyId].name} kết hợp sắc ${activePalette.name}, phù hợp cho dịp ${activeOccasion.name} với phong cách ${activeStyle.name}. Nhãn văn hóa: ${analysis.culturalLabel}.`;
    const newLook: SavedLook = {
      id: `look_${Date.now()}`,
      name: `${BASE_OUTFIT_PRESETS[currentOutfit.familyId].name} - ${activePalette.name}`,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      state: { ...currentOutfit },
      storyNote: customStory || defaultStory,
    };
    onSaveLook(newLook);
    showToast('Đã lưu thành công vào Lookbook cá nhân.');
  };

  // Tính toán bảng đối chiếu nếu có cả bộ A và B
  const comparisonDiff = snapshotA && snapshotB ? compareOutfits(snapshotA, snapshotB) : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 flex flex-col min-h-[calc(100vh-80px)]">
      {/* Toast Notification */}
      {notificationMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#302C27] text-[#FFFCF5] px-4 py-2.5 rounded shadow-lg text-xs tracking-wide">
          {notificationMessage}
        </div>
      )}

      {/* Top Studio Controls */}
      <div className="w-full flex flex-wrap items-center justify-between border-b border-[#DED7CB] pb-3 mb-4 gap-2">
        {/* Family Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-[#71685E] uppercase tracking-wider hidden sm:inline">
            Dòng áo:
          </span>
          <div className="flex bg-[#FFFCF5] border border-[#DED7CB] rounded p-0.5">
            {(['ao_ngu_than', 'ao_dai', 'ao_tu_than'] as CostumeFamilyId[]).map((fId) => (
              <button
                key={fId}
                onClick={() => handleSelectFamily(fId)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition ${
                  currentOutfit.familyId === fId
                    ? 'bg-[#302C27] text-[#FFFCF5]'
                    : 'text-[#302C27] hover:bg-[#F0EAE1]'
                }`}
              >
                {fId === 'ao_ngu_than' ? 'Áo ngũ thân' : fId === 'ao_dai' ? 'Áo dài' : 'Áo tứ thân'}
              </button>
            ))}
          </div>
        </div>

        {/* Undo / Redo / Reset / Guide */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[#71685E] hidden md:inline mr-1 font-mono">
            Bước {historyIndex + 1}/{history.length}
          </span>
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className={`px-3 py-1.5 border border-[#DED7CB] font-medium rounded transition ${
              historyIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-[#F7F4ED]'
                : 'bg-[#FFFCF5] hover:bg-[#F0EAE1] text-[#302C27]'
            }`}
          >
            Hoàn tác
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className={`px-3 py-1.5 border border-[#DED7CB] font-medium rounded transition ${
              historyIndex >= history.length - 1
                ? 'opacity-40 cursor-not-allowed bg-[#F7F4ED]'
                : 'bg-[#FFFCF5] hover:bg-[#F0EAE1] text-[#302C27]'
            }`}
          >
            Làm lại
          </button>
          <button
            onClick={handleResetToBase}
            className="px-3 py-1.5 border border-[#DED7CB] bg-[#FFFCF5] hover:bg-[#F0EAE1] text-[#302C27] font-medium rounded transition"
          >
            Về bộ nền
          </button>
          <button
            onClick={onNavigateToBook}
            className="px-3 py-1.5 border border-[#71806A] text-[#71806A] hover:bg-[#71806A]/10 font-medium rounded transition"
          >
            Tìm hiểu trong Sách
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden w-full bg-[#FFFCF5] border border-[#DED7CB] rounded p-1 mb-3 text-xs">
        <button
          onClick={() => setMobileTab('wardrobe')}
          className={`flex-1 py-2 font-medium rounded transition text-center ${
            mobileTab === 'wardrobe' ? 'bg-[#302C27] text-[#FFFCF5]' : 'text-[#302C27]'
          }`}
        >
          Chọn món đồ
        </button>
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-2 font-medium rounded transition text-center ${
            mobileTab === 'canvas' ? 'bg-[#302C27] text-[#FFFCF5]' : 'text-[#302C27]'
          }`}
        >
          Nhân vật mẫu
        </button>
        <button
          onClick={() => setMobileTab('options')}
          className={`flex-1 py-2 font-medium rounded transition text-center ${
            mobileTab === 'options' ? 'bg-[#302C27] text-[#FFFCF5]' : 'text-[#302C27]'
          }`}
        >
          Màu & Bối cảnh
        </button>
      </div>

      {/* 3-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* ================= CỘT TRÁI: TỦ ĐỒ & PHỤ KIỆN (Col 1-4) ================= */}
        <div
          className={`lg:col-span-4 bg-[#FFFCF5] border border-[#DED7CB] rounded-lg p-4 shadow-sm flex flex-col space-y-4 ${
            mobileTab !== 'wardrobe' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div>
            <h3 className="text-sm font-semibold text-[#302C27] uppercase tracking-wider mb-2 font-serif-title">
              Thành phần trang phục
            </h3>
            {/* Slot Tabs */}
            <div className="grid grid-cols-5 gap-1 bg-[#F7F4ED] p-1 rounded border border-[#DED7CB] text-xs">
              <button
                onClick={() => setActiveSlotTab('top')}
                className={`py-1.5 rounded font-medium transition text-center ${
                  activeSlotTab === 'top' ? 'bg-[#302C27] text-[#FFFCF5]' : 'text-[#71685E] hover:text-[#302C27]'
                }`}
              >
                Áo
              </button>
              <button
                onClick={() => setActiveSlotTab('bottom')}
                className={`py-1.5 rounded font-medium transition text-center ${
                  activeSlotTab === 'bottom' ? 'bg-[#302C27] text-[#FFFCF5]' : 'text-[#71685E] hover:text-[#302C27]'
                }`}
              >
                Quần/Váy
              </button>
              <button
                onClick={() => setActiveSlotTab('sash')}
                className={`py-1.5 rounded font-medium transition text-center ${
                  activeSlotTab === 'sash' ? 'bg-[#302C27] text-[#FFFCF5]' : 'text-[#71685E] hover:text-[#302C27]'
                }`}
              >
                Dải bao
              </button>
              <button
                onClick={() => setActiveSlotTab('headwear')}
                className={`py-1.5 rounded font-medium transition text-center ${
                  activeSlotTab === 'headwear' ? 'bg-[#302C27] text-[#FFFCF5]' : 'text-[#71685E] hover:text-[#302C27]'
                }`}
              >
                Đầu
              </button>
              <button
                onClick={() => setActiveSlotTab('handheld')}
                className={`py-1.5 rounded font-medium transition text-center ${
                  activeSlotTab === 'handheld' ? 'bg-[#302C27] text-[#FFFCF5]' : 'text-[#71685E] hover:text-[#302C27]'
                }`}
              >
                Cầm tay
              </button>
            </div>
          </div>

          {/* Item List for active slot with gentle Framer Motion transition */}
          <div className="flex flex-col space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {/* "Không dùng" option for optional accessories */}
            {(activeSlotTab === 'sash' || activeSlotTab === 'headwear' || activeSlotTab === 'handheld') && (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  if (activeSlotTab === 'sash') updateOutfit({ ...currentOutfit, sashId: null });
                  if (activeSlotTab === 'headwear') updateOutfit({ ...currentOutfit, headwearId: null });
                  if (activeSlotTab === 'handheld') updateOutfit({ ...currentOutfit, handheldId: null });
                }}
                className={`p-3 rounded border cursor-pointer transition text-xs flex items-center justify-between ${
                  (activeSlotTab === 'sash' && currentOutfit.sashId === null) ||
                  (activeSlotTab === 'headwear' && currentOutfit.headwearId === null) ||
                  (activeSlotTab === 'handheld' && currentOutfit.handheldId === null)
                    ? 'border-[#302C27] bg-[#F7F4ED] font-semibold text-[#302C27]'
                    : 'border-[#DED7CB] hover:bg-[#F7F4ED]/60 text-[#71685E]'
                }`}
              >
                <span>Không dùng phụ kiện này</span>
                {(activeSlotTab === 'sash' && currentOutfit.sashId === null) ||
                (activeSlotTab === 'headwear' && currentOutfit.headwearId === null) ||
                (activeSlotTab === 'handheld' && currentOutfit.handheldId === null) ? (
                  <span className="text-[11px] font-semibold text-[#302C27] bg-[#DED7CB] px-2 py-0.5 rounded">
                    Đang chọn
                  </span>
                ) : null}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlotTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col space-y-2.5"
              >
                {slotItems.map((item) => {
                  const isSelected =
                    (item.slot === 'top' && currentOutfit.topId === item.id) ||
                    (item.slot === 'bottom' && currentOutfit.bottomId === item.id) ||
                    (item.slot === 'sash' && currentOutfit.sashId === item.id) ||
                    (item.slot === 'headwear' && currentOutfit.headwearId === item.id) ||
                    (item.slot === 'handheld' && currentOutfit.handheldId === item.id);

                  const isNativeToFamily = item.compatibleWith.includes(currentOutfit.familyId);

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        if (item.slot === 'top') {
                          // Đổi áo sẽ đồng bộ dòng áo tương thích
                          const adapted = validateAndAdaptOutfit(item.familyId, {
                            ...currentOutfit,
                            topId: item.id,
                          });
                          updateOutfit(adapted);
                        } else if (item.slot === 'bottom') {
                          updateOutfit({ ...currentOutfit, bottomId: item.id });
                        } else if (item.slot === 'sash') {
                          updateOutfit({ ...currentOutfit, sashId: item.id });
                        } else if (item.slot === 'headwear') {
                          updateOutfit({ ...currentOutfit, headwearId: item.id });
                        } else if (item.slot === 'handheld') {
                          updateOutfit({ ...currentOutfit, handheldId: item.id });
                        }
                      }}
                      className={`p-3 rounded border cursor-pointer transition text-xs flex flex-col space-y-1.5 ${
                        isSelected
                          ? 'border-[#A94D3C] bg-[#A94D3C]/5 shadow-xs'
                          : 'border-[#DED7CB] hover:bg-[#F7F4ED] text-[#302C27]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#302C27]">{item.name}</span>
                        <div className="flex items-center space-x-1">
                          {!isNativeToFamily && (
                            <span className="text-[9px] font-medium bg-[#A94D3C]/10 text-[#A94D3C] px-1.5 py-0.5 rounded">
                              Khác dòng
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-[10px] font-semibold bg-[#A94D3C] text-[#FFFCF5] px-2 py-0.5 rounded">
                              Đang dùng
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-[#71685E] leading-normal">{item.description}</p>

                      <div className="flex items-center justify-between pt-1 border-t border-[#DED7CB]/50 text-[10px]">
                        <span
                          className={`font-medium ${
                            item.culturalLabel === 'Tham khảo tư liệu'
                              ? 'text-[#71806A]'
                              : item.culturalLabel === 'Phối đương đại'
                              ? 'text-[#354E6B]'
                              : 'text-[#A94D3C]'
                          }`}
                        >
                          {item.culturalLabel}
                        </span>
                        {item.sourceIds.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSourceModal(CULTURAL_SOURCES[item.sourceIds[0]]);
                            }}
                            className="text-[#71685E] underline hover:text-[#302C27]"
                          >
                            Nguồn tư liệu
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ================= CỘT GIỮA: NHÂN VẬT & TRÌNH BÀY (Col 5-8) ================= */}
        <div
          className={`lg:col-span-4 flex flex-col items-center ${
            mobileTab !== 'canvas' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Mannequin Canvas Container */}
          <div className="w-full max-w-[340px] bg-[#FFFCF5] border border-[#DED7CB] rounded-lg p-3 shadow-md flex flex-col items-center relative">
            {/* Quick status badge on top */}
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#DED7CB] text-xs">
              <span className="font-semibold text-[#302C27] font-serif-title">
                {BASE_OUTFIT_PRESETS[currentOutfit.familyId].name}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
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

            {/* Live Character Render with gentle Framer Motion presence */}
            <motion.div
              key={`${currentOutfit.familyId}_${currentOutfit.topId}_${currentOutfit.paletteId}_${currentOutfit.bottomId}_${currentOutfit.sashId}_${currentOutfit.headwearId}_${currentOutfit.handheldId}`}
              initial={{ opacity: 0.88, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full max-w-[280px]"
            >
              <CharacterCanvas
                state={currentOutfit}
                showAnchors={showRigAnchors}
                className="w-full"
              />
            </motion.div>

            {/* Nút bật/tắt hiển thị điểm neo chuẩn hóa 2D */}
            <div className="w-full flex justify-between items-center mt-1 px-1 text-[10px]">
              <button
                onClick={() => setShowExplanationModal(true)}
                className="text-[#A94D3C] hover:underline font-medium"
              >
                Vì sao bộ phối này phù hợp?
              </button>
              <button
                onClick={() => setShowRigAnchors(!showRigAnchors)}
                className="text-[#71685E] hover:text-[#302C27] underline"
              >
                {showRigAnchors ? 'Ẩn điểm neo rig' : 'Hiện điểm neo rig'}
              </button>
            </div>

            {/* Cảnh báo văn hóa nhẹ nhàng nếu phối sáng tạo */}
            {analysis.isCrossFamily && (
              <div className="w-full mt-2 p-2 bg-[#F7F4ED] border border-[#DED7CB] rounded text-[11px] text-[#71685E] leading-normal italic">
                {analysis.compatibilityAdvice}
              </div>
            )}

            {/* Quick action bar beneath character */}
            <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#DED7CB]">
              <button
                onClick={() => {
                  setSnapshotA({ ...currentOutfit });
                  showToast('Đã chụp lưu làm Phương án A.');
                }}
                className="py-1.5 px-2 bg-[#F7F4ED] hover:bg-[#F0EAE1] text-[#302C27] border border-[#DED7CB] rounded text-[11px] font-medium text-center"
              >
                {snapshotA ? 'Cập nhật Bộ A' : 'Lưu làm Bộ A'}
              </button>
              <button
                onClick={() => {
                  setSnapshotB({ ...currentOutfit });
                  showToast('Đã chụp lưu làm Phương án B.');
                }}
                className="py-1.5 px-2 bg-[#F7F4ED] hover:bg-[#F0EAE1] text-[#302C27] border border-[#DED7CB] rounded text-[11px] font-medium text-center"
              >
                {snapshotB ? 'Cập nhật Bộ B' : 'Lưu làm Bộ B'}
              </button>
            </div>

            {(snapshotA || snapshotB) && (
              <button
                onClick={() => setShowComparisonModal(true)}
                className="w-full mt-2 py-1.5 bg-[#71806A] hover:bg-[#5C6B56] text-[#FFFCF5] rounded text-xs font-medium text-center transition"
              >
                So sánh phương án A và B
              </button>
            )}
          </div>
        </div>

        {/* ================= CỘT PHẢI: MÀU, BỐI CẢNH & LOOKBOOK (Col 9-12) ================= */}
        <div
          className={`lg:col-span-4 bg-[#FFFCF5] border border-[#DED7CB] rounded-lg p-4 shadow-sm flex flex-col space-y-4 ${
            mobileTab !== 'options' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* 1. Tuyển chọn bảng màu */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-[#302C27] uppercase tracking-wider font-serif-title">
                Bảng màu tuyển chọn
              </h3>
              <span className="text-xs text-[#A94D3C] font-medium">{activePalette.name}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => updateOutfit({ ...currentOutfit, paletteId: palette.id })}
                  className={`p-2 rounded border text-left flex flex-col space-y-1.5 transition ${
                    currentOutfit.paletteId === palette.id
                      ? 'border-[#302C27] bg-[#F7F4ED] shadow-xs'
                      : 'border-[#DED7CB] hover:bg-[#F7F4ED]/50'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: palette.secondary }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: palette.bottom }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#302C27] truncate">
                    {palette.name}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#71685E] mt-2 italic">{activePalette.harmonyNote}</p>
          </div>

          {/* 2. Dịp / Tình huống sử dụng */}
          <div>
            <h3 className="text-sm font-semibold text-[#302C27] uppercase tracking-wider mb-2 font-serif-title">
              Tình huống phối đồ
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => updateOutfit({ ...currentOutfit, occasionId: occ.id })}
                  className={`p-2.5 rounded border text-left transition ${
                    currentOutfit.occasionId === occ.id
                      ? 'border-[#A94D3C] bg-[#A94D3C]/5 font-semibold text-[#A94D3C]'
                      : 'border-[#DED7CB] hover:bg-[#F7F4ED] text-[#302C27]'
                  }`}
                >
                  <div className="font-medium">{occ.name}</div>
                  <div className="text-[10px] text-[#71685E] mt-0.5 line-clamp-1">{occ.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Định hướng thẩm mỹ */}
          <div>
            <h3 className="text-sm font-semibold text-[#302C27] uppercase tracking-wider mb-2 font-serif-title">
              Định hướng thẩm mỹ
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {STYLES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => updateOutfit({ ...currentOutfit, styleId: st.id })}
                  className={`py-2 px-1 text-center rounded border transition font-medium ${
                    currentOutfit.styleId === st.id
                      ? 'border-[#302C27] bg-[#302C27] text-[#FFFCF5]'
                      : 'border-[#DED7CB] hover:bg-[#F7F4ED] text-[#302C27]'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Trợ lý gợi ý phối đồ Gemini AI */}
          <div className="p-3.5 bg-[#F7F4ED] border border-[#DED7CB] rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#302C27] font-serif-title uppercase tracking-wider">
                Gợi ý phối đồ với Gemini
              </span>
              {geminiNotice && (
                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded ${
                    isGeminiFallback
                      ? 'bg-[#71685E]/15 text-[#71685E]'
                      : 'bg-[#71806A]/20 text-[#71806A]'
                  }`}
                >
                  {isGeminiFallback ? 'Gợi ý có sẵn' : 'Trí tuệ nhân tạo'}
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#71685E] leading-normal">
              Đề xuất phương án phối đồ thông minh dựa trên bối cảnh {activeOccasion.name}, phong cách {activeStyle.name} và tư liệu bảo tàng đối chiếu.
            </p>

            <button
              onClick={handleGetGeminiSuggestions}
              disabled={isLoadingGemini}
              className={`w-full py-2 px-3 border border-[#71806A] text-xs font-semibold rounded transition text-center shadow-xs ${
                isLoadingGemini
                  ? 'bg-[#71806A]/20 text-[#71806A] cursor-wait'
                  : 'bg-[#71806A] hover:bg-[#5C6B56] text-[#FFFCF5]'
              }`}
            >
              {isLoadingGemini ? 'Đang phân tích tư liệu và gợi ý...' : 'Nhận gợi ý từ Gemini'}
            </button>

            {/* Danh sách thẻ phương án đề xuất từ Gemini */}
            {geminiSuggestions.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-[#DED7CB]/70 max-h-[320px] overflow-y-auto pr-1">
                {geminiSuggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FFFCF5] border border-[#DED7CB] rounded text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-semibold text-[#302C27]">
                      <span>{sug.title}</span>
                      <span className="text-[10px] text-[#A94D3C] font-medium">
                        {COLOR_PALETTES.find((p) => p.id === sug.paletteId)?.name}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#71685E] leading-normal">
                      {sug.stylingReason}
                    </p>

                    <div className="text-[10px] text-[#71806A] italic bg-[#F7F4ED] p-2 rounded border border-[#DED7CB]/60">
                      Ghi chú: {sug.culturalNotes}
                      {sug.uncertainty && (
                        <div className="text-[#A94D3C] mt-1 font-normal">
                          {sug.uncertainty}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleApplySuggestion(sug)}
                      className="w-full mt-1 py-1.5 bg-[#302C27] hover:bg-[#453F39] text-[#FFFCF5] rounded text-[11px] font-medium transition text-center"
                    >
                      Áp dụng phương án này
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Soạn câu chuyện Lookbook với Gemini */}
          <div className="p-3 bg-[#F7F4ED] border border-[#DED7CB] rounded-lg space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#302C27] font-serif-title uppercase tracking-wider text-[11px]">
                Câu chuyện Lookbook
              </span>
              <button
                onClick={handleGenerateStory}
                disabled={isGeneratingStory}
                className="text-[10px] text-[#A94D3C] underline hover:text-[#8F3F30] font-medium"
              >
                {isGeneratingStory ? 'Đang soạn...' : 'Nhờ Gemini viết chuyện'}
              </button>
            </div>

            <div className="p-2.5 bg-[#FFFCF5] border border-[#DED7CB] rounded text-[11px] text-[#71685E] leading-relaxed italic min-h-[50px]">
              "{customStory || `Bộ phối ${BASE_OUTFIT_PRESETS[currentOutfit.familyId].name} mang sắc ${activePalette.name}, phù hợp cho dịp ${activeOccasion.name}.`}"
            </div>
          </div>

          {/* 6. Thẻ lưu Lookbook */}
          <div className="pt-2 border-t border-[#DED7CB] flex flex-col space-y-2">
            <button
              onClick={handleSaveCurrentLook}
              className="w-full py-2.5 bg-[#A94D3C] hover:bg-[#8F3F30] text-[#FFFCF5] rounded text-xs font-semibold uppercase tracking-wider transition shadow-sm"
            >
              Lưu vào Lookbook cá nhân
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL: GIẢI THÍCH "VÌ SAO BỘ PHỐI NÀY PHÙ HỢP?" ================= */}
      <AnimatePresence>
        {showExplanationModal && (
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
              transition={{ duration: 0.2 }}
              className="bg-[#FFFCF5] border border-[#DED7CB] max-w-xl w-full rounded-lg shadow-2xl p-6 text-[#302C27]"
            >
              <div className="flex items-start justify-between border-b border-[#DED7CB] pb-3 mb-4">
                <div>
                  <span className="text-[11px] font-semibold text-[#A94D3C] uppercase tracking-wider block">
                    Phân tích thẩm mỹ & Văn hóa
                  </span>
                  <h3 className="text-lg font-serif-title font-semibold text-[#302C27] mt-0.5">
                    {analysis.suitabilityTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setShowExplanationModal(false)}
                  className="text-xs px-2.5 py-1 border border-[#DED7CB] rounded hover:bg-[#F0EAE1] text-[#71685E]"
                >
                  Đóng
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="bg-[#F7F4ED] p-3 rounded border border-[#DED7CB]">
                  <span className="font-semibold text-[#302C27] block mb-1">Đánh giá sự phù hợp với bối cảnh:</span>
                  <p className="text-[#71685E] leading-relaxed">{analysis.suitabilityExplanation}</p>
                </div>

                <div className="bg-[#F7F4ED] p-3 rounded border border-[#DED7CB]">
                  <span className="font-semibold text-[#302C27] block mb-1">
                    Hài hòa màu sắc ({activePalette.name}):
                  </span>
                  <p className="text-[#71685E] leading-relaxed">{analysis.colorHarmonyNote}</p>
                </div>

                <div className="p-3 rounded border border-[#71806A]/30 bg-[#71806A]/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#302C27]">Ghi chú văn hóa:</span>
                    <span className="font-semibold text-[10px] bg-[#71806A]/15 text-[#71806A] px-2 py-0.5 rounded">
                      {analysis.culturalLabel}
                    </span>
                  </div>
                  <p className="text-[#71685E] leading-relaxed mb-2">{analysis.culturalNote}</p>
                  <p className="text-[11px] text-[#71685E] italic border-t border-[#DED7CB]/50 pt-2">
                    {analysis.compatibilityAdvice}
                  </p>
                </div>

                {analysis.primarySource && (
                  <div className="text-[11px] flex items-center justify-between pt-1">
                    <span className="text-[#71685E]">
                      Tư liệu đối chiếu: <strong className="text-[#302C27]">{analysis.primarySource.title}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setShowExplanationModal(false);
                        setActiveSourceModal(analysis.primarySource!);
                      }}
                      className="text-[#A94D3C] underline hover:text-[#8F3F30] font-medium"
                    >
                      Xem toàn văn nguồn
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-[#DED7CB] flex justify-end">
                <button
                  onClick={() => setShowExplanationModal(false)}
                  className="px-4 py-1.5 bg-[#302C27] text-[#FFFCF5] rounded text-xs hover:bg-[#453F39] font-medium"
                >
                  Đã hiểu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: SO SÁNH PHƯƠNG ÁN A VÀ B ================= */}
      <AnimatePresence>
        {showComparisonModal && (
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
              transition={{ duration: 0.2 }}
              className="bg-[#FFFCF5] border border-[#DED7CB] max-w-4xl w-full rounded-lg shadow-2xl p-6 text-[#302C27] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#DED7CB] pb-3 mb-4">
                <h3 className="text-lg font-serif-title font-semibold text-[#302C27]">
                  So sánh đối chiếu hai phương án phối đồ
                </h3>
                <button
                  onClick={() => setShowComparisonModal(false)}
                  className="text-xs px-3 py-1 border border-[#DED7CB] rounded hover:bg-[#F0EAE1]"
                >
                  Đóng so sánh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* PHƯƠNG ÁN A */}
                <div className="border border-[#DED7CB] rounded p-4 flex flex-col items-center bg-[#F7F4ED]">
                  <span className="text-xs font-semibold uppercase tracking-wider mb-2 text-[#71806A]">
                    Phương án A
                  </span>
                  {snapshotA ? (
                    <>
                      <CharacterCanvas state={snapshotA} className="w-[180px] mb-3" />
                      <div className="text-xs text-center space-y-1">
                        <div className="font-semibold">{BASE_OUTFIT_PRESETS[snapshotA.familyId].name}</div>
                        <div className="text-[#71685E]">
                          Màu: {COLOR_PALETTES.find((p) => p.id === snapshotA.paletteId)?.name}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-20 text-xs text-[#71685E]">Chưa lưu phương án A</div>
                  )}
                </div>

                {/* PHƯƠNG ÁN B */}
                <div className="border border-[#DED7CB] rounded p-4 flex flex-col items-center bg-[#F7F4ED]">
                  <span className="text-xs font-semibold uppercase tracking-wider mb-2 text-[#A94D3C]">
                    Phương án B
                  </span>
                  {snapshotB ? (
                    <>
                      <CharacterCanvas state={snapshotB} className="w-[180px] mb-3" />
                      <div className="text-xs text-center space-y-1">
                        <div className="font-semibold">{BASE_OUTFIT_PRESETS[snapshotB.familyId].name}</div>
                        <div className="text-[#71685E]">
                          Màu: {COLOR_PALETTES.find((p) => p.id === snapshotB.paletteId)?.name}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-20 text-xs text-[#71685E]">Chưa lưu phương án B</div>
                  )}
                </div>
              </div>

              {/* BẢNG ĐỐI CHIẾU KHÁC BIỆT CHI TIẾT */}
              {snapshotA && snapshotB && (
                <div className="border border-[#DED7CB] rounded overflow-hidden text-xs">
                  <div className="bg-[#F7F4ED] p-2.5 font-semibold text-[#302C27] border-b border-[#DED7CB]">
                    Bảng đối chiếu điểm khác biệt
                  </div>
                  <div className="divide-y divide-[#DED7CB]">
                    {comparisonDiff.map((row) => (
                      <div
                        key={row.attribute}
                        className={`grid grid-cols-3 p-2.5 ${
                          row.isDifferent ? 'bg-[#A94D3C]/5 font-medium' : 'bg-[#FFFCF5]'
                        }`}
                      >
                        <span className="text-[#71685E]">{row.attribute}</span>
                        <span className="text-[#302C27]">{row.valueA}</span>
                        <span className="text-[#302C27]">{row.valueB}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-[#DED7CB] text-xs text-[#71685E] text-center">
                Mỗi phương án đều giữ nguyên tỷ lệ dáng người và góc nhìn để bạn đối chiếu màu sắc và phụ kiện chuẩn xác nhất.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: BẢNG ĐỌC NGUỒN TƯ LIỆU ================= */}
      <AnimatePresence>
        {activeSourceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302C27]/50 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#FFFCF5] border border-[#DED7CB] max-w-lg w-full rounded-lg shadow-2xl p-6 text-[#302C27]"
            >
              <div className="flex items-start justify-between border-b border-[#DED7CB] pb-3 mb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#71806A] block">
                    {activeSourceModal.sourceType} • {activeSourceModal.verificationStatus}
                  </span>
                  <h3 className="text-lg font-serif-title font-semibold text-[#302C27] mt-1">
                    {activeSourceModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSourceModal(null)}
                  className="text-xs px-2.5 py-1 border border-[#DED7CB] rounded hover:bg-[#F0EAE1] text-[#71685E]"
                >
                  Đóng
                </button>
              </div>

              <div className="text-xs text-[#71685E] mb-3">
                Tổ chức: <span className="font-medium text-[#302C27]">{activeSourceModal.authorOrOrg}</span>
                <br />
                Niên đại: <span className="font-medium text-[#302C27]">{activeSourceModal.yearOrPeriod}</span>
              </div>

              <div className="bg-[#F7F4ED] p-3.5 rounded border border-[#DED7CB] text-xs leading-relaxed italic text-[#302C27] mb-4">
                "{activeSourceModal.excerpt}"
              </div>

              <div className="pt-3 border-t border-[#DED7CB] flex justify-end">
                <button
                  onClick={() => setActiveSourceModal(null)}
                  className="px-4 py-1.5 bg-[#302C27] text-[#FFFCF5] text-xs rounded hover:bg-[#453F39]"
                >
                  Đã hiểu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
