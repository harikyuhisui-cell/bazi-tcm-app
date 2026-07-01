/** タイトル周りに置く淡い葉っぱの装飾 */
export function TitleLeafDecoration() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
      <svg
        viewBox="0 0 220 220"
        className="absolute -left-10 -top-12 h-44 w-44 opacity-65 sm:h-56 sm:w-56"
      >
        <path d="M18 142 C58 102, 88 70, 156 18" fill="none" stroke="#d4b37a" strokeWidth="1.4" />
        <path d="M55 104 C40 86, 31 67, 28 45" fill="none" stroke="#d4b37a" strokeWidth="1" />
        <path d="M84 76 C71 57, 67 39, 70 17" fill="none" stroke="#d4b37a" strokeWidth="1" />
        {[
          [38, 58, -34],
          [52, 80, -16],
          [69, 54, 24],
          [84, 34, -28],
          [111, 48, 18],
          [132, 29, -16],
        ].map(([cx, cy, rotate]) => (
          <ellipse
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            rx="9"
            ry="18"
            fill="#d9969f"
            opacity="0.52"
            transform={`rotate(${rotate} ${cx} ${cy})`}
          />
        ))}
        <circle cx="32" cy="98" r="4" fill="#c59a52" opacity="0.55" />
        <circle cx="100" cy="58" r="3.5" fill="#c59a52" opacity="0.45" />
      </svg>

      <svg
        viewBox="0 0 220 220"
        className="absolute -right-8 -top-10 h-48 w-48 opacity-75 sm:h-64 sm:w-64"
      >
        <path d="M198 28 C150 52, 116 86, 70 164" fill="none" stroke="#d4b37a" strokeWidth="1.4" />
        <path d="M162 50 C146 42, 135 31, 128 16" fill="none" stroke="#d4b37a" strokeWidth="1" />
        <path d="M125 82 C103 72, 90 58, 82 37" fill="none" stroke="#d4b37a" strokeWidth="1" />
        <path d="M96 120 C77 111, 63 99, 51 77" fill="none" stroke="#d4b37a" strokeWidth="1" />
        {[
          [177, 45, 54],
          [156, 69, 34],
          [131, 70, -42],
          [113, 100, 38],
          [87, 122, -34],
          [72, 151, 28],
        ].map(([cx, cy, rotate]) => (
          <ellipse
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            rx="10"
            ry="20"
            fill="#84976d"
            opacity="0.55"
            transform={`rotate(${rotate} ${cx} ${cy})`}
          />
        ))}
        <circle cx="188" cy="74" r="5" fill="#9aaa82" opacity="0.5" />
        <circle cx="64" cy="133" r="4" fill="#d9969f" opacity="0.45" />
      </svg>

      <svg viewBox="0 0 260 90" className="absolute bottom-1 left-1/2 h-16 w-72 -translate-x-1/2 opacity-45">
        <path d="M20 58 C88 15, 176 16, 240 54" fill="none" stroke="#d4b37a" strokeWidth="1" />
        <path d="M122 43 C130 30, 139 22, 151 16" fill="none" stroke="#d4b37a" strokeWidth="0.9" />
        <ellipse cx="113" cy="41" rx="6" ry="13" fill="#d9969f" opacity="0.45" transform="rotate(-34 113 41)" />
        <ellipse cx="146" cy="29" rx="6" ry="13" fill="#84976d" opacity="0.45" transform="rotate(42 146 29)" />
      </svg>
    </div>
  )
}
