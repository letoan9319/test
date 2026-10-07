/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { COLOR_PALETTES, COSTUME_ITEMS } from '../../data/catalog';
import { DEFAULT_RIG_ANCHORS, OutfitState } from '../../types';

interface CharacterCanvasProps {
  state: OutfitState;
  className?: string;
  showBackdrop?: boolean;
  showAnchors?: boolean;
}

export const CharacterCanvas: React.FC<CharacterCanvasProps> = ({
  state,
  className = '',
  showBackdrop = true,
  showAnchors = false,
}) => {
  const palette = COLOR_PALETTES.find((p) => p.id === state.paletteId) || COLOR_PALETTES[0];
  const topItem = COSTUME_ITEMS.find((i) => i.id === state.topId);
  const bottomItem = COSTUME_ITEMS.find((i) => i.id === state.bottomId);
  const sashItem = state.sashId ? COSTUME_ITEMS.find((i) => i.id === state.sashId) : null;
  const headwearItem = state.headwearId ? COSTUME_ITEMS.find((i) => i.id === state.headwearId) : null;
  const handheldItem = state.handheldId ? COSTUME_ITEMS.find((i) => i.id === state.handheldId) : null;

  const anchors = DEFAULT_RIG_ANCHORS;

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none overflow-hidden ${className}`}
      style={{ aspectRatio: '2/3' }}
    >
      {/* SVG Vector 2D Fashion Mannequin Rig */}
      <svg
        viewBox="0 0 600 900"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Minh họa 2D trang phục Việt truyền thống trên nhân vật mẫu chuẩn"
      >
        <defs>
          {/* Subtle paper & fabric gradients */}
          <linearGradient id="bodySkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E4D4" />
            <stop offset="100%" stopColor="#E5CDBC" />
          </linearGradient>

          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A2421" />
            <stop offset="50%" stopColor="#201C19" />
            <stop offset="100%" stopColor="#141110" />
          </linearGradient>

          <linearGradient id="fabricShading" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.16" />
            <stop offset="35%" stopColor="#000000" stopOpacity="0.04" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
          </linearGradient>

          <linearGradient id="silkSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.02" />
            <stop offset="80%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
          </linearGradient>

          {/* Dệt vân lụa chìm mộc mạc */}
          <pattern id="silkTexture" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 4 L8 4 M4 0 L4 8" stroke="#000000" strokeWidth="0.5" strokeOpacity="0.03" />
          </pattern>

          <filter id="subtleDrop" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#302C27" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* ================= 1. NỀN & KHUNG GIẤY (Backdrop & Floor Shadow) ================= */}
        {showBackdrop && (
          <g id="backdrop">
            <rect width="600" height="900" fill="#FFFCF5" rx="8" />
            <rect
              x="20"
              y="20"
              width="560"
              height="860"
              fill="none"
              stroke="#DED7CB"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              rx="6"
            />
            {/* Bóng tiếp xúc nền sàn */}
            <ellipse cx="300" cy="840" rx="140" ry="18" fill="#302C27" fillOpacity="0.07" />
            <ellipse cx="300" cy="840" rx="70" ry="8" fill="#302C27" fillOpacity="0.05" />
          </g>
        )}

        {/* ================= 2. LỚP TÓC SAU (Back Hair & Back Bun) ================= */}
        <g id="back_hair">
          {/* Búi tóc gọn sau gáy */}
          <circle cx="300" cy="115" r="28" fill="url(#hairGrad)" />
          {/* Thân tóc buông sau */}
          <path
            d="M260 160 Q240 230 250 270 Q270 295 300 295 Q330 295 350 270 Q360 230 340 160 Z"
            fill="url(#hairGrad)"
          />
        </g>

        {/* ================= 3. CƠ THỂ VÀ TƯ THẾ CHUẨN (Base Anatomy & Silhouette) ================= */}
        <g id="base_body">
          {/* Cổ (Neck) - Neo tại neckCenter */}
          <path d="M282 175 L282 225 L318 225 L318 175 Z" fill="url(#bodySkin)" />
          {/* Đường bóng hõm cổ */}
          <path d="M294 218 Q300 224 306 218" stroke="#D1B29D" strokeWidth="1.2" strokeLinecap="round" />

          {/* Đầu & Khuôn mặt thanh tú (Head & Facial Features) */}
          <ellipse cx="300" cy="145" rx="36" ry="46" fill="url(#bodySkin)" />

          {/* Ngũ quan đường nét thanh thoát */}
          <path d="M296 142 L300 152 L294 154" stroke="#71685E" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M290 165 Q300 169 310 165" stroke="#9E382B" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M276 136 Q286 134 294 136" stroke="#4A3F35" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M306 136 Q314 134 324 136" stroke="#4A3F35" strokeWidth="1.6" strokeLinecap="round" />

          {/* Tóc trước chải rẽ ngôi mượt mà */}
          <path
            d="M265 145 C265 105 335 105 335 145 C320 120 280 120 265 145 Z"
            fill="url(#hairGrad)"
          />

          {/* Thân cơ sở kín đáo (Undergarment Bodice Base) */}
          <path
            d="M260 225 Q300 220 340 225 L355 330 Q300 340 245 330 Z"
            fill="#F3EDE2"
          />

          {/* Chân & giày hài vạn (Legs and Shoes Base) */}
          <path d="M275 750 L275 830 L295 830 L295 750 Z" fill="#F3EDE2" />
          <path d="M305 750 L305 830 L325 830 L325 750 Z" fill="#F3EDE2" />
          {/* Đôi hài vạn nhung đen mũi cong */}
          <path d="M270 835 Q285 828 300 835 L296 840 Q280 842 268 839 Z" fill="#302C27" />
          <path d="M300 835 Q315 828 330 835 L332 839 Q320 842 304 840 Z" fill="#302C27" />
        </g>

        {/* ================= 4. LỚP QUẦN HOẶC VÁY (Bottom Garment Layer) ================= */}
        <g id="bottom_layer" filter="url(#subtleDrop)">
          {bottomItem?.id === 'bot_vay_xoe_den' ? (
            // Váy lụa sồi đen xòe buông gót
            <g>
              <path
                d="M250 330 Q300 340 350 330 L385 815 Q300 832 215 815 Z"
                fill={palette.bottom}
              />
              <path
                d="M250 330 Q300 340 350 330 L385 815 Q300 832 215 815 Z"
                fill="url(#fabricShading)"
              />
              <path
                d="M250 330 Q300 340 350 330 L385 815 Q300 832 215 815 Z"
                fill="url(#silkTexture)"
              />
              {/* Nếp xếp rủ dập dờn sống động của váy sồi */}
              <path d="M270 338 L255 818" stroke="#000000" strokeOpacity="0.25" strokeWidth="1.8" />
              <path d="M290 340 L285 822" stroke="#000000" strokeOpacity="0.2" strokeWidth="1.6" />
              <path d="M310 340 L315 822" stroke="#000000" strokeOpacity="0.2" strokeWidth="1.6" />
              <path d="M330 338 L345 818" stroke="#000000" strokeOpacity="0.25" strokeWidth="1.8" />
            </g>
          ) : (
            // Quần lụa ống rộng truyền thống buông thẳng
            <g>
              {/* Ống quần trái */}
              <path
                d="M255 330 Q275 335 295 335 L265 815 Q245 815 235 810 L248 335 Z"
                fill={palette.bottom}
              />
              {/* Ống quần phải */}
              <path
                d="M305 335 Q325 335 345 330 L352 335 L365 810 Q355 815 335 815 L305 335 Z"
                fill={palette.bottom}
              />
              {/* Bóng nếp vải quần */}
              <path
                d="M255 330 Q275 335 295 335 L265 815 Q245 815 235 810 L248 335 Z"
                fill="url(#silkSheen)"
              />
              <path
                d="M305 335 Q325 335 345 330 L352 335 L365 810 Q355 815 335 815 L305 335 Z"
                fill="url(#silkSheen)"
              />
              {/* Đường ly và nếp rủ vải lụa */}
              <path d="M260 400 L250 805" stroke="#000000" strokeOpacity="0.12" strokeWidth="1.5" />
              <path d="M340 400 L350 805" stroke="#000000" strokeOpacity="0.12" strokeWidth="1.5" />
            </g>
          )}
        </g>

        {/* ================= 5. LỚP ÁO VÀ CÁC VẠT (Top Garment Layer) ================= */}
        <g id="top_layer" filter="url(#subtleDrop)">
          {state.familyId === 'ao_ngu_than' ? (
            // --- ÁO NGŨ THÂN ---
            <g id="garment_ngu_than">
              {/* Thân áo buông dài qua gối */}
              <path
                d="M255 225 Q300 220 345 225 L368 400 L382 720 Q300 735 218 720 L232 400 Z"
                fill={palette.primary}
              />
              {/* Áp dụng dệt vân lụa và phủ bóng nếp vải */}
              <path
                d="M255 225 Q300 220 345 225 L368 400 L382 720 Q300 735 218 720 L232 400 Z"
                fill="url(#fabricShading)"
              />
              <path
                d="M255 225 Q300 220 345 225 L368 400 L382 720 Q300 735 218 720 L232 400 Z"
                fill="url(#silkTexture)"
              />

              {/* Thân con bên trong nằm lấp ló bên phải (Đặc trưng ngũ thân) */}
              <path
                d="M300 222 C300 250 330 270 338 310 L352 520 L318 520 L300 222 Z"
                fill={palette.secondary}
                opacity="0.4"
              />

              {/* Cổ đứng lập lĩnh cao 3-4cm ôm sát gáy */}
              <path
                d="M280 205 L280 225 Q300 228 320 225 L320 205 Q300 208 280 205 Z"
                fill={palette.accent}
              />
              {/* Lớp ve cổ lót lụa trắng/ngọc */}
              <path
                d="M282 208 Q300 211 318 208"
                stroke={palette.secondary}
                strokeWidth="2"
              />

              {/* Đường vạt áo cài chéo lệch bên phải */}
              <path
                d="M320 225 Q338 270 342 340 L356 718"
                stroke="#000000"
                strokeOpacity="0.25"
                strokeWidth="2"
              />

              {/* Năm khuy cài bên phải (Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín) */}
              <circle cx="316" cy="216" r="3.2" fill="#D4AF37" stroke="#71685E" strokeWidth="0.8" />
              <circle cx="324" cy="240" r="3.2" fill="#D4AF37" stroke="#71685E" strokeWidth="0.8" />
              <circle cx="332" cy="270" r="3.2" fill="#D4AF37" stroke="#71685E" strokeWidth="0.8" />
              <circle cx="338" cy="305" r="3.2" fill="#D4AF37" stroke="#71685E" strokeWidth="0.8" />
              <circle cx="342" cy="340" r="3.2" fill="#D4AF37" stroke="#71685E" strokeWidth="0.8" />

              {/* Tay áo: Phân biệt tay chẽn và tay thụng (Áo tấc) */}
              {topItem?.id === 'top_ngu_than_thung' ? (
                // Áo tấc (Tay thụng rộng buông xuống)
                <g>
                  <path
                    d="M255 225 L180 340 L195 560 L245 440 L252 280 Z"
                    fill={palette.primary}
                  />
                  <path
                    d="M345 225 L420 340 L405 560 L355 440 L348 280 Z"
                    fill={palette.primary}
                  />
                  <path
                    d="M255 225 L180 340 L195 560 L245 440 L252 280 Z"
                    fill="url(#fabricShading)"
                  />
                  <path
                    d="M345 225 L420 340 L405 560 L355 440 L348 280 Z"
                    fill="url(#fabricShading)"
                  />
                </g>
              ) : (
                // Tay chẽn thuôn dài ôm dần về cổ tay
                <g>
                  <path
                    d="M255 225 L218 360 L208 425 L225 425 L252 350 L262 260 Z"
                    fill={palette.primary}
                  />
                  <path
                    d="M345 225 L382 360 L392 425 L375 425 L348 350 L338 260 Z"
                    fill={palette.primary}
                  />
                  <path
                    d="M255 225 L218 360 L208 425 L225 425 L252 350 L262 260 Z"
                    fill="url(#fabricShading)"
                  />
                  <path
                    d="M345 225 L382 360 L392 425 L375 425 L348 350 L338 260 Z"
                    fill="url(#fabricShading)"
                  />
                </g>
              )}
            </g>
          ) : state.familyId === 'ao_dai' ? (
            // --- ÁO DÀI ---
            <g id="garment_ao_dai">
              {/* Tà trước áo dài buông dài quá gối tha thướt */}
              <path
                d="M265 225 Q300 220 335 225 L348 330 Q352 420 342 460 L370 765 Q300 780 230 765 L258 460 Q248 420 252 330 Z"
                fill={palette.primary}
              />
              <path
                d="M265 225 Q300 220 335 225 L348 330 Q352 420 342 460 L370 765 Q300 780 230 765 L258 460 Q248 420 252 330 Z"
                fill="url(#fabricShading)"
              />
              <path
                d="M265 225 Q300 220 335 225 L348 330 Q352 420 342 460 L370 765 Q300 780 230 765 L258 460 Q248 420 252 330 Z"
                fill="url(#silkTexture)"
              />

              {/* Cổ áo dài */}
              {topItem?.id === 'top_aodai_cachtan' ? (
                // Cổ tròn cách tân thanh thoát
                <path
                  d="M280 220 Q300 235 320 220 Q300 216 280 220 Z"
                  fill={palette.accent}
                />
              ) : (
                // Cổ đứng truyền thống cao vừa vặn
                <g>
                  <path
                    d="M284 205 L284 225 Q300 228 316 225 L316 205 Q300 208 284 205 Z"
                    fill={palette.accent}
                  />
                  <path d="M285 208 Q300 211 315 208" stroke={palette.secondary} strokeWidth="1.6" />
                </g>
              )}

              {/* Đường xẻ tà eo (slit) cao thanh thoát */}
              <circle cx="258" cy="455" r="3" fill="#D4AF37" opacity="0.8" />
              <circle cx="342" cy="455" r="3" fill="#D4AF37" opacity="0.8" />

              {/* Tay áo dài */}
              <path
                d="M265 225 L222 360 L212 425 L228 425 L255 350 L268 260 Z"
                fill={palette.primary}
              />
              <path
                d="M335 225 L378 360 L388 425 L372 425 L345 350 L332 260 Z"
                fill={palette.primary}
              />
              <path
                d="M265 225 L222 360 L212 425 L228 425 L255 350 L268 260 Z"
                fill="url(#fabricShading)"
              />
              <path
                d="M335 225 L378 360 L388 425 L372 425 L345 350 L332 260 Z"
                fill="url(#fabricShading)"
              />
            </g>
          ) : (
            // --- ÁO TỨ THÂN ---
            <g id="garment_tu_than">
              {/* Yếm lót bên trong (Inner yếm đào cổ xây kín đáo) */}
              <path
                d="M276 225 Q300 235 324 225 L332 340 Q300 350 268 340 Z"
                fill={palette.secondary}
              />
              <path d="M278 226 L300 248 L322 226" stroke={palette.accent} strokeWidth="1.8" />

              {/* Áo tứ thân: Phân biệt vạt buông lửng và vạt buộc nút */}
              {topItem?.id === 'top_tu_than_cachdieuviet' ? (
                // Vạt trước buộc nút ngang eo
                <g>
                  <path
                    d="M255 225 L276 340 L285 410 L250 560 L232 400 Z"
                    fill={palette.primary}
                  />
                  <path
                    d="M345 225 L324 340 L315 410 L350 560 L368 400 Z"
                    fill={palette.primary}
                  />
                  {/* Nút buộc vạt mềm mại */}
                  <ellipse cx="300" cy="410" rx="14" ry="10" fill={palette.accent} />
                  <path d="M295 415 L288 460" stroke={palette.accent} strokeWidth="4" strokeLinecap="round" />
                  <path d="M305 415 L312 460" stroke={palette.accent} strokeWidth="4" strokeLinecap="round" />
                </g>
              ) : (
                // Hai vạt trước buông tự nhiên
                <g>
                  <path
                    d="M255 225 L278 340 L275 660 L225 640 L235 360 Z"
                    fill={palette.primary}
                  />
                  <path
                    d="M345 225 L322 340 L325 660 L375 640 L365 360 Z"
                    fill={palette.primary}
                  />
                </g>
              )}

              {/* Tay áo lửng thoải mái */}
              <path
                d="M255 225 L215 350 L228 358 L262 255 Z"
                fill={palette.primary}
              />
              <path
                d="M345 225 L385 350 L372 358 L338 255 Z"
                fill={palette.primary}
              />
            </g>
          )}
        </g>

        {/* ================= 6. LỚP THẮT LƯNG / DẢI BAO (Sash Layer) ================= */}
        {sashItem && (
          <g id="sash_layer" filter="url(#subtleDrop)">
            {/* Dải thắt lưng quấn quanh eo - Neo tại waistCenter */}
            <path
              d="M260 360 Q300 370 340 360 L342 385 Q300 395 258 385 Z"
              fill={palette.accent}
            />
            {/* Hai dải bao lụa rủ mềm buông phía trước */}
            <path
              d="M288 385 Q285 480 282 560 L294 560 Q296 480 295 385 Z"
              fill={palette.accent}
            />
            <path
              d="M305 385 Q308 490 312 575 L324 575 Q318 490 312 385 Z"
              fill={palette.secondary}
            />
          </g>
        )}

        {/* ================= 7. BÀN TAY TIỀN CẢNH (Forefront Hands Natural Pose) ================= */}
        {/* Bàn tay nằm trước tà áo để giữ phụ kiện và tạo chiều sâu tự nhiên */}
        <g id="forefront_hands">
          {/* Tay trái người nhìn (Phải nhân vật) - Neo tại wristLeft */}
          <path
            d="M216 418 Q210 435 218 440 Q226 442 228 424 Z"
            fill="url(#bodySkin)"
          />
          {/* Ngón tay khéo léo */}
          <ellipse cx="218" cy="432" rx="6" ry="10" fill="url(#bodySkin)" />

          {/* Tay phải người nhìn (Trái nhân vật) - Neo tại wristRight */}
          <path
            d="M384 418 Q390 435 382 440 Q374 442 372 424 Z"
            fill="url(#bodySkin)"
          />
          <ellipse cx="382" cy="432" rx="6" ry="10" fill="url(#bodySkin)" />
        </g>

        {/* ================= 8. LỚP PHỤ KIỆN ĐẦU (Headwear Layer) ================= */}
        {headwearItem && (
          <g id="headwear_layer" filter="url(#subtleDrop)">
            {headwearItem.id === 'head_khan_dong' ? (
              // Khăn đóng xếp nếp thời Nguyễn (Chữ Nhân quanh trán)
              <g>
                <path
                  d="M250 145 C250 108 350 108 350 145 C350 162 250 162 250 145 Z"
                  fill="#1F1E1C"
                />
                {/* Nếp quấn khăn đều đặn */}
                <path d="M252 135 Q300 118 348 135" stroke="#3D3833" strokeWidth="2.5" />
                <path d="M252 142 Q300 125 348 142" stroke="#4A453F" strokeWidth="2" />
                <path d="M252 149 Q300 132 348 149" stroke="#3D3833" strokeWidth="1.8" />
                {/* Đường giao nhau chữ Nhân ở trán */}
                <path d="M296 130 L300 144 L304 130" stroke="#5A524A" strokeWidth="1.2" />
              </g>
            ) : headwearItem.id === 'head_non_la' ? (
              // Nón lá quai lụa chóp nhọn truyền thống
              <g>
                <path
                  d="M190 145 L300 50 L410 145 Q300 165 190 145 Z"
                  fill="#EFE7D3"
                  stroke="#D3C7AE"
                  strokeWidth="1.5"
                />
                {/* Vòng nan nón */}
                <ellipse cx="300" cy="142" rx="90" ry="10" stroke="#C5B89C" strokeWidth="0.8" fill="none" />
                <ellipse cx="300" cy="115" rx="55" ry="7" stroke="#C5B89C" strokeWidth="0.8" fill="none" />
                <ellipse cx="300" cy="85" rx="25" ry="4" stroke="#C5B89C" strokeWidth="0.8" fill="none" />
                {/* Quai lụa ôm nhẹ dưới cằm */}
                <path
                  d="M240 145 Q260 200 290 220 Q320 200 360 145"
                  stroke={palette.accent}
                  strokeWidth="2.8"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            ) : headwearItem.id === 'head_non_quai_thao' ? (
              // Nón ba tầm (nón quai thao) Kinh Bắc
              <g>
                {/* Vành nón tròn phẳng rộng lợp lá gồi */}
                <ellipse
                  cx="300"
                  cy="95"
                  rx="140"
                  ry="25"
                  fill="#DFD4BE"
                  stroke="#BAAA8D"
                  strokeWidth="2"
                />
                {/* Chóp nón phẳng nhẹ */}
                <ellipse cx="300" cy="85" rx="60" ry="12" fill="#C5B89C" />
                {/* Vành tang nón */}
                <path d="M165 95 Q300 115 435 95" stroke="#BAAA8D" strokeWidth="1.5" fill="none" />
                {/* Hai dải quai thao bện sợi tơ buông dài */}
                <path d="M190 100 Q195 240 190 340" stroke="#4A261D" strokeWidth="3" strokeLinecap="round" />
                <path d="M410 100 Q405 240 410 340" stroke="#4A261D" strokeWidth="3" strokeLinecap="round" />
                {/* Chùm quả thao rủ bên ngực áo */}
                <path d="M185 340 L195 385 L188 390" stroke="#9E382B" strokeWidth="2.8" />
                <path d="M405 340 L415 385 L408 390" stroke="#9E382B" strokeWidth="2.8" />
              </g>
            ) : (
              // Trâm cài tóc xà cừ
              <g>
                <path d="M315 125 L358 102" stroke="#8C382A" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="358" cy="102" r="5" fill="#E8DDD0" stroke="#8C382A" strokeWidth="1.2" />
                <circle cx="358" cy="102" r="2" fill="#FFFFFF" />
              </g>
            )}
          </g>
        )}

        {/* ================= 9. LỚP PHỤ KIỆN TAY (Handheld Accessories Layer) ================= */}
        {handheldItem && (
          <g id="handheld_layer" filter="url(#subtleDrop)">
            {handheldItem.id === 'hand_quat_tranh' ? (
              // Quạt nan tre dán giấy mộc vẽ sen (cầm chắc trong tay phải)
              <g transform="translate(202, 400) rotate(-15)">
                {/* Nan và mặt quạt xòe */}
                <path
                  d="M20 30 L-25 -20 A45 45 0 0 1 65 -20 Z"
                  fill="#EFE8D6"
                  stroke="#BAAA8D"
                  strokeWidth="1.2"
                />
                {/* Các nan tre mỏng */}
                <path d="M20 30 L-15 -18" stroke="#8C7761" strokeWidth="1" />
                <path d="M20 30 L5 -24" stroke="#8C7761" strokeWidth="1" />
                <path d="M20 30 L25 -24" stroke="#8C7761" strokeWidth="1" />
                <path d="M20 30 L45 -18" stroke="#8C7761" strokeWidth="1" />
                {/* Điểm hoa sen tao nhã */}
                <circle cx="20" cy="-5" r="4.5" fill="#9E382B" opacity="0.65" />
                {/* Cán quạt tre chuốt bóng */}
                <line x1="20" y1="30" x2="20" y2="48" stroke="#5C4530" strokeWidth="2.8" strokeLinecap="round" />
              </g>
            ) : handheldItem.id === 'hand_chuoi_ngoc' ? (
              // Chuỗi hạt đeo cổ thanh nhã buông tự nhiên
              <g>
                <path
                  d="M280 225 Q300 295 320 225"
                  stroke="#EDEAE4"
                  strokeWidth="3.8"
                  strokeDasharray="1 5.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : (
              // Túi gấm thêu tay miệng rút treo nơi tay cầm
              <g transform="translate(372, 418)">
                <rect x="-12" y="10" width="24" height="28" rx="6" fill={palette.accent} />
                <path d="M-12 10 Q0 5 12 10" stroke="#D4AF37" strokeWidth="1.5" />
                {/* Dây rút miệng túi */}
                <line x1="0" y1="0" x2="0" y2="10" stroke="#D4AF37" strokeWidth="2" />
                {/* Tua chỉ vàng son */}
                <line x1="0" y1="38" x2="0" y2="50" stroke="#D4AF37" strokeWidth="2.2" strokeLinecap="round" />
              </g>
            )}
          </g>
        )}

        {/* ================= 10. ĐIỂM NEO KỸ THUẬT (Technical Rig Anchor Points) ================= */}
        {showAnchors && (
          <g id="technical_anchors">
            {Object.entries(anchors).map(([key, pt]) => (
              <g key={key} transform={`translate(${pt.x}, ${pt.y})`}>
                <circle r="4" fill="#A94D3C" />
                <circle r="8" fill="none" stroke="#A94D3C" strokeWidth="1" strokeDasharray="2 2" />
                <text
                  x="12"
                  y="4"
                  fill="#A94D3C"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  {key} ({pt.x},{pt.y})
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>

      {/* Semantic HTML Accessibility Text for Screen Readers */}
      <div className="sr-only">
        Hiện đang mặc: {topItem?.name || 'Áo truyền thống'}, {bottomItem?.name || 'Quần lụa'},
        bảng màu {palette.name} ({palette.description}).
        {sashItem && ` Kèm ${sashItem.name}.`}
        {headwearItem && ` Đội ${headwearItem.name}.`}
        {handheldItem && ` Cầm ${handheldItem.name}.`}
      </div>
    </div>
  );
};
