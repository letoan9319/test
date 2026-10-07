/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookPreview } from './components/book/BookPreview';
import { LookbookView } from './components/lookbook/LookbookView';
import { Navbar, NavTab } from './components/shared/Navbar';
import { StudioView } from './components/studio/StudioView';
import { BASE_OUTFIT_PRESETS } from './data/catalog';
import { CostumeFamilyId, OutfitState, SavedLook } from './types';
import { decodeOutfitFromShareUrl } from './utils/shareAndExport';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('book');
  const [studioFamilyId, setStudioFamilyId] = useState<CostumeFamilyId>('ao_ngu_than');
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Initial demo saved looks representing the 3 costume families
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(() => {
    try {
      const stored = localStorage.getItem('nep_viet_saved_looks');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    const nguThanPreset = BASE_OUTFIT_PRESETS['ao_ngu_than'];
    const aoDaiPreset = BASE_OUTFIT_PRESETS['ao_dai'];
    const tuThanPreset = BASE_OUTFIT_PRESETS['ao_tu_than'];
    return [
      {
        id: 'look_init_01',
        name: 'Ngũ Thân Lập Lĩnh - Chàm sương',
        createdAt: 'Hôm nay',
        state: {
          familyId: 'ao_ngu_than',
          topId: nguThanPreset.items.topId,
          bottomId: nguThanPreset.items.bottomId,
          sashId: null,
          headwearId: nguThanPreset.items.headwearId || null,
          handheldId: nguThanPreset.items.handheldId || null,
          paletteId: 'pal_cham_suong',
          occasionId: 'tham_quan',
          styleId: 'nhe_nhang',
        },
        storyNote: 'Phom dáng ngũ thân lập lĩnh thanh lịch, sắc chàm sương hoài cổ kết hợp cùng quạt nan tre và khăn đóng nghiêm cẩn.',
      },
      {
        id: 'look_init_02',
        name: 'Áo Dài Thanh Tao - Mây lam',
        createdAt: 'Hôm nay',
        state: {
          familyId: 'ao_dai',
          topId: aoDaiPreset.items.topId,
          bottomId: aoDaiPreset.items.bottomId,
          sashId: null,
          headwearId: aoDaiPreset.items.headwearId || null,
          handheldId: aoDaiPreset.items.handheldId || null,
          paletteId: 'pal_may_lam',
          occasionId: 'hoc_duong',
          styleId: 'nhe_nhang',
        },
        storyNote: 'Tà áo dài thướt tha hòa cùng sắc mây lam dịu mát, điểm xuyết nón lá truyền thống và chuỗi ngọc thanh nhã.',
      },
      {
        id: 'look_init_03',
        name: 'Tứ Thân Trẩy Hội - Chu sa',
        createdAt: 'Hôm nay',
        state: {
          familyId: 'ao_tu_than',
          topId: tuThanPreset.items.topId,
          bottomId: tuThanPreset.items.bottomId,
          sashId: tuThanPreset.items.sashId || null,
          headwearId: tuThanPreset.items.headwearId || null,
          handheldId: tuThanPreset.items.handheldId || null,
          paletteId: 'pal_chu_sa',
          occasionId: 'le_tet',
          styleId: 'ruc_ro',
        },
        storyNote: 'Trang phục trẩy hội Kinh Bắc với dải thắt lưng bao hồng, áo tứ thân lụa mềm và nón quai thao đậm đà sắc xuân.',
      },
    ];
  });

  // Check share URL query parameters on initial load
  useEffect(() => {
    try {
      if (window.location.search) {
        const decoded = decodeOutfitFromShareUrl(window.location.search);
        if (decoded) {
          setStudioFamilyId(decoded.familyId);
          setActiveTab('studio');
          setShareToast('Đã nạp bộ phối từ liên kết chia sẻ!');
          window.history.replaceState({}, document.title, window.location.pathname);
          setTimeout(() => setShareToast(null), 3500);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('nep_viet_saved_looks', JSON.stringify(savedLooks));
    } catch {
      // ignore storage error
    }
  }, [savedLooks]);

  // Handlers
  const handleStartStylingFromBook = (familyId?: CostumeFamilyId) => {
    if (familyId) {
      setStudioFamilyId(familyId);
    }
    setActiveTab('studio');
  };

  const handleSaveLook = (look: SavedLook) => {
    setSavedLooks((prev) => [look, ...prev]);
  };

  const handleDeleteLook = (id: string) => {
    setSavedLooks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleRenameLook = (id: string, newName: string) => {
    setSavedLooks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, name: newName } : l))
    );
  };

  const handleOpenLookInStudio = (state: OutfitState) => {
    setStudioFamilyId(state.familyId);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4ED] text-[#302C27]">
      {/* Toast thông báo nạp từ liên kết chia sẻ */}
      {shareToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#302C27] text-[#FFFCF5] px-5 py-2.5 rounded shadow-xl text-xs font-medium tracking-wide">
          {shareToast}
        </div>
      )}

      {/* Persistent Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedLooks.length}
      />

      {/* Main Content Area with Framer Motion transitions */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'book' && (
            <motion.div
              key="tab_book"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="w-full flex-1 flex flex-col"
            >
              <BookPreview
                onStartStyling={handleStartStylingFromBook}
                onGoToStudio={() => setActiveTab('studio')}
              />
            </motion.div>
          )}

          {activeTab === 'studio' && (
            <motion.div
              key="tab_studio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="w-full flex-1 flex flex-col"
            >
              <StudioView
                initialFamilyId={studioFamilyId}
                onNavigateToBook={() => setActiveTab('book')}
                onSaveLook={handleSaveLook}
              />
            </motion.div>
          )}

          {activeTab === 'lookbook' && (
            <motion.div
              key="tab_lookbook"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="w-full flex-1 flex flex-col"
            >
              <LookbookView
                savedLooks={savedLooks}
                onOpenLook={handleOpenLookInStudio}
                onDeleteLook={handleDeleteLook}
                onRenameLook={handleRenameLook}
                onGoToStudio={() => setActiveTab('studio')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#DED7CB] bg-[#FFFCF5] py-4 text-center text-xs text-[#71685E]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Nếp Việt - Bài thi "Việt phục Remix"
          </span>
          <span className="text-[11px] text-[#71685E]/80">
            Nghiên cứu đối chiếu bảo tàng • Không sử dụng biểu tượng trang trí • Minh họa thời trang 2D
          </span>
        </div>
      </footer>
    </div>
  );
}
