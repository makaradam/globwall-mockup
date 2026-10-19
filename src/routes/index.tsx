import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { useRef } from "react";
import pink from "@/assets/blob-pink.png";
import blue from "@/assets/blob-blue.png";
import green from "@/assets/blob-green.png";
import yellow from "@/assets/blob-yellow.png";
import orange from "@/assets/blob-orange.png";
import violet from "@/assets/blob-violet.png";

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
      <Orbit />
      <Steps />
      <Wall />
      <Cta />
    </main>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <span className="text-2xl font-extrabold tracking-tight">globwall</span>
      <button className="rounded-full border bg-card/70 px-4 py-1.5 text-sm backdrop-blur">Sign in</button>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const scale = useTransform(p, [0, 1], [1, 2.4]);
  const rotY = useTransform(p, [0, 1], [0, 360]);
  const y = useTransform(p, [0, 1], [0, 300]);
  const textY = useTransform(p, [0, 1], [0, -160]);
  const fade = useTransform(p, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-6" style={{ perspective: 1200 }}>
        <div className="glob-glow absolute h-[600px] w-[600px]" />
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-glob-lime" /> one wall · 300 spots · forever
          </span>
          <h1 className="mt-6 text-6xl font-extrabold leading-[0.95] tracking-tighter md:text-8xl">
            Give your product<br />a <span className="text-glob-pink">glob.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
            Pick a little character, pin it to the wall, and point it at whatever you're building.
          </p>
        </motion.div>
        <motion.img
          src={pink} alt="Pink glob" width={1024} height={1024}
          style={{ scale, rotateY: rotY, y, transformStyle: "preserve-3d" }}
          className="glob-shadow relative z-0 mt-6 w-56 md:w-72"
        />
      </div>
    </section>
  );
}

function OrbitBlob({ src, i, p }: { src: string; i: number; p: MotionValue<number> }) {
  const angle = useTransform(p, [0, 1], [i * 60, i * 60 + 360]);
  const x = useTransform(angle, (a) => Math.cos((a * Math.PI) / 180) * 340);
  const z = useTransform(angle, (a) => Math.sin((a * Math.PI) / 180) * 340);
  const s = useTransform(z, [-340, 340], [0.55, 1.15]);
  const o = useTransform(z, [-340, 340], [0.4, 1]);
  const zi = useTransform(z, (v) => Math.round(v + 400));
  return (
    <motion.img src={src} alt="" loading="lazy" width={1024} height={1024}
      style={{ x, scale: s, opacity: o, zIndex: zi }}
      className="glob-shadow absolute w-40 md:w-48" />
  );
}

function Orbit() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  return (
    <section ref={ref} className="relative flex h-[120vh] flex-col items-center justify-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">The cast</p>
      <h2 className="mt-3 max-w-xl text-center text-4xl font-extrabold tracking-tight md:text-6xl">Every glob is one of a kind.</h2>
      <div className="relative mt-16 flex h-72 w-full items-center justify-center">
        {BLOBS.map((b, i) => <OrbitBlob key={i} src={b} i={i} p={p} />)}
      </div>
    </section>
  );
}

function Steps() {
  const steps = [
    { n: "01", t: "Pick a glob", d: "Browse the wall and choose a character that fits your vibe.", img: green },
    { n: "02", t: "Make it yours", d: "Add your product name, link and category.", img: yellow },
    { n: "03", t: "Stay forever", d: "Your glob lives on the wall permanently, sending clicks your way.", img: blue },
  ];
  return (
    <section className="mx-auto max-w-6xl space-y-32 px-6 py-32">
      {steps.map((s, i) => <Step key={s.n} {...s} flip={i % 2 === 1} />)}
    </section>
  );
}

function Step({ n, t, d, img, flip }: { n: string; t: string; d: string; img: string; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rot = useTransform(scrollYProgress, [0, 1], [flip ? -70 : 70, 0]);
  const x = useTransform(scrollYProgress, [0, 1], [flip ? -200 : 200, 0]);
  const o = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.6, 1]);
  return (
    <div ref={ref} className={`flex flex-col items-center gap-12 md:flex-row ${flip ? "md:flex-row-reverse" : ""}`} style={{ perspective: 1000 }}>
      <motion.img src={img} alt="" loading="lazy" width={1024} height={1024}
        style={{ rotateY: rot, x, opacity: o }} className="glob-shadow w-64 md:w-80" />
      <motion.div style={{ opacity: o }} className="max-w-md">
        <span className="font-mono text-sm text-muted-foreground">{n}</span>
        <h3 className="mt-2 text-5xl font-extrabold tracking-tight">{t}</h3>
        <p className="mt-4 text-lg text-muted-foreground">{d}</p>
      </motion.div>
    </div>
  );
}

function Wall() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotX = useTransform(scrollYProgress, [0, 1], [55, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const cells = Array.from({ length: 30 }, (_, i) => i);
  return (
    <section ref={ref} className="relative px-6 py-24" style={{ perspective: 1400 }}>
      <div className="glob-glow-blue absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2" />
      <h2 className="relative text-center text-4xl font-extrabold tracking-tight md:text-6xl">The wall</h2>
      <p className="relative mt-3 text-center font-mono text-sm text-muted-foreground">6 / 300 claimed · from $1</p>
      <motion.div style={{ rotateX: rotX, scale, transformOrigin: "center top" }}
        className="relative mx-auto mt-12 grid max-w-6xl grid-cols-3 gap-3 rounded-3xl border bg-card p-4 shadow-2xl sm:grid-cols-5 md:grid-cols-6">
        {cells.map((i) => {
          const claimed = i < 6;
          return (
            <motion.div key={i} whileHover={{ y: -6, rotate: -2 }}
              className="group flex flex-col items-center rounded-2xl border bg-background p-2">
              <span className="self-start font-mono text-[10px] text-muted-foreground">#{String(i + 1).padStart(3, "0")}</span>
              <img src={BLOBS[i % 6]} alt="" loading="lazy" width={1024} height={1024}
                className={`w-20 transition-transform duration-300 group-hover:scale-110 ${claimed ? "" : "opacity-40 grayscale"}`} />
              <span className={`mt-1 w-full rounded-md px-2 py-1 text-center text-xs ${claimed ? "bg-primary text-primary-foreground" : "border border-dashed font-mono text-muted-foreground"}`}>
                {claimed ? NAMES[i] : i < 12 ? "$1 claim" : "$5 claim"}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
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
