import React from 'react';
import { Appearance, ClassType, RaceType } from '../types/character';

interface CharacterAvatarProps {
  race: RaceType;
  classNameType: ClassType;
  appearance: Appearance;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDetails?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  race,
  classNameType,
  appearance,
  size = 'lg',
  showDetails = false,
}) => {
  const {
    skinTone,
    hairColor,
    hairStyle,
    eyeColor,
    build,
    distinguishingFeature,
  } = appearance;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-44 h-44 md:w-52 md:h-52',
    xl: 'w-64 h-64 md:w-72 md:h-72',
  };

  // Shoulder width by build
  const shoulderWidth =
    build === 'Muscular' || build === 'Towering'
      ? 220
      : build === 'Stocky'
      ? 210
      : build === 'Slender' || build === 'Compact'
      ? 165
      : 185;

  // Ear style
  const isPointyEar = race === 'Elf' || race === 'Gnome' || race === 'Tiefling';
  const hasHorns = race === 'Tiefling' || race === 'Dragonborn';
  const hasTusks = race === 'Orc';
  const isDwarf = race === 'Dwarf';

  return (
    <div className="flex flex-col items-center">
      <div
        id="character-avatar-frame"
        className={`${sizeClasses[size]} relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-900/40 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-950 flex items-center justify-center`}
      >
        {/* Subtle background ambient halo */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 35%, ${eyeColor} 0%, transparent 70%)`,
          }}
        />

        <svg
          viewBox="0 0 240 240"
          className="w-full h-full object-contain"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skin gradient */}
            <linearGradient id={`skinGrad-${race}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={skinTone} stopOpacity="1" />
              <stop offset="100%" stopColor={skinTone} stopOpacity="0.85" />
            </linearGradient>

            {/* Armor gradient */}
            <linearGradient id="armorSteel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#78716c" />
              <stop offset="50%" stopColor="#44403c" />
              <stop offset="100%" stopColor="#292524" />
            </linearGradient>

            <linearGradient id="armorGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <linearGradient id="clothMage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4338ca" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>

            <linearGradient id="leatherRogue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#573824" />
              <stop offset="100%" stopColor="#2c1a0e" />
            </linearGradient>
          </defs>

          {/* BACKGROUND SHADOW */}
          <ellipse cx="120" cy="220" rx="90" ry="16" fill="#000000" opacity="0.4" />

          {/* BACK HAIR (For long styles) */}
          {(hairStyle === 'Long Braids' || hairStyle === 'Flowing Waves' || hairStyle === 'Wild Mane') && (
            <path
              d={
                hairStyle === 'Wild Mane'
                  ? 'M 50 80 Q 30 150 45 220 L 195 220 Q 210 150 190 80 Z'
                  : 'M 60 90 Q 45 160 55 230 L 185 230 Q 195 160 180 90 Z'
              }
              fill={hairColor}
              stroke="#1c1917"
              strokeWidth="2"
            />
          )}

          {/* TIEFLING / DRAGONBORN HORNS (BACK LAYER) */}
          {hasHorns && (
            <g id="avatar-horns">
              {race === 'Tiefling' ? (
                <>
                  {/* Left curved horn */}
                  <path
                    d="M 85 70 C 65 30 50 15 30 20 C 35 38 60 55 80 82 Z"
                    fill="#3f3f46"
                    stroke="#18181b"
                    strokeWidth="2"
                  />
                  {/* Right curved horn */}
                  <path
                    d="M 155 70 C 175 30 190 15 210 20 C 205 38 180 55 160 82 Z"
                    fill="#3f3f46"
                    stroke="#18181b"
                    strokeWidth="2"
                  />
                </>
              ) : (
                <>
                  {/* Dragonborn crest spikes */}
                  <path d="M 80 65 L 60 35 L 90 60 Z" fill="#78350f" stroke="#292524" strokeWidth="1.5" />
                  <path d="M 120 50 L 120 15 L 126 50 Z" fill="#78350f" stroke="#292524" strokeWidth="1.5" />
                  <path d="M 160 65 L 180 35 L 150 60 Z" fill="#78350f" stroke="#292524" strokeWidth="1.5" />
                </>
              )}
            </g>
          )}

          {/* TORSO / BODY / CLOTHING */}
          <g id="avatar-body">
            {/* Shoulders base */}
            <path
              d={`M ${120 - shoulderWidth / 2} 240 Q 120 165 ${120 + shoulderWidth / 2} 240 Z`}
              fill={
                classNameType === 'Warrior' || classNameType === 'Paladin'
                  ? 'url(#armorSteel)'
                  : classNameType === 'Mage'
                  ? 'url(#clothMage)'
                  : classNameType === 'Rogue'
                  ? 'url(#leatherRogue)'
                  : classNameType === 'Barbarian'
                  ? '#442211'
                  : classNameType === 'Cleric'
                  ? '#1e293b'
                  : '#2d3748'
              }
              stroke="#0c0a09"
              strokeWidth="2"
            />

            {/* Class specific armor accents */}
            {(classNameType === 'Warrior' || classNameType === 'Paladin') && (
              <g>
                {/* Gorget collar */}
                <path d="M 90 180 Q 120 205 150 180 L 158 240 L 82 240 Z" fill="#57534e" stroke="#1c1917" strokeWidth="1.5" />
                {classNameType === 'Paladin' ? (
                  /* Holy golden sun crest */
                  <circle cx="120" cy="210" r="10" fill="url(#armorGold)" stroke="#78350f" strokeWidth="1.5" />
                ) : (
                  /* Steel plate rivets */
                  <>
                    <circle cx="100" cy="205" r="2.5" fill="#a8a29e" />
                    <circle cx="140" cy="205" r="2.5" fill="#a8a29e" />
                  </>
                )}
              </g>
            )}

            {classNameType === 'Mage' && (
              <g>
                {/* Mystical collar trim */}
                <path d="M 95 180 Q 120 200 145 180 L 140 240 L 100 240 Z" fill="#312e81" stroke="#4338ca" strokeWidth="1.5" />
                <circle cx="120" cy="205" r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="1" />
              </g>
            )}

            {classNameType === 'Rogue' && (
              <g>
                {/* Leather strap & buckle */}
                <line x1="85" y1="180" x2="155" y2="240" stroke="#78350f" strokeWidth="6" />
                <rect x="115" y="205" width="10" height="10" fill="#d97706" rx="2" />
              </g>
            )}

            {classNameType === 'Barbarian' && (
              <g>
                {/* Bone/fur pelt lining */}
                <path d="M 85 180 C 100 200 105 225 90 240 L 150 240 C 135 225 140 200 155 180 Z" fill="#e7e5e4" stroke="#78716c" strokeWidth="1.5" />
                {/* Fang necklace */}
                <path d="M 105 190 L 110 205 L 115 190" fill="#ffffff" stroke="#292524" />
                <path d="M 125 190 L 130 205 L 135 190" fill="#ffffff" stroke="#292524" />
              </g>
            )}

            {classNameType === 'Cleric' && (
              <g>
                {/* Holy symbol pendant */}
                <path d="M 110 185 L 120 210 L 130 185" stroke="#f59e0b" strokeWidth="2" fill="none" />
                <circle cx="120" cy="216" r="6" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
              </g>
            )}

            {classNameType === 'Ranger' && (
              <g>
                {/* Leaf mantle clasp */}
                <path d="M 90 190 Q 120 215 150 190" stroke="#15803d" strokeWidth="5" fill="none" />
                <circle cx="120" cy="206" r="4" fill="#22c55e" />
              </g>
            )}

            {classNameType === 'Bard' && (
              <g>
                {/* Silk collar and golden lute cord */}
                <path d="M 95 185 Q 120 210 145 185" stroke="#d97706" strokeWidth="3" fill="none" />
                <path d="M 120 200 L 120 230" stroke="#ec4899" strokeWidth="3" />
              </g>
            )}
          </g>

          {/* NECK */}
          <rect
            x={build === 'Muscular' || build === 'Stocky' ? 104 : 108}
            y="140"
            width={build === 'Muscular' || build === 'Stocky' ? 32 : 24}
            height="32"
            fill={`url(#skinGrad-${race})`}
            stroke="#1c1917"
            strokeWidth="1.5"
            rx="4"
          />

          {/* EARS */}
          <g id="avatar-ears">
            {isPointyEar ? (
              <>
                {/* Left Elven Ear */}
                <path
                  d="M 76 100 C 50 85 45 70 52 60 C 65 65 72 80 76 95 Z"
                  fill={skinTone}
                  stroke="#1c1917"
                  strokeWidth="1.5"
                />
                {/* Right Elven Ear */}
                <path
                  d="M 164 100 C 190 85 195 70 188 60 C 175 65 168 80 164 95 Z"
                  fill={skinTone}
                  stroke="#1c1917"
                  strokeWidth="1.5"
                />
              </>
            ) : (
              <>
                {/* Human/Dwarf/Standard round ears */}
                <ellipse cx="74" cy="108" rx="7" ry="12" fill={skinTone} stroke="#1c1917" strokeWidth="1.5" />
                <ellipse cx="166" cy="108" rx="7" ry="12" fill={skinTone} stroke="#1c1917" strokeWidth="1.5" />
              </>
            )}
          </g>

          {/* HEAD & JAW */}
          <g id="avatar-head">
            {race === 'Orc' ? (
              /* Broad rugged Orc head */
              <path
                d="M 75 90 C 75 50 165 50 165 90 C 165 125 155 155 120 155 C 85 155 75 125 75 90 Z"
                fill={`url(#skinGrad-${race})`}
                stroke="#1c1917"
                strokeWidth="2"
              />
            ) : isDwarf ? (
              /* Wide square Dwarf head */
              <path
                d="M 76 90 C 76 55 164 55 164 90 C 164 130 155 154 120 154 C 85 154 76 130 76 90 Z"
                fill={`url(#skinGrad-${race})`}
                stroke="#1c1917"
                strokeWidth="2"
              />
            ) : (
              /* Oval human/elf/general head */
              <path
                d="M 78 95 C 78 55 162 55 162 95 C 162 135 150 155 120 155 C 90 155 78 135 78 95 Z"
                fill={`url(#skinGrad-${race})`}
                stroke="#1c1917"
                strokeWidth="2"
              />
            )}

            {/* EYEBROWS */}
            <path
              d={race === 'Orc' ? 'M 90 92 L 112 96' : 'M 90 94 Q 102 90 112 94'}
              stroke={hairColor}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d={race === 'Orc' ? 'M 150 92 L 128 96' : 'M 150 94 Q 138 90 128 94'}
              stroke={hairColor}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* EYES */}
            {/* Left Eye */}
            <g id="avatar-left-eye">
              <ellipse cx="102" cy="104" rx="7" ry="4.5" fill="#ffffff" stroke="#1c1917" strokeWidth="1" />
              <circle cx="102" cy="104" r="3.2" fill={eyeColor} />
              <circle cx="103" cy="103" r="1" fill="#ffffff" />
            </g>

            {/* Right Eye */}
            <g id="avatar-right-eye">
              <ellipse cx="138" cy="104" rx="7" ry="4.5" fill="#ffffff" stroke="#1c1917" strokeWidth="1" />
              <circle cx="138" cy="104" r="3.2" fill={eyeColor} />
              <circle cx="139" cy="103" r="1" fill="#ffffff" />
            </g>

            {/* NOSE */}
            <path
              d={race === 'Orc' ? 'M 116 114 L 120 120 L 124 114' : 'M 119 108 L 117 122 L 123 122'}
              stroke="#1c1917"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />

            {/* MOUTH & TEETH / TUSKS */}
            {hasTusks ? (
              <g id="avatar-tusks">
                {/* Orc mouth slit */}
                <path d="M 106 136 Q 120 140 134 136" stroke="#1c1917" strokeWidth="2" fill="none" />
                {/* Bottom upward tusks */}
                <path d="M 108 140 L 110 130 L 113 140 Z" fill="#fef3c7" stroke="#1c1917" strokeWidth="1" />
                <path d="M 127 140 L 130 130 L 132 140 Z" fill="#fef3c7" stroke="#1c1917" strokeWidth="1" />
              </g>
            ) : (
              /* Standard mouth */
              <path
                d="M 110 135 Q 120 139 130 135"
                stroke="#451a03"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* DISTINGUISHING FEATURES */}
            {distinguishingFeature.includes('scar') && (
              <path d="M 98 86 L 105 116" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            )}
            {distinguishingFeature.includes('tattoo') && (
              <path d="M 82 100 Q 86 112 90 118" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="2,2" />
            )}
            {distinguishingFeature.includes('brand') && (
              <circle cx="120" cy="78" r="4" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.85" />
            )}
          </g>

          {/* DWARF BEARD OR MASCULINE BEARDS */}
          {isDwarf && (
            <g id="avatar-dwarf-beard">
              <path
                d="M 80 120 C 70 170 85 210 120 215 C 155 210 170 170 160 120 C 150 135 135 145 120 145 C 105 145 90 135 80 120 Z"
                fill={hairColor}
                stroke="#1c1917"
                strokeWidth="2"
              />
              {/* Silver clasps in beard braids */}
              <circle cx="110" cy="180" r="3" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
              <circle cx="130" cy="180" r="3" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
            </g>
          )}

          {/* FRONT HAIR STYLES */}
          {hairStyle !== 'Shaved' && (
            <g id="avatar-front-hair">
              {hairStyle === 'Short Crop' && (
                <path
                  d="M 75 85 C 74 45 166 45 165 85 C 150 68 135 68 120 70 C 105 68 90 68 75 85 Z"
                  fill={hairColor}
                  stroke="#1c1917"
                  strokeWidth="2"
                />
              )}

              {hairStyle === 'Spiky' && (
                <path
                  d="M 74 88 L 78 50 L 95 62 L 105 40 L 120 60 L 135 38 L 145 62 L 162 50 L 166 88 C 150 70 135 70 120 72 C 105 70 90 70 74 88 Z"
                  fill={hairColor}
                  stroke="#1c1917"
                  strokeWidth="2"
                />
              )}

              {hairStyle === 'Topknot' && (
                <>
                  <path
                    d="M 75 85 C 75 52 165 52 165 85 C 150 70 135 72 120 74 C 105 72 90 70 75 85 Z"
                    fill={hairColor}
                    stroke="#1c1917"
                    strokeWidth="2"
                  />
                  {/* Topknot bun */}
                  <circle cx="120" cy="40" r="14" fill={hairColor} stroke="#1c1917" strokeWidth="2" />
                  <rect x="115" y="44" width="10" height="4" fill="#f59e0b" rx="1" />
                </>
              )}

              {hairStyle === 'Long Braids' && (
                <>
                  <path
                    d="M 75 85 C 75 50 165 50 165 85 C 150 68 135 70 120 72 C 105 70 90 68 75 85 Z"
                    fill={hairColor}
                    stroke="#1c1917"
                    strokeWidth="2"
                  />
                  {/* Left braid */}
                  <path d="M 74 95 Q 65 140 70 185" stroke={hairColor} strokeWidth="7" strokeLinecap="round" />
                  {/* Right braid */}
                  <path d="M 166 95 Q 175 140 170 185" stroke={hairColor} strokeWidth="7" strokeLinecap="round" />
                </>
              )}

              {hairStyle === 'Flowing Waves' && (
                <path
                  d="M 75 90 C 72 45 168 45 165 90 C 155 70 140 75 120 75 C 100 75 85 70 75 90 Z"
                  fill={hairColor}
                  stroke="#1c1917"
                  strokeWidth="2"
                />
              )}

              {hairStyle === 'Wild Mane' && (
                <path
                  d="M 68 95 C 65 40 85 30 120 30 C 155 30 175 40 172 95 C 160 70 145 74 120 74 C 95 74 80 70 68 95 Z"
                  fill={hairColor}
                  stroke="#1c1917"
                  strokeWidth="2"
                />
              )}

              {hairStyle === 'Dreadlocks' && (
                <>
                  <path
                    d="M 75 85 C 75 50 165 50 165 85 C 150 68 135 70 120 72 C 105 70 90 68 75 85 Z"
                    fill={hairColor}
                    stroke="#1c1917"
                    strokeWidth="2"
                  />
                  {/* Multiple cords */}
                  <line x1="78" y1="85" x2="68" y2="160" stroke={hairColor} strokeWidth="4" strokeLinecap="round" />
                  <line x1="88" y1="80" x2="80" y2="175" stroke={hairColor} strokeWidth="4" strokeLinecap="round" />
                  <line x1="152" y1="80" x2="160" y2="175" stroke={hairColor} strokeWidth="4" strokeLinecap="round" />
                  <line x1="162" y1="85" x2="172" y2="160" stroke={hairColor} strokeWidth="4" strokeLinecap="round" />
                </>
              )}
            </g>
          )}
        </svg>

        {/* Level badge overlay */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-stone-900/80 border border-amber-600/40 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider backdrop-blur-xs">
          Lv 1
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 text-center">
          <div className="text-xs text-amber-200/70 font-mono">
            {appearance.hairStyle} • {appearance.hairColorName}
          </div>
          <div className="text-xs text-stone-400 font-mono">
            {appearance.build} physique • {appearance.eyeColorName} eyes
          </div>
        </div>
      )}
    </div>
  );
};
