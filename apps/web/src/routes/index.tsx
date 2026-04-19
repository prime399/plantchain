import { api } from "@plantchain-new/backend/convex/_generated/api";
import { buttonVariants } from "@plantchain-new/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { ArrowRight, Leaf, TreePine, TrendingUp, Users } from "lucide-react";

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
    <div className="text-center px-6 py-4 border-r border-white/10 last:border-r-0">
      <div className="flex items-center justify-center gap-1.5 text-sprout text-[0.7rem] uppercase tracking-widest font-medium mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="font-serif text-2xl font-semibold text-white">
        {value === undefined ? (
          <span className="text-mist/50 text-lg">—</span>
        ) : (
          value.toLocaleString()
        )}
      </div>
    </div>
  );
}

function HomeComponent() {
  const stats = useQuery(api.plantings.stats);
  const recent = useQuery(api.plantings.list, { status: "verified" });

  return (
    <div className="overflow-y-auto">
      {/* Hero */}
      <section className="relative bg-forest overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(93,165,82,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(200,148,58,0.06)_0%,transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 py-20 sm:py-28 text-center">
          <div className="inline-block font-mono text-[0.7rem] tracking-widest text-gold-light uppercase border border-gold/30 px-4 py-1.5 rounded mb-6">
            Community Reforestation Registry
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] mb-5">
            Every tree planted,
            <br />
            <em className="text-sprout">forever verified</em>
          </h1>
          <p className="text-mist/80 text-lg max-w-xl mx-auto leading-relaxed font-light mb-10">
            Log your planting, get AI-verified, and leave an immutable mark on the planet.
            Transparent, trustless, and permanent.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-forest font-semibold px-7 py-3.5 rounded-lg transition-all hover:-translate-y-0.5"
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
          <StatCard icon={TreePine} label="Verified" value={stats?.totalVerified} />
          <StatCard icon={Leaf} label="Submitted" value={stats?.totalSubmitted} />
          <StatCard icon={TrendingUp} label="This Week" value={stats?.thisWeek} />
          <StatCard icon={Users} label="Planters" value={stats?.uniquePlanters} />
        </div>
      </section>

      {/* Recent Verified */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-semibold">Recent Verified Plantings</h2>
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
              <div key={i} className="rounded-xl border bg-card h-36 animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <TreePine className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No verified plantings yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recent.slice(0, 4).map((p) => (
              <div
                key={p._id}
                className="group rounded-xl border bg-card overflow-hidden flex hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {p.photoUrl ? (
                  <img
                    src={p.photoUrl}
                    alt={p.species}
                    className="w-28 h-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-28 flex-shrink-0 bg-mist dark:bg-forest-mid flex items-center justify-center text-3xl">
                    🌳
                  </div>
                )}
                <div className="p-4 flex flex-col justify-between min-w-0 flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif font-semibold truncate">{p.species}</span>
                      <span className="inline-flex items-center gap-1 text-[0.65rem] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Verified
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {p.locationName ?? `${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}`}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    by {p.userName ?? "Anonymous"} · {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
