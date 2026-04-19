import { api } from "@plantchain-new/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { CheckCircle2, Clock, XCircle, TreePine, MapPin } from "lucide-react";

export const Route = createFileRoute("/feed")({
  component: FeedRoute,
});

function StatusBadge({ status }: { status: "pending" | "verified" | "rejected" }) {
  if (status === "verified")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-500/10 rounded-full px-2 py-0.5">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 rounded-full px-2 py-0.5">
        <XCircle className="h-3 w-3" />
        Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-500 bg-yellow-500/10 rounded-full px-2 py-0.5">
      <Clock className="h-3 w-3" />
      Pending
    </span>
  );
}

function FeedRoute() {
  const plantings = useQuery(api.plantings.list, {});

  return (
    <div className="overflow-y-auto">
      <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div className="flex items-center gap-2">
          <TreePine className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-bold">All Plantings</h1>
        </div>

        {plantings === undefined ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border bg-card h-28 animate-pulse" />
            ))}
          </div>
        ) : plantings.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
            No plantings yet. Be the first to log one!
          </div>
        ) : (
          <div className="space-y-4">
            {plantings.map((p) => (
              <div key={p._id} className="rounded-xl border bg-card overflow-hidden flex">
                {p.photoUrl && (
                  <img
                    src={p.photoUrl}
                    alt={p.species}
                    className="w-28 h-28 object-cover flex-shrink-0"
                  />
                )}
                <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{p.species}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {p.locationName ??
                            `${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}`}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="space-y-1">
                    {p.verificationResult?.reason && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {p.verificationResult.reason}
                      </p>
                    )}
                    {p.verificationResult?.tips && p.status === "verified" && (
                      <p className="text-xs text-green-600 line-clamp-1">
                        💡 {p.verificationResult.tips}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground">
                      by {p.userName ?? "Anonymous"} ·{" "}
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
