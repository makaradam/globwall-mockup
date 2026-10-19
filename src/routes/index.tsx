import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/60 backdrop-blur-md">
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
  const wallY = useTransform(p, [0, 1], ["62vh", "11vh"]);
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

const CLAIMED: Record<number, { name: string; cat: string }> = {
  0: { name: "Nimbus", cat: "Tool" }, 1: { name: "Parcel", cat: "SaaS" }, 2: { name: "Sprout", cat: "AI" },
  3: { name: "Launchly", cat: "Tool" }, 4: { name: "Echo", cat: "Audio" }, 5: { name: "Atelier", cat: "Design" },
};
const RARE = new Set([49, 99, 149, 199, 249, 299, 77, 177, 222, 288]);
const CENTER = new Set([144, 145, 154, 155]);
const price = (i: number) => (RARE.has(i) ? 99 : CENTER.has(i) ? 49 : i < 12 ? 1 : 5);

function WallPanel() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "open" | "taken" | "rare">("all");
  const [picked, setPicked] = useState<number | null>(null);
  const cells = useMemo(() => Array.from({ length: 300 }, (_, i) => i).filter((i) => {
    const c = CLAIMED[i];
    if (tab === "open" && c) return false;
    if (tab === "taken" && !c) return false;
    if (tab === "rare" && !RARE.has(i) && !CENTER.has(i)) return false;
    if (!q.trim()) return true;
    const t = q.toLowerCase();
    return `#${String(i + 1).padStart(3, "0")}`.includes(t) || (c && (c.name + " " + c.cat).toLowerCase().includes(t));
  }), [q, tab]);
  const taken = Object.keys(CLAIMED).length;
  const tabs = [["all", `All (300)`], ["open", `Open (${300 - taken})`], ["taken", `Taken (${taken})`], ["rare", "★ Rare"]] as const;

  return (
    <div className="wall-panel relative mx-auto max-w-6xl rounded-3xl border p-4">
      <div className="flex flex-wrap items-center gap-3 border-b pb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="⌕ Search products, #number…"
          className="h-9 w-56 rounded-lg border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        <button onClick={() => setPicked(cells.find((i) => !CLAIMED[i]) ?? null)} className="h-9 rounded-lg bg-primary px-3 text-sm text-primary-foreground">+ Claim a spot</button>
        <div className="ml-auto flex rounded-lg bg-muted p-1 text-sm">
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`rounded-md px-3 py-1 transition ${tab === k ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div data-lenis-prevent className="mt-4 h-[72vh] overflow-y-auto overscroll-contain pr-1">
        {cells.length === 0 && <p className="py-16 text-center text-sm text-muted-foreground">No globs match "{q}".</p>}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10">
          {cells.map((i) => {
            const c = CLAIMED[i];
            const special = RARE.has(i) ? "★ Rare" : CENTER.has(i) ? "★ Center" : c?.cat;
            return (
              <motion.button key={i} layout whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => !c && setPicked(i)}
                className={`wall-card group flex flex-col items-center rounded-2xl border p-2 ${RARE.has(i) || CENTER.has(i) ? "ring-1 ring-glob-sun" : ""}`}>
                <div className="flex w-full justify-between font-mono text-[10px] text-muted-foreground">
                  <span>#{String(i + 1).padStart(3, "0")}</span>
                  {special && <span className="rounded bg-secondary px-1">{special}</span>}
                </div>
                <img src={BLOBS[(i * 7) % 6]} alt="" loading="lazy" width={1024} height={1024}
                  className="my-1 w-16 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                <span className={`w-full truncate rounded-md px-1 py-1 text-center text-[11px] ${c ? "bg-primary font-semibold text-primary-foreground" : "border border-dashed font-mono text-muted-foreground group-hover:border-solid group-hover:text-foreground"}`}>
                  {c ? `${c.name} ↗` : `$${price(i)} claim`}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
      {picked !== null && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={() => setPicked(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()}
            className="w-80 rounded-2xl border bg-card p-6 text-center shadow-2xl">
            <img src={BLOBS[(picked * 7) % 6]} alt="" width={1024} height={1024} className="animate-bob mx-auto w-28" />
            <p className="mt-2 font-mono text-xs text-muted-foreground">Glob #{String(picked + 1).padStart(3, "0")}</p>
            <h4 className="text-xl font-extrabold">Claim this spot</h4>
            <p className="mt-1 text-sm text-muted-foreground">One-time ${price(picked)} · permanent link</p>
            <div className="mt-4 h-9 rounded-lg border px-3 text-left text-sm leading-9 text-muted-foreground">Product name</div>
            <div className="mt-2 h-9 rounded-lg border px-3 text-left text-sm leading-9 text-muted-foreground">https://</div>
            <button onClick={() => setPicked(null)} className="mt-4 w-full rounded-full bg-primary py-2 text-sm text-primary-foreground">Continue — ${price(picked)}</button>
          </motion.div>
        </div>, document.body
      )}
    </div>
  );
}

function Cta() {
  const tools = [
    { i: ">_", t: "NPM Package", d: "React, Next.js & Vue" },
    { i: "◆", t: "Figma Kit", d: "Components & tokens" },
    { i: "↓", t: "Raw 3D & Lottie", d: "WebP, SVG & JSON" },
    { i: "ϟ", t: "Edge CDN", d: "Instant avatar URLs" },
  ];
  return (
    <section className="section-soft px-6 pb-24 pt-4">
      <p className="mx-auto max-w-3xl text-center font-mono text-xs text-muted-foreground">
        One-time fee from $1 · Rare spots up to $99 · Permanent dofollow link to your product
      </p>
      <div className="mx-auto mt-24 max-w-5xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 font-mono text-[11px]">
          ▣ Coming soon for developers <span className="text-glob-lime">•</span> <span className="text-muted-foreground">300+ animated 3D mascots</span>
        </span>
        <h2 className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">
          Motion Glob Avatars for <span className="text-muted-foreground">Your Next Project</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Give your app a friendly 3D personality. An open avatar set made to drop into any design or engineering stack in minutes.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((x) => (
            <div key={x.t} className="flex items-center gap-3 rounded-xl border bg-card p-4 text-left shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted font-mono text-xs">{x.i}</span>
              <div><p className="text-sm font-semibold">{x.t}</p><p className="text-xs text-muted-foreground">{x.d}</p></div>
            </div>
          ))}
        </div>

        <p className="mt-24 font-mono text-[11px] font-semibold uppercase tracking-widest">Real-world use cases</p>
        <h3 className="mt-3 text-3xl font-extrabold tracking-tight">Built for Everyday Product Interfaces</h3>
        <p className="mt-2 text-sm text-muted-foreground">Four spots where a glob makes your product feel a little more human.</p>
        <div className="mt-10 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
          <UseCase title="User Profiles & Fallbacks" desc="Swap empty initials and grey silhouettes for friendly default avatars across teams, profiles and comments.">
            <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
              <img src={yellow} alt="" loading="lazy" width={1024} height={1024} className="h-9 w-9" />
              <div><p className="text-xs font-semibold">Sarah Chen <span className="rounded bg-secondary px-1 font-mono text-[9px]">Pro</span></p><p className="text-[10px] text-muted-foreground">Founding Engineer @ Acme</p></div>
            </div>
          </UseCase>
          <UseCase title="AI Copilots & Chatbots" desc="Give assistants visible moods — thinking, listening, celebrating — so they feel alive.">
            <div className="rounded-xl bg-primary p-3 text-primary-foreground shadow-lg">
              <div className="flex items-center justify-between text-[11px]"><span className="flex items-center gap-1"><img src={blue} alt="" loading="lazy" width={1024} height={1024} className="h-4 w-4" /> Glob Copilot</span><span className="font-mono text-glob-blue">Thinking…</span></div>
              <p className="mt-2 rounded-md bg-background/10 p-2 text-[10px]">Spotted 3 slow queries. Add indexes automatically?</p>
              <div className="mt-2 flex gap-1 text-[10px]"><span className="rounded bg-background/15 px-2 py-0.5">ϟ Apply</span><span className="px-2 py-0.5 opacity-60">Review</span></div>
            </div>
          </UseCase>
          <UseCase title="Empty States & 404 Pages" desc="Make empty inboxes, no-result searches and 404s a pleasant little pause.">
            <div className="text-center"><img src={violet} alt="" loading="lazy" width={1024} height={1024} className="mx-auto h-10 w-10" /><p className="mt-1 text-xs font-semibold">All caught up!</p><p className="text-[10px] text-muted-foreground">Nothing left in the backlog</p></div>
          </UseCase>
          <UseCase title="Streaks & Milestones" desc="Cheer on finished onboarding, streaks and daily wins with playful motion.">
            <div className="flex items-center gap-2 rounded-xl border bg-card p-3 shadow-sm">
              <img src={pink} alt="" loading="lazy" width={1024} height={1024} className="h-7 w-7" />
              <div className="flex-1"><p className="text-xs font-semibold">7-Day Streak! 🔥</p><p className="text-[10px] text-muted-foreground">Top 5% this week</p></div>
              <span className="rounded bg-glob-pink/15 px-1 font-mono text-[9px] text-glob-pink">+150 XP</span>
            </div>
          </UseCase>
        </div>

        <div className="mx-auto mt-16 max-w-md rounded-2xl border bg-card p-8 shadow-lg">
          <h3 className="text-lg font-semibold">Get Early Access to Motion Avatars</h3>
          <p className="mt-2 text-xs text-muted-foreground">Join the list for the npm package, the Figma kit and 20 free high-res mascots on launch day.</p>
          <div className="mt-5 flex gap-2">
            <div className="flex h-10 flex-1 items-center rounded-lg border px-3 text-xs text-muted-foreground">Enter your developer email</div>
            <span className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm text-primary-foreground shadow-md">Join Waitlist ↗</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCase({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex min-h-28 items-center justify-center bg-muted/50 p-3"><div className="w-full">{children}</div></div>
      <div className="p-4"><p className="text-sm font-semibold">{title}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{desc}</p></div>
    </div>
  );
}

function Footer() {
  const badges = ["twelve.tools", "Uneed", "LetsLaunch", "Acid Tools", "Unite List", "Startup Fame", "ShowMySites", "DanielLaunches", "NoonLaunch"];
  return (
    <footer className="border-t bg-card px-6 py-10 text-center">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Featured on</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {badges.map((b) => (
          <span key={b} className="rounded-md border px-3 py-1.5 text-left leading-tight">
            <span className="block font-mono text-[7px] uppercase text-muted-foreground">Featured on</span>
            <span className="text-xs font-semibold">{b}</span>
          </span>
        ))}
      </div>
      <p className="mt-8 border-t pt-6 text-xs text-muted-foreground">© Globwall. Cute avatars for developers · A permanent launch wall for founders.</p>
    </footer>
  );
}
