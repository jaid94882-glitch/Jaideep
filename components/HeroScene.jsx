export default function HeroScene() {
  return (
    <div className="relative mx-auto w-full max-w-md md:max-w-lg select-none" aria-hidden="true">
      <svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Room card */}
        <rect x="10" y="18" width="460" height="300" rx="24" fill="#ffffff" opacity="0.07" />
        {/* Window */}
        <rect x="40" y="44" width="90" height="66" rx="8" fill="#ffffff" opacity="0.12" />
        <line x1="85" y1="44" x2="85" y2="110" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="3" />
        <line x1="40" y1="77" x2="130" y2="77" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="3" />
        {/* Clinic sign */}
        <g className="anim-float">
          <rect x="352" y="40" width="92" height="34" rx="8" fill="#10B981" />
          <text x="398" y="63" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#fff">
            + CLINIC
          </text>
        </g>
        {/* Plant */}
        <ellipse cx="445" cy="300" rx="16" ry="6" fill="#0B8A61" opacity="0.5" />
        <path d="M445 300 q-10 -34 -22 -44 M445 300 q2 -38 14 -50 M445 300 q-2 -30 6 -40" stroke="#10B981" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* Desk */}
        <rect x="150" y="230" width="180" height="14" rx="7" fill="#ffffff" opacity="0.85" />
        <rect x="162" y="244" width="12" height="60" rx="4" fill="#ffffff" opacity="0.35" />
        <rect x="306" y="244" width="12" height="60" rx="4" fill="#ffffff" opacity="0.35" />
        {/* Papers on desk */}
        <g className="anim-float-slow">
          <rect x="215" y="212" width="50" height="16" rx="3" fill="#EFF3FE" transform="rotate(-4 240 220)" />
          <line x1="222" y1="219" x2="252" y2="217" stroke="#1E3A8A" strokeWidth="2" strokeOpacity="0.5" />
          <line x1="223" y1="224" x2="248" y2="222" stroke="#1E3A8A" strokeWidth="2" strokeOpacity="0.3" />
        </g>

        {/* ===== MR (left, sitting) ===== */}
        <g className="anim-lean">
          {/* chair */}
          <rect x="72" y="216" width="16" height="88" rx="6" fill="#ffffff" opacity="0.3" />
          <rect x="70" y="252" width="70" height="12" rx="6" fill="#ffffff" opacity="0.3" />
          {/* legs */}
          <path d="M120 252 q26 2 34 -14" stroke="#334155" strokeWidth="14" fill="none" strokeLinecap="round" />
          {/* body */}
          <path d="M104 190 q-14 34 6 62" stroke="#2563EB" strokeWidth="30" fill="none" strokeLinecap="round" />
          {/* arm holding tablet */}
          <path d="M112 205 q30 12 46 8" stroke="#2563EB" strokeWidth="12" fill="none" strokeLinecap="round" />
          {/* tablet */}
          <rect x="150" y="196" width="26" height="36" rx="4" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" transform="rotate(12 163 214)" />
          <rect x="156" y="203" width="14" height="8" rx="1" fill="#10B981" transform="rotate(12 163 207)" />
          {/* head */}
          <circle cx="112" cy="168" r="20" fill="#F5C6A0" />
          {/* hair */}
          <path d="M92 164 a20 20 0 0 1 40 -2 q-8 -12 -20 -12 t-20 14z" fill="#26303B" />
          {/* ID badge */}
          <rect x="96" y="204" width="14" height="18" rx="2" fill="#fff" />
          <rect x="98" y="207" width="10" height="4" rx="1" fill="#2563EB" />
        </g>

        {/* ===== Doctor (right, sitting) ===== */}
        <g className="anim-nod">
          {/* chair */}
          <rect x="392" y="216" width="16" height="88" rx="6" fill="#ffffff" opacity="0.3" />
          <rect x="340" y="252" width="70" height="12" rx="6" fill="#ffffff" opacity="0.3" />
          {/* legs */}
          <path d="M360 252 q-26 2 -34 -14" stroke="#1E3A8A" strokeWidth="14" fill="none" strokeLinecap="round" />
          {/* white coat body */}
          <path d="M376 190 q14 34 -6 62" stroke="#F8FAFC" strokeWidth="30" fill="none" strokeLinecap="round" />
          {/* arm gesturing */}
          <path d="M368 205 q-28 14 -44 10" stroke="#F8FAFC" strokeWidth="12" fill="none" strokeLinecap="round" className="anim-gesture" />
          {/* head */}
          <circle cx="368" cy="168" r="20" fill="#E8B48C" />
          {/* hair */}
          <path d="M348 166 a20 20 0 0 1 40 0 q-6 -14 -20 -14 t-20 14z" fill="#3D2B1F" />
          {/* stethoscope */}
          <path d="M360 196 q8 14 16 2" stroke="#1E3A8A" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="378" cy="200" r="5" fill="#1E3A8A" />
        </g>

        {/* ===== Speech bubbles (alternating) ===== */}
        <g className="anim-bubble-1">
          <rect x="60" y="96" width="150" height="44" rx="14" fill="#ffffff" />
          <path d="M100 140 l8 14 6 -14z" fill="#ffffff" />
          <text x="135" y="115" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1E3A8A">
            Business expansion?
          </text>
          <text x="135" y="132" textAnchor="middle" fontSize="12" fill="#475569">
            Easy clinic loans 📈
          </text>
        </g>
        <g className="anim-bubble-2">
          <rect x="278" y="96" width="142" height="44" rx="14" fill="#ECFDF5" />
          <path d="M372 140 l-8 14 -6 -14z" fill="#ECFDF5" />
          <text x="349" y="115" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0B8A61">
            Yes! New machines
          </text>
          <text x="349" y="132" textAnchor="middle" fontSize="12" fill="#475569">
            &amp; a bigger OPD 🏥
          </text>
        </g>

        {/* Floating icons */}
        <g className="anim-float">
          <circle cx="235" cy="66" r="16" fill="#10B981" />
          <text x="235" y="72" textAnchor="middle" fontSize="17" fontWeight="bold" fill="#fff">₹</text>
        </g>
        <g className="anim-float-slow">
          <rect x="196" y="150" width="20" height="20" rx="5" fill="#ffffff" opacity="0.9" />
          <path d="M206 154 v12 M200 160 h12" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className="anim-float-slower">
          <rect x="262" y="146" width="24" height="24" rx="5" fill="#ffffff" opacity="0.9" />
          <path d="M267 164 v-6 M274 164 v-11 M281 164 v-8" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
