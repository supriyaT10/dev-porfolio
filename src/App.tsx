import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Asset URLs                                                          */
/* ------------------------------------------------------------------ */
const LEFT_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4";
const RIGHT_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4";

const IMAGES = [
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104530_521b2f85-c0f3-4d0e-9704-b578315b4cb9.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103711_76ccdb8b-5043-4f47-9c54-4379713393ea.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103728_394f6a1b-85e2-4386-a4f6-408472a0a5b7.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103739_86743e0e-16a7-4bee-bf38-dd67985344dc.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103748_b2215dc8-a3a7-470d-b19a-5b87fa7d0c37.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103758_e919ce72-5c9d-4b87-9be6-d7647b34825c.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103808_013583d0-3386-4547-9832-37c7d8edb3ac.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103937_a0c49d0a-33eb-4ead-aea6-c1baf241acbc.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103956_d18ed8fd-7b6f-4b86-91f9-20010fe38670.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104034_ba5a9963-87ff-4008-a545-6bd686c088b5.png&w=1920&q=85",
];

const SYMBOLS = ["8", "$", "^^", "%", "/"];
const EASE = [0.25, 0.1, 0.25, 1] as const;

/* ------------------------------------------------------------------ */
/* Layout algorithm                                                    */
/* ------------------------------------------------------------------ */
function buildLayout(count: number, cols: number): number[][] {
  const rows: number[][] = [];
  let placed = 0;
  let r = 0;
  while (placed < count) {
    const row = new Array(cols).fill(-1);
    const a = (r * 2 + (r % 2)) % cols;
    if (placed < count) {
      row[a] = placed;
      placed++;
    }
    if (r % 3 === 0 && placed < count) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      row[b] = placed;
      placed++;
    }
    rows.push(row);
    r++;
  }
  return rows;
}

const bucketOf = (w: number): "mobile" | "tablet" | "desktop" =>
  w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";
const colsOf = (b: string) => (b === "desktop" ? 4 : b === "tablet" ? 3 : 2);

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const F = "Inter Tight, sans-serif";

/* ------------------------------------------------------------------ */
/* Decorative inline assets                                            */
/* ------------------------------------------------------------------ */
function LogoMark({ style }: { style?: CSSProperties }) {
  return (
    <svg
      style={style}
      viewBox="0 0 355 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <text
        x="178"
        y="52"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily={F}
        fontWeight="500"
        fontSize="38"
        letterSpacing="-0.02em"
      >
        Suppu
      </text>
      <text
        x="178"
        y="84"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily={F}
        fontWeight="500"
        fontSize="26"
        letterSpacing="0.26em"
      >
        Babby
      </text>
      <g opacity="0.95">
        <circle cx="327" cy="28" r="9" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
        <text
          x="327"
          y="33"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily={F}
          fontWeight="500"
          fontSize="11"
        >
          R
        </text>
      </g>
    </svg>
  );
}

function CursorGlyph() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="24"
        cy="24"
        r="22.75"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        fill="none"
      />
      <g stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.95">
        <path d="M18 15 L18 25" />
        <path d="M30 15 L30 25" />
        <path d="M15 30 Q18 24 21 30" transform="translate(0,-4)" />
      </g>
      <circle cx="18" cy="18" r="2.2" fill="#FFFFFF" />
      <circle cx="30" cy="18" r="2.2" fill="#FFFFFF" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */
