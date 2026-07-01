function SakuraFlower({
  x,
  y,
  size = 1,
  rotate = 0,
  opacity = 0.7,
}: {
  x: number
  y: number
  size?: number
  rotate?: number
  opacity?: number
}) {
  const petals = [0, 72, 144, 216, 288]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size})`} opacity={opacity}>
      {petals.map((angle) => (
        <path
          key={angle}
          d="M0 -3 C11 -25 34 -19 24 2 C17 18 3 17 0 4 C-3 17 -17 18 -24 2 C-34 -19 -11 -25 0 -3Z"
          fill="#f2b7c5"
          stroke="#e4a0af"
          strokeWidth="1"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="4.5" fill="#d8a34f" opacity="0.75" />
      <circle cx="0" cy="0" r="2" fill="#fff5d8" opacity="0.9" />
    </g>
  )
}

function FallingPetal({
  x,
  y,
  rotate,
  opacity,
}: {
  x: number
  y: number
  rotate: number
  opacity: number
}) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx="6"
      ry="14"
      fill="#f4bdca"
      opacity={opacity}
      transform={`rotate(${rotate} ${x} ${y})`}
    />
  )
}

/** タイトル周りに置く淡い桜の装飾 */
export function TitleSakuraDecoration() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
      <svg
        viewBox="0 0 260 220"
        className="absolute -left-10 -top-10 h-48 w-56 opacity-80 sm:h-60 sm:w-72"
      >
        <path
          d="M0 86 C55 78, 86 50, 121 11"
          fill="none"
          stroke="#caa76e"
          strokeLinecap="round"
          strokeWidth="1.2"
        />
        <path
          d="M34 80 C57 98, 79 105, 111 104"
          fill="none"
          stroke="#caa76e"
          strokeLinecap="round"
          strokeWidth="0.9"
        />
        <path
          d="M66 61 C81 39, 94 28, 118 22"
          fill="none"
          stroke="#caa76e"
          strokeLinecap="round"
          strokeWidth="0.9"
        />
        <SakuraFlower x={45} y={77} size={0.34} rotate={-12} opacity={0.72} />
        <SakuraFlower x={86} y={51} size={0.28} rotate={20} opacity={0.62} />
        <SakuraFlower x={112} y={25} size={0.22} rotate={-18} opacity={0.55} />
        <FallingPetal x={22} y={36} rotate={-34} opacity={0.42} />
        <FallingPetal x={135} y={78} rotate={24} opacity={0.38} />
        <FallingPetal x={74} y={122} rotate={-12} opacity={0.35} />
      </svg>

      <svg
        viewBox="0 0 280 240"
        className="absolute -right-10 -top-8 h-52 w-60 opacity-80 sm:h-64 sm:w-72"
      >
        <path
          d="M280 54 C225 65, 184 83, 138 132 C111 161, 81 177, 42 186"
          fill="none"
          stroke="#caa76e"
          strokeLinecap="round"
          strokeWidth="1.2"
        />
        <path
          d="M221 70 C206 47, 189 32, 159 20"
          fill="none"
          stroke="#caa76e"
          strokeLinecap="round"
          strokeWidth="0.9"
        />
        <path
          d="M156 115 C137 92, 117 80, 88 74"
          fill="none"
          stroke="#caa76e"
          strokeLinecap="round"
          strokeWidth="0.9"
        />
        <SakuraFlower x={221} y={70} size={0.32} rotate={18} opacity={0.72} />
        <SakuraFlower x={166} y={112} size={0.27} rotate={-20} opacity={0.64} />
        <SakuraFlower x={78} y={178} size={0.22} rotate={14} opacity={0.5} />
        <FallingPetal x={236} y={118} rotate={42} opacity={0.42} />
        <FallingPetal x={128} y={50} rotate={-24} opacity={0.36} />
        <FallingPetal x={48} y={128} rotate={18} opacity={0.34} />
      </svg>

      <svg
        viewBox="0 0 340 110"
        className="absolute bottom-0 left-1/2 h-20 w-80 -translate-x-1/2 opacity-50"
      >
        <path
          d="M24 70 C92 24, 216 22, 314 68"
          fill="none"
          stroke="#d7b987"
          strokeLinecap="round"
          strokeWidth="1"
        />
        <SakuraFlower x={136} y={45} size={0.18} rotate={12} opacity={0.48} />
        <SakuraFlower x={200} y={42} size={0.16} rotate={-18} opacity={0.42} />
        <FallingPetal x={108} y={58} rotate={-42} opacity={0.34} />
        <FallingPetal x={230} y={60} rotate={36} opacity={0.32} />
      </svg>
    </div>
  )
}
