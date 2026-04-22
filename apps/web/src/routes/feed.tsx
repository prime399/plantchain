import { api } from "@plantchain-new/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { CheckCircle2, Clock, Crown, ExternalLink, Fingerprint, MapPin, Medal, ShieldCheck, TreePine, Trophy, XCircle } from "lucide-react";

import { Sapling } from "@/components/svg/tree-illustrations";

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

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-4 w-4 text-amber-500" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-slate-400" />;
  if (rank === 3) return <Trophy className="h-4 w-4 text-amber-700" />;
  return (
    <span className="text-xs font-mono text-muted-foreground w-4 text-center">
      {rank}
    </span>
  );
}

function Leaderboard() {
  const leaderboard = useQuery(api.plantings.leaderboard);

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h2 className="font-serif text-lg font-semibold">Leaderboard</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-7">
          Top planters by verified trees
        </p>
      </div>

      {leaderboard === undefined ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-muted/20 animate-pulse" />
          ))}
        </div>
      ) : leaderboard.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          No verified plantings yet
        </p>
      ) : (
        <div className="space-y-1">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                entry.rank <= 3
                  ? "bg-amber-500/5 dark:bg-amber-500/10"
                  : "hover:bg-muted/30"
              }`}
            >
              <RankIcon rank={entry.rank} />
              <div className="w-7 h-7 rounded-full bg-mist dark:bg-secondary flex items-center justify-center text-[0.65rem] font-semibold text-forest dark:text-foreground flex-shrink-0">
                {entry.userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium truncate flex-1">
                {entry.userName}
              </span>
              <span className="text-sm font-mono text-muted-foreground flex items-center gap-1">
                {entry.count}
                <TreePine className="h-3 w-3 text-leaf" />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TrustProof() {
  const chainStats = useQuery(api.plantings.chainStats);

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-amber-500" />
          <h2 className="font-serif text-lg font-semibold">Trust Proof</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-7">
          Verification and on-chain stats
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
          <Fingerprint className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium">Auth0 M2M Agent</div>
            <div className="text-[0.65rem] text-muted-foreground">
              {chainStats?.totalVerified ?? "—"} verifications logged
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium">Solana Devnet</div>
            <div className="text-[0.65rem] text-muted-foreground">
              {chainStats?.onChainCount ?? "—"} on-chain records
            </div>
          </div>
        </div>

        {chainStats?.recentTxs[0] && (
          <a
            href={`https://explorer.solana.com/tx/${chainStats.recentTxs[0].signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[0.65rem] text-muted-foreground">Latest tx</div>
              <div className="font-mono text-[0.6rem] text-muted-foreground truncate">
                {chainStats.recentTxs[0].signature.slice(0, 12)}...{chainStats.recentTxs[0].signature.slice(-6)}
              </div>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-amber-500 transition-colors shrink-0" />
          </a>
        )}
      </div>
    </div>
  );
}

function FeedRoute() {
  const plantings = useQuery(api.plantings.list, {});

  return (
    <div className="overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-2">
          <TreePine className="h-6 w-6 text-leaf" />
          <h1 className="font-serif text-2xl font-semibold">Planting Registry</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8 ml-9">
          All community plantings, verified by AI
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div>
            {plantings === undefined ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div className="w-full h-44 bg-mist dark:bg-forest-mid flex items-center justify-center">
                        <Sapling className="w-16 h-20 opacity-50" />
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
                          {p.verificationResult.tips}
                        </p>
                      )}

                      {p.status === "verified" && p.verificationResult && (
                        <div className="mt-3 pt-3 border-t border-border space-y-2">
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-violet-500/5 border border-violet-500/20">
                            <Fingerprint className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-[0.6rem] font-medium text-violet-700 dark:text-violet-300">
                                Auth0 Agent Verified
                              </div>
                              <div className="font-mono text-[0.6rem] text-muted-foreground truncate">
                                {p.verificationResult.agentId} · {new Date(p.verificationResult.verifiedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {p.solanaTxSignature && (
                            <a
                              href={`https://explorer.solana.com/tx/${p.solanaTxSignature}?cluster=devnet`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/proof flex items-center gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all"
                            >
                              <ShieldCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <div className="text-[0.6rem] font-medium text-amber-700 dark:text-amber-300">
                                  Solana On-Chain Proof
                                </div>
                                <div className="font-mono text-[0.6rem] text-muted-foreground truncate">
                                  {p.solanaTxSignature.slice(0, 16)}...{p.solanaTxSignature.slice(-8)}
                                </div>
                              </div>
                              <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/proof:text-amber-500 transition-colors shrink-0" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-4 lg:self-start space-y-4">
            <Leaderboard />
            <TrustProof />
          </div>
        </div>
      </div>
    </div>
  );
}
