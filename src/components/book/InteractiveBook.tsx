/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

interface BookPageContent {
  pageNumber: number;
  category: string;
  title: string;
  subtitle: string;
  content: string;
  footnote?: string;
  sourceId?: string;
  illustrationSilhouette?: 'ao_dai' | 'ao_ngu_than' | 'ao_tu_than' | 'phu_kien';
  actionPreset?: string;
  actionLabel?: string;
  isFinalPage?: boolean;
}

export interface BookSpreadData {
  id: string;
  title: string;
  leftPage: BookPageContent;
  rightPage: BookPageContent;
}

interface InteractiveBookProps {
  spreads: BookSpreadData[];
  currentSpreadIndex: number;
  onSpreadChange: (newIndex: number) => void;
  onOpenSourceModal: (sourceId: string) => void;
  onStartStylingPreset?: (presetFamilyId: string) => void;
  onGoToStudio?: () => void;
}

const STRIP_COUNT = 12; // 12 dải nối tiếp tối ưu hiệu năng 60 FPS mà vẫn tạo độ uốn cong mềm mại

export const InteractiveBook: React.FC<InteractiveBookProps> = ({
  spreads,
  currentSpreadIndex,
  onSpreadChange,
  onOpenSourceModal,
  onStartStylingPreset,
  onGoToStudio,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Trạng thái lật trang: 'idle' | 'dragging' | 'settling'
  const [turnState, setTurnState] = useState<'idle' | 'dragging' | 'settling'>('idle');
  const [turnDirection, setTurnDirection] = useState<'forward' | 'backward'>('forward');
  // Tiến độ lật: 0 (đóng tại chỗ) -> 1 (lật hoàn toàn sang trang kế)
  const [dragProgress, setDragProgress] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'3d' | 'flat'>('3d');

  const dragStartXRef = useRef<number>(0);
  const dragStartTimeRef = useRef<number>(0);
  const bookWidthRef = useRef<number>(800);
  const animationFrameRef = useRef<number | null>(null);

  // Nhận diện prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Hỗ trợ phím mũi tên bàn phím khi container đang hiển thị
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        triggerFlip('forward');
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        triggerFlip('backward');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpreadIndex, spreads.length, turnState]);

  // Kích hoạt lật trang bằng nút bấm hoặc phím
  const triggerFlip = (direction: 'forward' | 'backward') => {
    if (turnState !== 'idle') return;
    if (direction === 'forward' && currentSpreadIndex >= spreads.length - 1) return;
    if (direction === 'backward' && currentSpreadIndex <= 0) return;

    if (isReducedMotion || viewMode === 'flat') {
      const nextIndex = direction === 'forward' ? currentSpreadIndex + 1 : currentSpreadIndex - 1;
      onSpreadChange(nextIndex);
      return;
    }

    setTurnDirection(direction);
    setTurnState('settling');

    const duration = 750; // ms chuẩn theo đặc tả (650-900ms)
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      // Easing cubic mượt mà tự nhiên cho giấy
      const easeProgress = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      setDragProgress(easeProgress);

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        const nextIndex = direction === 'forward' ? currentSpreadIndex + 1 : currentSpreadIndex - 1;
        onSpreadChange(nextIndex);
        setDragProgress(0);
        setTurnState('idle');
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // POINTER EVENTS: Kéo chuột hoặc ngón tay để uốn cong lật trang
  const handlePointerDown = (e: React.PointerEvent, direction: 'forward' | 'backward') => {
    if (turnState !== 'idle') return;
    if (direction === 'forward' && currentSpreadIndex >= spreads.length - 1) return;
    if (direction === 'backward' && currentSpreadIndex <= 0) return;

    const target = e.target as HTMLElement;
    // Không chặn thao tác bấm vào nút bấm xem nguồn hoặc chuyển xưởng phối
    if (target.closest('button') || target.closest('a')) return;

    if (containerRef.current) {
      bookWidthRef.current = containerRef.current.offsetWidth / 2;
    }

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStartXRef.current = e.clientX;
    dragStartTimeRef.current = performance.now();
    setTurnDirection(direction);
    setTurnState('dragging');
    setDragProgress(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (turnState !== 'dragging') return;

    const deltaX = e.clientX - dragStartXRef.current;
    const halfWidth = bookWidthRef.current || 400;

    // Chuẩn hóa quãng đường kéo thành tỷ lệ tiến độ [0, 1]
    let progress = 0;
    if (turnDirection === 'forward') {
      progress = Math.max(0, Math.min(1, -deltaX / halfWidth));
    } else {
      progress = Math.max(0, Math.min(1, deltaX / halfWidth));
    }

    setDragProgress(progress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (turnState !== 'dragging') return;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const elapsed = Math.max(1, performance.now() - dragStartTimeRef.current);
    const velocity = dragProgress / (elapsed / 1000); // tiến độ trên giây

    // Ngưỡng lật: vượt qua 35% quãng đường hoặc có vận tốc vuốt nhanh
    const shouldComplete = dragProgress > 0.35 || velocity > 1.2;

    setTurnState('settling');
    const startProgress = dragProgress;
    const targetProgress = shouldComplete ? 1 : 0;
    const settleDuration = Math.max(200, Math.min(500, Math.abs(targetProgress - startProgress) * 450));
    const startTime = performance.now();

    const animateSettle = (currentTime: number) => {
      const settleElapsed = currentTime - startTime;
      const t = Math.min(1, settleElapsed / settleDuration);
      const easeT = 1 - Math.pow(1 - t, 3);
      const currentVal = startProgress + (targetProgress - startProgress) * easeT;

      setDragProgress(currentVal);

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(animateSettle);
      } else {
        if (shouldComplete) {
          const nextIndex = turnDirection === 'forward' ? currentSpreadIndex + 1 : currentSpreadIndex - 1;
          onSpreadChange(nextIndex);
        }
        setDragProgress(0);
        setTurnState('idle');
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateSettle);
  };

  // Tính toán góc uốn cong lũy tiến cho từng dải nối tiếp (Cylindrical strip deformation)
  // Tổng góc quay qua 180 độ khi progress đi từ 0 đến 1
  const curlAngleTotal = dragProgress * 180; // 0deg -> 180deg
  const stripAngleStep = (curlAngleTotal / STRIP_COUNT) * 1.05;

  const currentSpread = spreads[currentSpreadIndex];
  const nextSpread = currentSpreadIndex < spreads.length - 1 ? spreads[currentSpreadIndex + 1] : null;
  const prevSpread = currentSpreadIndex > 0 ? spreads[currentSpreadIndex - 1] : null;

  return (
    <div className="w-full flex flex-col items-center select-none" ref={containerRef}>
      {/* Thanh công cụ phụ trợ (Chế độ đọc / Hướng dẫn) */}
      <div className="w-full flex items-center justify-between text-xs text-[#71685E] pb-2 px-1">
        <span className="italic">
          Gợi ý: Dùng chuột kéo mép trang để uốn cong lật sách, hoặc dùng hai phím mũi tên trái/phải.
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === '3d' ? 'flat' : '3d')}
            className="px-2.5 py-1 border border-[#DED7CB] bg-[#FFFCF5] hover:bg-[#F0EAE1] rounded text-[#302C27] font-medium transition"
          >
            {viewMode === '3d' ? 'Chuyển đọc phẳng' : 'Chuyển sách 3D'}
          </button>
        </div>
      </div>

      {/* KHUNG CUỐN SỔ 3D CHÍNH (Perspective Container) */}
      <div
        className="relative w-full max-w-5xl min-h-[580px] bg-[#FFFCF5] border border-[#DED7CB] rounded-lg shadow-2xl overflow-hidden"
        style={{
          perspective: '1800px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Bóng tiếp xúc dưới gáy và các cạnh sách */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(48,44,39,0.06)] z-20" />

        {/* Gáy sách ở trung tâm với rãnh đổ bóng tự nhiên */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-10 -translate-x-1/2 pointer-events-none z-30 bg-gradient-to-r from-transparent via-[#302C27]/15 to-transparent" />

        {/* NỀN CỐ ĐỊNH 2 BÊN TRANG SÁCH */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full min-h-[580px]">
          {/* ================= TRANG TRÁI TĨNH ================= */}
          <div
            className="p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#DED7CB] bg-[#FFFCF5] relative cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => handlePointerDown(e, 'backward')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Nội dung trang trái: nếu đang lật lùi và dragProgress > 0.5 thì dần hé lộ trang của prevSpread */}
            <PageContentRenderer
              page={
                turnState !== 'idle' && turnDirection === 'backward' && dragProgress > 0.5 && prevSpread
                  ? prevSpread.leftPage
                  : currentSpread.leftPage
              }
              onOpenSourceModal={onOpenSourceModal}
              onStartStylingPreset={onStartStylingPreset}
              onGoToStudio={onGoToStudio}
            />

            {/* Mép kéo trang trước (Khu vực bắt Pointer) */}
            <div className="absolute top-0 bottom-0 left-0 w-8 hover:bg-[#A94D3C]/5 transition" />
          </div>

          {/* ================= TRANG PHẢI TĨNH ================= */}
          <div
            className="p-8 md:p-10 flex flex-col justify-between bg-[#FFFCF5] relative cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => handlePointerDown(e, 'forward')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Nội dung trang phải: khi đang lật tiến, lớp tĩnh bên dưới hiển thị trước trang của nextSpread */}
            <PageContentRenderer
              page={
                turnState !== 'idle' && turnDirection === 'forward' && nextSpread
                  ? nextSpread.rightPage
                  : currentSpread.rightPage
              }
              onOpenSourceModal={onOpenSourceModal}
              onStartStylingPreset={onStartStylingPreset}
              onGoToStudio={onGoToStudio}
            />

            {/* Mép kéo trang sau (Khu vực bắt Pointer) */}
            <div className="absolute top-0 bottom-0 right-0 w-8 hover:bg-[#A94D3C]/5 transition" />
          </div>
        </div>

        {/* ================= TỜ GIẤY ĐANG LẬT BẰNG CSS 3D NHIỀU DẢI (TURNING LEAF) ================= */}
        {viewMode === '3d' && turnState !== 'idle' && dragProgress > 0.005 && (
          <div
            className="hidden md:block absolute top-0 bottom-0 w-1/2 pointer-events-none z-40 overflow-visible"
            style={{
              left: turnDirection === 'forward' ? '50%' : '0%',
              transformOrigin: turnDirection === 'forward' ? 'left center' : 'right center',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Cấu trúc đa dải lồng nhau (Nested Strips Engine) */}
            <MultiStripBendingPage
              stripCount={STRIP_COUNT}
              stripAngleStep={stripAngleStep}
              direction={turnDirection}
              progress={dragProgress}
              frontContent={
                turnDirection === 'forward'
                  ? currentSpread.rightPage
                  : prevSpread
                  ? prevSpread.rightPage
                  : currentSpread.rightPage
              }
              backContent={
                turnDirection === 'forward' && nextSpread
                  ? nextSpread.leftPage
                  : currentSpread.leftPage
              }
              onOpenSourceModal={onOpenSourceModal}
            />
          </div>
        )}
      </div>

      {/* ================= THANH NÚT ĐIỀU KHIỂN DƯỚI SÁCH ================= */}
      <div className="w-full flex items-center justify-between mt-6 px-2">
        <button
          onClick={() => triggerFlip('backward')}
          disabled={currentSpreadIndex === 0 || turnState !== 'idle'}
          className={`py-2 px-5 rounded border text-xs font-medium transition ${
            currentSpreadIndex === 0 || turnState !== 'idle'
              ? 'border-[#DED7CB] text-[#71685E]/40 cursor-not-allowed bg-[#F7F4ED]'
              : 'border-[#DED7CB] bg-[#FFFCF5] hover:bg-[#F0EAE1] text-[#302C27] shadow-sm'
          }`}
        >
          Trang trước
        </button>

        {/* Chỉ số trang và thanh tiến độ cuốn sách */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1.5 mb-1.5">
            {spreads.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  if (turnState === 'idle' && idx !== currentSpreadIndex) {
                    onSpreadChange(idx);
                  }
                }}
                className={`w-6 h-6 rounded-full text-[11px] font-medium transition flex items-center justify-center ${
                  idx === currentSpreadIndex
                    ? 'bg-[#302C27] text-[#FFFCF5]'
                    : 'bg-[#FFFCF5] border border-[#DED7CB] text-[#71685E] hover:bg-[#F0EAE1]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-[#71685E]">
            {currentSpread.title} (Trang {currentSpreadIndex * 2 + 1} - {currentSpreadIndex * 2 + 2})
          </span>
        </div>

        <button
          onClick={() => triggerFlip('forward')}
          disabled={currentSpreadIndex >= spreads.length - 1 || turnState !== 'idle'}
          className={`py-2 px-5 rounded border text-xs font-medium transition ${
            currentSpreadIndex >= spreads.length - 1 || turnState !== 'idle'
              ? 'border-[#DED7CB] text-[#71685E]/40 cursor-not-allowed bg-[#F7F4ED]'
              : 'border-[#DED7CB] bg-[#FFFCF5] hover:bg-[#F0EAE1] text-[#302C27] shadow-sm'
          }`}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

// ================= COMPONENT HIỂN THỊ NỘI DUNG MỘT TRANG TĨNH =================
interface PageContentRendererProps {
  page: BookPageContent;
  onOpenSourceModal: (sourceId: string) => void;
  onStartStylingPreset?: (presetFamilyId: string) => void;
  onGoToStudio?: () => void;
}

const PageContentRenderer: React.FC<PageContentRendererProps> = ({
  page,
  onOpenSourceModal,
  onStartStylingPreset,
  onGoToStudio,
}) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between text-xs text-[#71685E] border-b border-[#DED7CB]/60 pb-2 mb-4">
          <span className="uppercase tracking-widest font-medium">{page.category}</span>
          <span>Trang {page.pageNumber}</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold text-[#302C27] font-serif-title mb-1">
          {page.title}
        </h2>
        <p className="text-sm text-[#A94D3C] font-medium mb-3 italic">
          {page.subtitle}
        </p>

        {/* Trình bày hình phác họa trang phục trên các trang thị giác */}
        {page.illustrationSilhouette && (
          <div className="my-3 p-3 bg-[#F7F4ED] border border-[#DED7CB] rounded flex items-center justify-between">
            <div className="text-xs text-[#71685E]">
              <span className="font-semibold text-[#302C27] block mb-0.5">Phác họa hình thái</span>
              {page.illustrationSilhouette === 'ao_dai' && 'Tà đôi buông rủ qua gối, chiết eo thanh thoát, xẻ cao.'}
              {page.illustrationSilhouette === 'ao_ngu_than' && 'Cổ đứng lập lĩnh cao, năm khuy cài lệch phải, tà con che ngực.'}
              {page.illustrationSilhouette === 'ao_tu_than' && 'Bốn thân vải mộc, vạt trước buông lửng hoặc buộc vạt, yếm đào.'}
              {page.illustrationSilhouette === 'phu_kien' && 'Nón quai thao, nón lá, khăn đóng xếp nếp và quạt nan tre.'}
            </div>
            <div className="w-12 h-16 border border-[#DED7CB] bg-[#FFFCF5] rounded flex items-center justify-center text-[10px] text-[#A94D3C] font-semibold text-center uppercase tracking-tighter px-1">
              {page.illustrationSilhouette === 'ao_dai' ? 'Áo dài' : page.illustrationSilhouette === 'ao_ngu_than' ? 'Ngũ thân' : page.illustrationSilhouette === 'ao_tu_than' ? 'Tứ thân' : 'Phụ kiện'}
            </div>
          </div>
        )}

        <div className="text-sm leading-relaxed text-[#302C27] whitespace-pre-line font-normal">
          {page.content}
        </div>

        {/* Nút tác vụ đặc biệt trên các trang cuối hoặc trang giới thiệu */}
        {page.actionPreset && onStartStylingPreset && (
          <div className="mt-4 p-3 bg-[#F7F4ED] border border-[#DED7CB] rounded">
            <button
              onClick={() => onStartStylingPreset(page.actionPreset!)}
              className="w-full py-2 px-4 bg-[#71806A] hover:bg-[#5C6B56] text-[#FFFCF5] text-xs font-semibold rounded tracking-wide transition text-center shadow-sm"
            >
              {page.actionLabel || 'Thử phối bộ này'}
            </button>
          </div>
        )}

        {page.isFinalPage && onGoToStudio && (
          <div className="mt-5 p-4 bg-[#F7F4ED] border border-[#DED7CB] rounded text-center">
            <div className="text-sm font-serif-title font-semibold text-[#302C27] mb-1.5">
              Sẵn sàng sáng tạo phong cách riêng?
            </div>
            <p className="text-xs text-[#71685E] mb-3">
              Bước vào studio thời trang 2D với đầy đủ công cụ đổi màu, phụ kiện và phân tích văn hóa.
            </p>
            <button
              onClick={onGoToStudio}
              className="w-full py-2.5 px-5 bg-[#A94D3C] hover:bg-[#8F3F30] text-[#FFFCF5] text-xs font-semibold rounded tracking-wider uppercase transition shadow-md"
            >
              Bắt đầu phối Việt phục
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-[#DED7CB]/60 flex items-center justify-between text-xs">
        {page.sourceId ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onOpenSourceModal(page.sourceId!)}
              className="text-[#71806A] hover:text-[#53604E] underline font-medium"
            >
              Đọc thêm chuyên sâu
            </button>
          </div>
        ) : (
          <span className="text-[#71685E] italic">
            {page.footnote || 'Nếp Việt Sketchbook'}
          </span>
        )}
        <span className="text-[#71685E] font-medium">{page.pageNumber}</span>
      </div>
    </div>
  );
};

// ================= CƠ CHẾ UỐN CONG 3D ĐA DẢI (NESTED MULTI-STRIP LEAF) =================
interface MultiStripBendingPageProps {
  stripCount: number;
  stripAngleStep: number;
  direction: 'forward' | 'backward';
  progress: number;
  frontContent: BookPageContent;
  backContent: BookPageContent;
  onOpenSourceModal: (sourceId: string) => void;
}

const MultiStripBendingPage: React.FC<MultiStripBendingPageProps> = ({
  stripCount,
  stripAngleStep,
  direction,
  progress,
  frontContent,
  backContent,
  onOpenSourceModal,
}) => {
  // Chiều rộng mỗi dải (%)
  const stripWidthPercent = 100 / stripCount;

  // Lắp ghép đệ quy các dải lồng nhau để mỗi dải sau kế thừa góc quay của dải trước
  const renderStrips = (index: number): React.ReactNode => {
    if (index >= stripCount) return null;

    // Góc quay của dải này
    const rotateY = direction === 'forward' ? -stripAngleStep : stripAngleStep;
    // Bóng đổ cục bộ trên dải tùy theo góc uốn
    const shadowOpacity = Math.min(0.22, Math.abs(rotateY) * 0.02 * (1 - Math.abs(progress - 0.5) * 1.5));

    return (
      <div
        className="absolute top-0 bottom-0 h-full overflow-visible"
        style={{
          width: `${stripWidthPercent + 0.15}%`, // Thêm 0.15% bù đắp làm tròn subpixel tránh hở viền
          left: index === 0 ? '0%' : '100%',
          transformOrigin: direction === 'forward' ? 'left center' : 'right center',
          transform: `rotateY(${rotateY}deg) translateZ(${index * 0.2}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* MẶT TRƯỚC CỦA DẢI (Hiển thị vùng tương ứng của trang nguồn) */}
        <div
          className="absolute inset-0 h-full overflow-hidden bg-[#FFFCF5] border-t border-b border-[#DED7CB]"
          style={{
            backfaceVisibility: 'hidden',
            boxShadow: `inset 0 0 10px rgba(48,44,39,${shadowOpacity})`,
          }}
        >
          {/* Căn chỉnh nội dung trang vào đúng vị trí của dải */}
          <div
            className="absolute top-0 h-full p-8 md:p-10 pointer-events-none"
            style={{
              width: `${stripCount * 100}%`,
              left: `-${index * 100}%`,
            }}
          >
            <PageContentRenderer page={frontContent} onOpenSourceModal={onOpenSourceModal} />
          </div>
        </div>

        {/* MẶT SAU CỦA DẢI (Hiển thị trang kế tiếp, được lật 180deg để không soi gương chữ!) */}
        <div
          className="absolute inset-0 h-full overflow-hidden bg-[#FFFCF5] border-t border-b border-[#DED7CB]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: `inset 0 0 10px rgba(48,44,39,${shadowOpacity})`,
          }}
        >
          <div
            className="absolute top-0 h-full p-8 md:p-10 pointer-events-none"
            style={{
              width: `${stripCount * 100}%`,
              left: `-${(stripCount - 1 - index) * 100}%`,
            }}
          >
            <PageContentRenderer page={backContent} onOpenSourceModal={onOpenSourceModal} />
          </div>
        </div>

        {/* Dải kế tiếp lồng bên trong dải hiện tại */}
        {renderStrips(index + 1)}
      </div>
    );
  };

  return (
    <div
      className="relative w-full h-full"
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {renderStrips(0)}
    </div>
  );
};
