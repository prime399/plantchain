import { api } from "@plantchain-new/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { CheckCircle2, Clock, MapPin, TreePine, XCircle } from "lucide-react";

export const Route = createFileRoute("/feed")({
  component: FeedRoute,
});

function StatusBadge({ status }: { status: "pending" | "verified" | "rejected" }) {
  if (status === "verified")
    return (
      <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-mono text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full">
        <XCircle className="h-3 w-3" />
        Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-mono text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
      <Clock className="h-3 w-3" />
      Pending
    </span>
  );
}

function FeedRoute() {
  const plantings = useQuery(api.plantings.list, {});

  return (
    <div className="overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-2">
          <TreePine className="h-6 w-6 text-leaf" />
          <h1 className="font-serif text-2xl font-semibold">Planting Registry</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8 ml-9">
          All community plantings, verified by AI
        </p>

        {plantings === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border bg-card h-72 animate-pulse" />
            ))}
          </div>
        ) : plantings.length === 0 ? (
          <div className="rounded-xl border bg-card p-16 text-center">
            <TreePine className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No plantings yet. Be the first to log one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plantings.map((p) => (
              <div
                key={p._id}
                className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                {p.photoUrl ? (
                  <img
                    src={p.photoUrl}
                    alt={p.species}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-mist dark:bg-forest-mid flex items-center justify-center text-4xl">
                    🌳
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-mist dark:bg-secondary flex items-center justify-center text-[0.65rem] font-semibold text-forest dark:text-foreground flex-shrink-0">
                      {(p.userName ?? "A").charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium truncate">
                      {p.userName ?? "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-serif font-semibold mb-1">{p.species}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3 text-leaf flex-shrink-0" />
                    <span className="truncate">
                      {p.locationName ?? `${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <StatusBadge status={p.status} />
                    {p.verificationResult?.reason && (
                      <span className="text-[0.65rem] text-muted-foreground truncate max-w-[50%] ml-2">
                        {p.verificationResult.reason}
                      </span>
                    )}
                  </div>

                  {p.verificationResult?.tips && p.status === "verified" && (
                    <p className="text-xs text-leaf mt-2 line-clamp-1">
                      💡 {p.verificationResult.tips}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
