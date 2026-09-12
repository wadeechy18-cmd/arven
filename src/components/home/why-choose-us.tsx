import { Hand, Leaf, ShieldCheck, Sprout } from "lucide-react";

const points = [
  {
    icon: Hand,
    title: "Crafted with Care",
    copy: "Every piece is cut, woven, or stitched by hand — never mass-produced.",
  },
  {
    icon: Sprout,
    title: "Natural Materials",
    copy: "Jute and full-grain leather, sourced with a preference for renewable and biodegradable materials.",
  },
  {
    icon: ShieldCheck,
    title: "Built to Last",
    copy: "Reinforced stitching and considered construction, made for years of daily use.",
  },
  {
    icon: Leaf,
    title: "Thoughtful & Sustainable",
    copy: "Small-batch production with workshops we visit and know by name.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-y border-y border-border bg-primary text-primary-foreground">
      <div className="container-wide">
        <div className="mb-14 max-w-lg">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest2 text-primary-foreground/60">
            Why Arven
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl">A quieter kind of quality.</h2>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <div key={p.title}>
              <p.icon className="h-6 w-6 text-jute" strokeWidth={1.3} />
              <h3 className="mt-4 font-serif text-lg">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">{p.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
