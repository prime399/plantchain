import { api } from "@plantchain-new/backend/convex/_generated/api";
import { buttonVariants } from "@plantchain-new/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import {
  ArrowRight,
  Leaf,
  MapPin,
  TreePine,
  TrendingUp,
  Users,
} from "lucide-react";

import { GameOfLifeCanvas } from "@/components/game-of-life";
import {
  BaobabTree,
  HeroTree,
  IconCamera,
  IconPlant,
  IconRecord,
  IconVerify,
  LeafCluster,
  OakTree,
  PalmTree,
  PineTree,
  RedwoodTree,
  Sapling,
  TreeLine,
  WillowTree,
} from "@/components/svg/tree-illustrations";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number | undefined;
}) {
  return (
    <div className="text-center px-6 py-5 border-r border-white/10 last:border-r-0">
      <div className="flex items-center justify-center gap-1.5 text-sprout text-[0.7rem] uppercase tracking-widest font-medium mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="font-serif text-3xl font-semibold text-white">
        {value === undefined ? (
          <span className="text-mist/50 text-lg">—</span>
        ) : (
          value.toLocaleString()
        )}
      </div>
    </div>
  );
}

const HOW_IT_WORKS = [
  {
    icon: IconPlant,
    title: "Plant a Tree",
    desc: "Plant a tree anywhere in the world and document it.",
  },
  {
    icon: IconCamera,
    title: "Snap a Photo",
    desc: "Upload a clear photo of your newly planted tree.",
  },
  {
    icon: IconVerify,
    title: "AI Verification",
    desc: "Our AI confirms the species and planting quality.",
  },
  {
    icon: IconRecord,
    title: "Permanent Record",
    desc: "Your planting is recorded on the public registry.",
  },
];

const FEATURED_SPECIES = [
  {
    name: "Japanese Cherry Blossom",
    region: "East Asia",
    fact: "Can live over 1,000 years. Symbolizes renewal and the beauty of life.",
    tree: WillowTree,
  },
  {
    name: "Coast Redwood",
    region: "California, USA",
    fact: "Tallest trees on Earth, reaching over 115m. Absorbs massive CO2.",
    tree: RedwoodTree,
  },
  {
    name: "Baobab",
    region: "Sub-Saharan Africa",
    fact: "Stores up to 120,000 liters of water. Called the Tree of Life.",
    tree: BaobabTree,
  },
  {
    name: "European Oak",
    region: "Europe",
    fact: "Supports 2,300+ species. A single tree produces 70,000 acorns yearly.",
    tree: OakTree,
  },
  {
    name: "Neem",
    region: "South Asia",
    fact: "Natural pesticide and air purifier. Used in medicine for centuries.",
    tree: PalmTree,
  },
  {
    name: "Giant Sequoia",
    region: "Sierra Nevada, USA",
    fact: "Most massive trees by volume. Some are over 3,000 years old.",
    tree: PineTree,
  },
];

