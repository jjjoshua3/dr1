type Props = {
  className?: string;
};

/** Lijntekening van een altsax. pathLength 100, zodat de preloader één dashoffset kan tekenen. */
export function Saxophone({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 240 560" fill="none" aria-hidden="true">
      <path
        className="sax-fill"
        d="M50 468C22 458 4 482 14 518C26 560 70 578 108 562C132 552 138 524 122 504C96 528 66 516 50 468Z"
      />
      <path className="draw" pathLength={100} d="M152 78C150 50 170 32 196 36C214 40 220 56 210 68C200 80 176 76 164 84" />
      <path className="draw" pathLength={100} d="M186 72L208 54" />
      <path className="draw" pathLength={100} d="M158 82C148 112 156 140 150 176C148 198 140 212 144 232" />
      <path className="draw" pathLength={100} d="M174 88C184 118 182 150 174 188C170 210 178 222 172 242" />
      <path className="draw" pathLength={100} d="M144 232C140 300 136 360 128 420C122 460 106 494 82 520" />
      <path className="draw" pathLength={100} d="M172 242C176 310 170 370 158 430C148 474 126 508 98 534" />
      <path className="draw" pathLength={100} d="M82 520C52 548 18 542 12 512C6 484 24 464 50 468" />
      <path className="draw" pathLength={100} d="M98 534C62 572 16 562 8 524" />
      <path className="draw" pathLength={100} d="M50 468C22 458 4 482 14 518C26 560 70 578 108 562C132 552 138 524 122 504" />
      <path className="draw" pathLength={100} d="M64 486C46 480 36 500 46 524C58 548 88 554 102 536" />
      <path className="draw" pathLength={100} d="M166 128C182 122 190 136 176 144" />
      <circle className="draw" cx="186" cy="130" r="4" pathLength={100} />
      <circle className="draw" cx="156" cy="268" r="10" pathLength={100} />
      <circle className="draw" cx="156" cy="308" r="10" pathLength={100} />
      <circle className="draw" cx="152" cy="348" r="11" pathLength={100} />
      <circle className="draw" cx="148" cy="390" r="11" pathLength={100} />
      <circle className="draw" cx="142" cy="430" r="10" pathLength={100} />
      <circle className="draw" cx="186" cy="330" r="5" pathLength={100} />
      <circle className="draw" cx="184" cy="370" r="5" pathLength={100} />
      <path className="draw" pathLength={100} d="M174 250L188 268" />
      <path className="draw" pathLength={100} d="M176 322C196 326 198 348 180 352" />
    </svg>
  );
}