export default function App() {
  const [bp, setBp] = useState<"mobile" | "tablet" | "desktop">(() =>
    bucketOf(typeof window !== "undefined" ? window.innerWidth : 1200)
  );
  const [reflow, setReflow] = useState(0);
  const [cursorOn, setCursorOn] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const cols = colsOf(bp);

  /* refs ----------------------------------------------------------- */
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const leftV = useRef<HTMLVideoElement>(null);
  const rightV = useRef<HTMLVideoElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLSpanElement>(null);

  const cellsRef = useRef<{ el: HTMLElement; card: HTMLElement }[]>([]);
  const activeSide = useRef<"left" | "right">("right");
  const modeRef = useRef<"scrub" | "auto">("auto");
  const wRef = useRef(typeof window !== "undefined" ? window.innerWidth : 1200);
  const hRef = useRef(typeof window !== "undefined" ? window.innerHeight : 800);
  const maxScroll = useRef(0);
  const rafId = useRef(0);
  const loaded = useRef({ l: false, r: false });
  const cursorHidden = useRef(true);

  /* drag-to-rotate state (replaces continuous cursor-tracking scrub) */
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragCleanup = useRef<(() => void) | null>(null);

  /* build grid cells ------------------------------------------------ */
  const gridRows = useMemo(() => buildLayout(IMAGES.length, cols), [cols]);

  /* ---------------------------------------------------------------- */
  /* Mode / pointer state                                             */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const isFine =
      window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    modeRef.current = isFine ? "scrub" : "auto";
    setCursorOn(isFine);

    const onResize = () => {
      wRef.current = window.innerWidth;
      hRef.current = window.innerHeight;
      const fine =
        window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
      modeRef.current = fine ? "scrub" : "auto";
      setCursorOn(fine);
      const nb = bucketOf(window.innerWidth);
      setBp((prev) => (prev === nb ? prev : nb));
      setReflow((n) => n + 1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Custom cursor dot — purely cosmetic, unrelated to video scrubbing,
     left exactly as-is. */
  useEffect(() => {
    if (!cursorOn) return;
    const onMove = (e: MouseEvent) => {
      const el = cursorRef.current;
      if (!el) return;
      if (cursorHidden.current) {
        cursorHidden.current = false;
        el.style.display = "block";
      }
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    const onLeave = () => {
      const el = cursorRef.current;
      if (el) {
        cursorHidden.current = true;
        el.style.display = "none";
      }
    };
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [cursorOn]);

  /* ---------------------------------------------------------------- */
  /* Video loaded fade                                                 */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const check = () => {
      if (loaded.current.l && loaded.current.r) setVideoReady(true);
    };
    const markL = () => {
      loaded.current.l = true;
      check();
    };
    const markR = () => {
      loaded.current.r = true;
      check();
    };
    const vL = leftV.current;
    const vR = rightV.current;
    if (vL) vL.addEventListener("loadeddata", markL);
    if (vR) vR.addEventListener("loadeddata", markR);
    const fallback = window.setTimeout(() => {
      loaded.current.l = true;
      loaded.current.r = true;
      setVideoReady(true);
    }, 6000);
    return () => {
      window.clearTimeout(fallback);
      if (vL) vL.removeEventListener("loadeddata", markL);
      if (vR) vR.removeEventListener("loadeddata", markR);
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /* Layout: measure + panel slide (GSAP)                              */
  /* ---------------------------------------------------------------- */
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      const wrap = wrapRef.current;
      const grid = gridRef.current;
      const container = containerRef.current;
      const panel = panelRef.current;
      if (!wrap || !grid || !container || !panel) return;

      // collect cells
      cellsRef.current = [];
      const nodes = Array.from(grid.querySelectorAll<HTMLElement>(".bp-cell"));
      nodes.forEach((el) => {
        const card = el.querySelector<HTMLElement>(".bp-card");
        const col = Number(el.dataset.col || 0);
        if (card) {
          card.style.transformOrigin =
            col < colsOf(bp) / 2 ? "right bottom" : "left bottom";
          cellsRef.current.push({ el, card });
        }
      });

      const vh = window.innerHeight;
      const wrapH = wrap.scrollHeight || 0;
      const ms = Math.max(0, wrapH - vh);
      maxScroll.current = ms;
      container.style.height = `${vh + ms + 2 * vh}px`;

      // GSAP: panel slides up over the first viewport-height of scroll
      ScrollTrigger.getAll().forEach((st) => st.kill());
      const proxy = gsap.fromTo(
        panel,
        { y: vh },
        {
          y: 0,
          ease: "none",
          immediateRender: true,
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => vh,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
      ScrollTrigger.refresh();
      return () => {
        proxy.scrollTrigger?.kill();
        proxy.kill();
      };
    });
    return () => cancelAnimationFrame(id);
  }, [cols, bp, reflow]);

  /* ---------------------------------------------------------------- */
  /* Auto mode (touch / coarse pointer): alternate videos on their own */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const startAuto = () => {
      const l = leftV.current;
      const r = rightV.current;
      if (!l || !r) return;
      let cur: "left" | "right" = "left";
      const show = () => {
        l.style.display = cur === "left" ? "block" : "none";
        r.style.display = cur === "right" ? "block" : "none";
        activeSide.current = cur;
      };
      const playLeft = () => {
        cur = "left";
        show();
        r.pause();
        r.currentTime = 0;
        l.currentTime = 0;
        l.play().catch(() => undefined);
      };
      const playRight = () => {
        cur = "right";
        show();
        l.pause();
        l.currentTime = 0;
        r.currentTime = 0;
        r.play().catch(() => undefined);
      };
      const onLEnded = () => playRight();
      const onREnded = () => playLeft();
      l.addEventListener("ended", onLEnded);
      r.addEventListener("ended", onREnded);
      if (reduced) {
        // respect reduced motion: park at first frame
        l.currentTime = 0;
        r.currentTime = 0;
        show();
      } else {
        l.muted = true;
        r.muted = true;
        l.currentTime = 0;
        l.play().catch(() => undefined);
        show();
      }
      autoCleanup.current = () => {
        l.removeEventListener("ended", onLEnded);
        r.removeEventListener("ended", onREnded);
      };
    };

    const autoCleanup: { current: (() => void) | null } = { current: null };

    if (modeRef.current === "auto") startAuto();

    return () => {
      autoCleanup.current?.();
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /* Drag-to-rotate (desktop / fine pointer): replaces the old         */
  /* continuous mouse-position scrub. Nothing moves until the user     */
  /* actively presses and drags across the canvas; releasing resumes   */
  /* gentle playback of whichever side is active.                      */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const l = leftV.current;
    const r = rightV.current;
    if (!canvas || !l || !r) return;

    const applySide = (side: "left" | "right") => {
      l.style.display = side === "left" ? "block" : "none";
      r.style.display = side === "right" ? "block" : "none";
      activeSide.current = side;
    };

    const setTime = (v: HTMLVideoElement, t: number) => {
      if (!v.seeking && Number.isFinite(t) && v.duration) {
        v.currentTime = clamp(t, 0, v.duration);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (modeRef.current !== "scrub") return;
      l.pause();
      r.pause();
      dragging.current = true;
      dragStartX.current = e.clientX;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;

      const vw = window.innerWidth;
      const dx = e.clientX - dragStartX.current;
      const dragRange = Math.max(vw * 0.6, 120);
      const progress = clamp(Math.abs(dx) / dragRange, 0, 1);

      // dragging left reveals/scrubs the right-hand video,
      // dragging right reveals/scrubs the left-hand video —
      // mirrors the original left/right spatial mapping.
      const side: "left" | "right" = dx < 0 ? "right" : "left";
      if (side !== activeSide.current) applySide(side);

      const activeVideo = side === "left" ? l : r;
      setTime(activeVideo, progress * (activeVideo.duration || 0));
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      canvas.style.cursor = "grab";
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer capture may already be released */
      }
      const active = activeSide.current === "left" ? l : r;
      active.play().catch(() => undefined);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    dragCleanup.current = () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };

    return () => dragCleanup.current?.();
  }, []);

  /* ---------------------------------------------------------------- */
  /* Master RAF loop (scroll-driven phases — unrelated to the video    */
  /* interaction change above)                                        */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const tick = () => {
      const vh = window.innerHeight;
      const sy = window.scrollY || 0;
      const l = leftV.current;
      const r = rightV.current;

      // hide videos after first viewport
      if (l && r) {
        const hide = sy > vh;
        if (modeRef.current === "scrub") {
          l.style.visibility = hide ? "hidden" : "visible";
          r.style.visibility = hide ? "hidden" : "visible";
        }
      }

      // inner wrapper translation (phase 2)
      const ms = maxScroll.current;
      const wrap = wrapRef.current;
      if (wrap) {
        const tr = clamp(sy - vh, 0, ms);
        wrap.style.transform = `translate3d(0, ${-tr}px, 0)`;
      }

      // card scaling (from live rects)
      for (const c of cellsRef.current) {
        const rect = c.el.getBoundingClientRect();
        const top = rect.top;
        const bottom = rect.bottom;
        let scale = 0;
        if (bottom > 0 && top < vh) {
          const enter = Math.min(1, (vh - top) / (vh * 0.6));
          const exit = Math.min(1, bottom / (vh * 0.4));
          scale = Math.max(0, Math.min(enter, exit));
        }
        c.card.style.transform = `scale(${scale > 0 ? scale : 0})`;
      }

      // outro
      const p = clamp((sy - vh - ms) / Math.max(vh - 100, 1), 0, 1);
      if (overlayRef.current) overlayRef.current.style.opacity = String(p);
      if (infoRef.current) {
        const off = (wRef.current >= 1024 ? 166 : 132) * p;
        infoRef.current.style.transform = `translateY(${-off}px)`;
      }
      if (buyRef.current) buyRef.current.style.transform = `scale(${p})`;
      if (footerRef.current) footerRef.current.style.opacity = String(p);

      rafId.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /* Random symbol on scroll (throttled)                               */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const now = performance.now();
      if (now - last < 80) return;
      last = now;
      const el = circleRef.current;
      if (el) el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* responsive style helpers ---------------------------------------- */
  const m = bp === "mobile";
  const d = bp === "desktop";

  const overlayBase: CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 20,
    mixBlendMode: "exclusion",
    color: "#FFFFFF",
    fontFamily: F,
  };

  /* ---------------------------------------------------------------- */
  return (
    <div
      ref={containerRef}
      id="scroll-spacer"
      style={{
        position: "relative",
        userSelect: "none",
        background: "#ffffff",
        height: "500vh",
      }}
    >
      {/* Main video canvas — click-and-drag to rotate/scrub, replacing
          the old continuous cursor-tracking behavior */}
      <div
        ref={canvasRef}
        id="main-canvas"
        style={{
          position: "fixed",
          left: 0,
          ...(bp === "mobile"
            ? { top: 220, width: "100vw", height: "calc(100vh - 220px)" }
            : { top: 0, inset: 0, width: "100%", height: "100%" }),
          zIndex: 0,
          overflow: "hidden",
          opacity: videoReady ? 1 : 0,
          transition: "opacity 0.3s ease",
          cursor: bp === "desktop" ? "grab" : "default",
          touchAction: "none",
        }}
      >
        <video
          ref={leftV}
          src={LEFT_VIDEO}
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "none",
          }}
        />
        <video
          ref={rightV}
          src={RIGHT_VIDEO}
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* White overlay (outro) */}
      <div
        ref={overlayRef}
        id="outro-overlay"
        style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 12, pointerEvents: "none", opacity: 0 }}
      />

      {/* Black panel / gallery */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          zIndex: 10,
          overflow: "hidden",
          transform: "translateY(100vh)",
        }}
      >
        <div
          ref={wrapRef}
          style={{
            width: "100%",
            paddingTop: "min(400px, 40vh)",
            paddingLeft: m ? 16 : 48,
            paddingRight: m ? 16 : 48,
          }}
        >
          <div
            ref={gridRef}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: m ? 6 : 10,
              width: "100%",
            }}
          >
            {gridRows.map((row, r) =>
              row.map((cell, c) => {
                if (cell === -1) {
                  return (
                    <div key={`${r}-${c}`} style={{ aspectRatio: "2/3" }} />
                  );
                }
                return (
                  <div
                    key={`${r}-${c}`}
                    className="bp-cell"
                    data-col={c}
                    style={{ aspectRatio: "2/3", position: "relative", overflow: "hidden" }}
                  >
                    <div className="bp-card" style={{ width: "100%", height: "100%" }}>
                      <img
                        src={IMAGES[cell]}
                        alt=""
                        loading="lazy"
                        draggable={false}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Custom cursor */}
      {cursorOn && (
        <div
          ref={cursorRef}
          style={{
            position: "fixed",
            left: -100,
            top: -100,
            zIndex: 50,
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            mixBlendMode: "exclusion",
            display: "none",
          }}
        >
          <CursorGlyph />
        </div>
      )}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0 }}
        style={{
          ...overlayBase,
          top: d ? 32 : 16,
          left: d ? 32 : 16,
          width: m ? 124 : d ? 355 : 266,
        }}
      >
        <LogoMark style={{ width: "100%", height: "auto" }} />
      </motion.div>

      {/* Caption */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
        style={{
          ...overlayBase,
          top: d ? 244 : bp === "tablet" ? 180 : 118,
          left: d ? 32 : 16,
          width: d ? 692 : bp === "tablet" ? "calc(50vw - 48px)" : "calc(100vw - 32px)",
          fontSize: 12,
          lineHeight: "140%",
          letterSpacing: "-0.04em",
          whiteSpace: "pre-line",
          textTransform: "uppercase",
        }}
      >
        {`CREATIVE DEVELOPER\nBUILDING DIGITAL EXPERIENCES\nTHROUGH CODE, MOTION & INTERACTION.`}
      </motion.div>

      {/* Header nav */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        style={{
          ...overlayBase,
          top: d ? 32 : 16,
          right: d ? 32 : 16,
          width: d ? 330 : "auto",
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {!m && (
          <span style={{ fontSize: 15, textTransform: "uppercase" }}>About</span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: d ? 50 : 20 }}>
          <svg
            width={d ? 30 : 24}
            height={d ? 30 : 24}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 14H40" stroke="#FFFFFF" strokeWidth="2.5" />
            <path d="M0 26H40" stroke="#FFFFFF" strokeWidth="2.5" />
          </svg>
          <span style={{ fontSize: d ? 15 : 13 }}>[ WORK ]</span>
        </div>
      </motion.div>

      {/* Product info */}
      <motion.div
        ref={infoRef}
        data-outro-offset={d ? 166 : 132}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
        style={{
          ...overlayBase,
          right: d ? 32 : 0,
          left: d ? undefined : 0,
          bottom: d ? 80 : 48,
          width: d ? 330 : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: d ? "flex-start" : "center",
            width: d ? "100%" : 252,
            marginBottom: d ? 32 : 12,
          }}
        >
          <div
            style={{
              position: "relative",
              width: d ? 30 : 20,
              height: d ? 30 : 20,
              marginBottom: 8,
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="20"
                cy="20"
                r="18.75"
                stroke="#FFFFFF"
                strokeWidth={d ? 2.5 : 2}
                fill="none"
              />
            </svg>
            <span
              ref={circleRef}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: d ? 15 : 10,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
              }}
            >
              8
            </span>
          </div>
          <div
            style={{
              fontSize: d ? 30 : 20,
              lineHeight: "100%",
              textAlign: "center",
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              whiteSpace: "pre-line",
            }}
          >
            {`SELECTED WORK\n"SUPRIYA THAPALIYA"`}
          </div>
        </div>
        <div
          style={{
            fontSize: d ? 52 : 32,
            lineHeight: "95%",
            textAlign: "center",
            letterSpacing: "-0.04em",
            whiteSpace: "pre-line",
          }}
        >
          {`DEVELOPER\nPORTFOLIO`}
        </div>
      </motion.div>

      {/* View button */}
      <div
        ref={buyRef}
        id="outro-buy"
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 20,
          right: d ? 32 : 16,
          left: d ? undefined : 16,
          bottom: d ? 32 : 60,
          width: d ? 330 : undefined,
          height: d ? 174 : 100,
          transformOrigin: "right bottom",
          transform: "scale(0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          borderRadius: 1335,
        }}
      >
        <span
          style={{
            fontFamily: F,
            fontWeight: 500,
            fontSize: d ? 110 : 72,
            letterSpacing: "-0.04em",
            color: "#000",
            lineHeight: 1,
          }}
        >
          view
        </span>
      </div>

      {/* Footer */}
      <div
        ref={footerRef}
        id="outro-footer"
        style={{
          position: "fixed",
          pointerEvents: "none",
          left: 16,
          bottom: d ? 32 : 24,
          zIndex: 20,
          mixBlendMode: "exclusion",
          color: "#FFFFFF",
          fontFamily: F,
          display: "flex",
          ...(d ? { gap: 80 } : { justifyContent: "space-between", width: "calc(100vw - 32px)" }),
          fontSize: d ? 13 : 11,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          opacity: 0,
        }}
      >
        <span>Supriya Thapaliya (R) 2026</span>
        <span>Privacy Policy</span>
      </div>

    </div>
  );
}