function HomeComponent() {
  const stats = useQuery(api.plantings.stats);
  const recent = useQuery(api.plantings.list, { status: "verified" });

  return (
    <div className="overflow-y-auto">
      {/* Hero */}
      <section className="relative bg-forest overflow-hidden">
        <GameOfLifeCanvas />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(93,165,82,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(200,148,58,0.06)_0%,transparent_50%)] pointer-events-none" />
        <HeroTree className="absolute -left-8 bottom-0 h-72 sm:h-96 opacity-15 pointer-events-none" />
        <HeroTree className="absolute -right-8 bottom-0 h-64 sm:h-80 opacity-10 pointer-events-none scale-x-[-1]" />
        <LeafCluster className="absolute top-8 left-1/4 w-32 opacity-10 pointer-events-none" />
        <LeafCluster className="absolute bottom-12 right-1/4 w-24 opacity-8 pointer-events-none rotate-12" />

        <div className="relative max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
          <div className="inline-block font-mono text-[0.7rem] tracking-widest text-gold-light uppercase border border-gold/30 px-4 py-1.5 rounded mb-6 animate-fade-in">
            Community Reforestation Registry
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] mb-5">
            Every tree planted,
            <br />
            <em className="text-sprout">forever verified</em>
          </h1>
          <p className="text-mist/80 text-lg max-w-xl mx-auto leading-relaxed font-light mb-10">
            Log your planting, get AI-verified, and leave an immutable
            mark on the planet. Transparent, trustless, and permanent.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-forest font-semibold px-7 py-3.5 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
            >
              <Leaf className="h-4 w-4" />
              Log a Planting
            </Link>
            <Link
              to="/feed"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-mist hover:text-white px-7 py-3.5 rounded-lg transition-colors"
            >
              View Registry
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-forest-mid border-b border-white/6">
        <div className="max-w-4xl mx-auto flex justify-center flex-wrap">
          <StatCard
            icon={TreePine}
            label="Verified"
            value={stats?.totalVerified}
          />
          <StatCard
            icon={Leaf}
            label="Submitted"
            value={stats?.totalSubmitted}
          />
          <StatCard
            icon={TrendingUp}
            label="This Week"
            value={stats?.thisWeek}
          />
          <StatCard
            icon={Users}
            label="Planters"
            value={stats?.uniquePlanters}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="relative max-w-5xl mx-auto px-4 py-16 sm:py-20">
        <div className="absolute inset-0 bg-dot-grid text-sprout/[0.07] pointer-events-none" />
        <div className="relative text-center mb-12">
          <h2 className="font-serif text-3xl font-semibold mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Four simple steps from planting to permanent record.
          </p>
        </div>
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.title}
              className="corner-card group relative rounded-none border border-border/40 bg-card p-6 text-center hover:shadow-lg hover:shadow-sprout/5 hover:-translate-y-1 transition-all"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="corner-bl" />
              <span className="corner-br" />
              <div className="absolute top-2 right-2 font-mono text-[0.65rem] bg-gold text-forest font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {i + 1}
              </div>
              <step.icon className="w-14 h-14 mx-auto mb-4" />
              <h3 className="font-serif font-semibold text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Verified */}
      <section className="relative bg-mist/30 dark:bg-forest/30">
        <div className="absolute inset-0 bg-dot-grid text-sprout/[0.05] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-semibold">
              Recent Verified Plantings
            </h2>
            <Link
              to="/feed"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              View all
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>

          {recent === undefined ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border-l-2 border-l-sprout/40 border border-border/40 bg-card h-36 animate-pulse"
                />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="rounded-lg border-l-2 border-l-sprout/40 border border-border/40 bg-card p-12 text-center">
              <Sapling className="h-20 w-16 mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground">
                No verified plantings yet. Be the first!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recent.slice(0, 6).map((p) => (
                <div
                  key={p._id}
                  className="group rounded-lg border-l-2 border-l-sprout/60 border border-border/40 bg-card overflow-hidden flex hover:border-l-sprout hover:shadow-lg hover:shadow-sprout/5 hover:-translate-y-0.5 transition-all"
                >
                  {p.photoUrl ? (
                    <img
                      src={p.photoUrl}
                      alt={p.species}
                      className="w-28 h-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-28 shrink-0 bg-mist dark:bg-forest-mid flex items-center justify-center">
                      <Sapling className="w-12 h-16 opacity-50" />
                    </div>
                  )}
                  <div className="p-4 flex flex-col justify-between min-w-0 flex-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif font-semibold truncate">
                          {p.species}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[0.65rem] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Verified
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {p.locationName ??
                          `${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}`}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      by {p.userName ?? "Anonymous"} ·{" "}
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Species */}
      <section className="relative max-w-5xl mx-auto px-4 py-16 sm:py-20">
        <div className="absolute inset-0 bg-dot-grid text-sprout/[0.07] pointer-events-none" />
        <div className="relative text-center mb-12">
          <h2 className="font-serif text-3xl font-semibold mb-3">
            Featured Species
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Trees that make a difference around the world.
          </p>
        </div>
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_SPECIES.map((s) => (
            <div
              key={s.name}
              className="corner-card group relative border border-border/40 bg-card p-5 hover:shadow-lg hover:shadow-sprout/5 hover:-translate-y-0.5 transition-all"
            >
              <span className="corner-bl" />
              <span className="corner-br" />
              <div className="flex items-start gap-4">
                <s.tree className="w-10 h-14 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="min-w-0">
                  <h3 className="font-serif font-semibold truncate">
                    {s.name}
                  </h3>
                  <span className="text-[0.7rem] font-mono text-muted-foreground uppercase tracking-wider">
                    {s.region}
                  </span>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {s.fact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative bg-forest overflow-hidden">
        <GameOfLifeCanvas />
        <TreeLine className="absolute bottom-0 left-0 w-full h-24 opacity-30 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 py-16 sm:py-20 text-center">
          <Sapling className="w-12 h-16 mx-auto mb-4 opacity-60" />
          <h2 className="font-serif text-3xl font-semibold text-white mb-4">
            Ready to make your mark?
          </h2>
          <p className="text-mist/80 max-w-md mx-auto mb-8 leading-relaxed">
            Join a global community of planters. Every tree counts, every
            planting is verified, every record is permanent.
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-forest font-semibold px-8 py-4 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20 text-lg"
          >
            <TreePine className="h-5 w-5" />
            Start Planting
          </Link>
        </div>
      </section>
    </div>
  );
}
