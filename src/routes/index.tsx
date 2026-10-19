import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import pink from "@/assets/blob-pink.png";
import blue from "@/assets/blob-blue.png";
import green from "@/assets/blob-green.png";
import yellow from "@/assets/blob-yellow.png";
import orange from "@/assets/blob-orange.png";
import violet from "@/assets/blob-violet.png";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Globwall — Give your product a glob" },
      { name: "description", content: "A permanent wall of 3D characters, each one linking to a product. Claim yours." },
      { property: "og:title", content: "Globwall — Give your product a glob" },
      { property: "og:description", content: "A permanent wall of 3D characters, each one linking to a product." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const BLOBS = [pink, blue, green, yellow, orange, violet];
const NAMES = ["Nimbus", "Parcel", "Sprout", "Launchly", "Echo", "Atelier"];

function Index() {
  return (
    <main className="overflow-x-clip bg-background text-foreground">
      <Nav />
      <Hero />
      <Cta />
    </main>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-2xl font-extrabold tracking-tight">globwall</span>
        <button className="rounded-full border bg-card/80 px-4 py-1.5 text-sm shadow-sm backdrop-blur">Sign in</button>
      </div>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const bgScale = useTransform(p, [0, 1], [1, 1.35]);
  const bgY = useTransform(p, [0, 1], ["0%", "-8%"]);
  const bgBlur = useTransform(p, [0, 0.8], ["blur(0px)", "blur(6px)"]);
  const textY = useTransform(p, [0, 0.5], [0, -120]);
  const textO = useTransform(p, [0, 0.4], [1, 0]);
  const wallY = useTransform(p, [0, 1], ["62vh", "8vh"]);
  const wallRot = useTransform(p, [0, 1], [38, 0]);
  const wallScale = useTransform(p, [0, 1], [0.86, 1]);

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ perspective: 1600 }}>
        <motion.img src={heroBg} alt="" width={1920} height={1088}
          style={{ scale: bgScale, y: bgY, filter: bgBlur }}
          className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-fade absolute inset-x-0 bottom-0 h-1/3" />
        <motion.div style={{ y: textY, opacity: textO }} className="relative z-10 flex flex-col items-center px-6 pt-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 font-mono text-xs shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-glob-lime" /> A permanent link <span className="text-muted-foreground">/ forever on the wall</span>
          </span>
          <h1 className="mt-5 text-5xl font-extrabold leading-[0.95] tracking-tighter md:text-7xl">
            Every product<br />needs a <span className="text-muted-foreground">glob.</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">300 tiny characters, one wall that never resets. Pick one and point it at your product.</p>
          <button className="mt-6 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-2xl transition-transform hover:scale-105">
            Claim a spot <span className="rounded-full bg-background/15 px-2 py-0.5 font-mono text-xs">from $1</span> ↗
          </button>
        </motion.div>
        <motion.div style={{ y: wallY, rotateX: wallRot, scale: wallScale, transformOrigin: "center top" }}
          className="absolute inset-x-0 top-0 z-20 px-4">
          <WallPanel />
        </motion.div>
      </div>
    </section>
  );
}

function WallPanel() {
  const cells = Array.from({ length: 30 }, (_, i) => i);
  return (
    <div className="wall-panel mx-auto max-w-6xl rounded-3xl border p-4">
      <div className="flex flex-wrap items-center gap-3 border-b pb-4">
        <div className="flex h-9 w-56 items-center rounded-lg border bg-card px-3 text-sm text-muted-foreground">⌕ Search products…</div>
        <button className="h-9 rounded-lg bg-primary px-3 text-sm text-primary-foreground">+ Claim a spot</button>
        <div className="ml-auto flex rounded-lg bg-muted p-1 text-sm">
          <span className="rounded-md bg-card px-3 py-1 shadow-sm">All (300)</span>
          <span className="px-3 py-1 text-muted-foreground">Open (294)</span>
          <span className="px-3 py-1 text-muted-foreground">Taken (6)</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10">
        {cells.map((i) => {
          const claimed = i < 6;
          return (
            <motion.div key={i} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}
              className="wall-card group flex flex-col items-center rounded-2xl border p-2">
              <div className="flex w-full justify-between font-mono text-[10px] text-muted-foreground">
                <span>#{String(i + 1).padStart(3, "0")}</span>
                {claimed && <span className="rounded bg-secondary px-1">Tool</span>}
              </div>
              <img src={BLOBS[i % 6]} alt="" loading="lazy" width={1024} height={1024}
                className="my-1 w-16 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
              <span className={`w-full truncate rounded-md px-1 py-1 text-center text-[11px] ${claimed ? "bg-primary font-semibold text-primary-foreground" : "border border-dashed font-mono text-muted-foreground"}`}>
                {claimed ? NAMES[i] : i < 12 ? "$1 claim" : "$5 claim"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Cta() {
  return (
    <section className="flex flex-col items-center px-6 py-40 text-center">
      <img src={violet} alt="" loading="lazy" width={1024} height={1024} className="animate-bob glob-shadow w-40" />
      <h2 className="mt-8 text-5xl font-extrabold tracking-tight md:text-7xl">Your spot is waiting.</h2>
      <button className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-lg text-primary-foreground shadow-xl transition-transform hover:scale-105">
        Claim a spot <span className="rounded-full bg-background/15 px-2 py-0.5 font-mono text-xs">from $1</span>
      </button>
    </section>
  );
}
