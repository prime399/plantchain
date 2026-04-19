import { api } from "@plantchain-new/backend/convex/_generated/api";
import { buttonVariants } from "@plantchain-new/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Leaf, TreePine, Users, TrendingUp, ArrowRight } from "lucide-react";

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
    <div className="rounded-xl border bg-card p-6 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="text-3xl font-bold">
        {value === undefined ? (
          <span className="text-muted-foreground text-lg">...</span>
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
      <div className="container mx-auto max-w-4xl px-4 py-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-500/10 p-4">
              <TreePine className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">PlantChain</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A community tree planting registry. Log your planting, get AI-verified, and leave an
            immutable mark on the planet.
          </p>
          <div className="flex justify-center gap-3">
          <Link to="/submit" className={buttonVariants({ size: "lg" })}>
            <Leaf className="h-4 w-4 mr-2" />
            Log a Planting
          </Link>
          <Link to="/feed" className={buttonVariants({ variant: "outline", size: "lg" })}>
            View All Plantings
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={TreePine} label="Trees Verified" value={stats?.totalVerified} />
          <StatCard icon={Leaf} label="Submitted" value={stats?.totalSubmitted} />
          <StatCard icon={TrendingUp} label="This Week" value={stats?.thisWeek} />
          <StatCard icon={Users} label="Planters" value={stats?.uniquePlanters} />
        </div>

        {/* Recent verified */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Verified Plantings</h2>
            <Link to="/feed" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            View all
          </Link>
          </div>
          {recent === undefined ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border bg-card h-32 animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
              No verified plantings yet. Be the first!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recent.slice(0, 4).map((p) => (
                <div key={p._id} className="rounded-xl border bg-card overflow-hidden flex gap-0">
                  {p.photoUrl && (
                    <img
                      src={p.photoUrl}
                      alt={p.species}
                      className="w-24 h-24 object-cover flex-shrink-0"
                    />
                  )}
                  <div className="p-3 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="font-medium truncate">{p.species}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {p.locationName ?? `${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}`}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      by {p.userName ?? "Anonymous"} ·{" "}
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
