/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type NavTab = 'book' | 'studio' | 'lookbook';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
}) => {
  return (
    <header className="w-full bg-[#FFFCF5] border-b border-[#DED7CB] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('book')}
          className="cursor-pointer flex flex-col justify-center"
        >
          <span className="text-xl font-serif-title font-bold text-[#302C27] tracking-wider">
            NẾP VIỆT
          </span>
          <span className="text-[10px] text-[#A94D3C] tracking-widest uppercase font-medium">
            Mở trang xưa, phối chất riêng
          </span>
        </div>

        {/* Navigation Tabs (Text labels only, NO icons or emoji) */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => onSelectTab('book')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition ${
              activeTab === 'book'
                ? 'bg-[#302C27] text-[#FFFCF5]'
                : 'text-[#71685E] hover:text-[#302C27] hover:bg-[#F7F4ED]'
            }`}
          >
            Khám phá cuốn sổ
          </button>

          <button
            onClick={() => onSelectTab('studio')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition ${
              activeTab === 'studio'
                ? 'bg-[#302C27] text-[#FFFCF5]'
                : 'text-[#71685E] hover:text-[#302C27] hover:bg-[#F7F4ED]'
            }`}
          >
            Xưởng phối đồ
          </button>

          <button
            onClick={() => onSelectTab('lookbook')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition relative ${
              activeTab === 'lookbook'
                ? 'bg-[#302C27] text-[#FFFCF5]'
                : 'text-[#71685E] hover:text-[#302C27] hover:bg-[#F7F4ED]'
            }`}
          >
            Lookbook đã lưu
            {savedCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-[#A94D3C] text-[#FFFCF5] text-[10px] rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
