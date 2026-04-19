import { api } from "@plantchain-new/backend/convex/_generated/api";
import { buttonVariants } from "@plantchain-new/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import { CheckCircle2, Clock, Leaf, Loader2, TreePine, XCircle } from "lucide-react";
import { useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import UserMenu from "@/components/user-menu";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
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

function DashboardContent() {
  const myPlantings = useQuery(api.plantings.listMine);
  const stats = useQuery(api.plantings.stats);

  const myVerified = myPlantings?.filter((p) => p.status === "verified").length ?? 0;
  const myPending = myPlantings?.filter((p) => p.status === "pending").length ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold flex items-center gap-2.5">
            <TreePine className="h-6 w-6 text-leaf" />
            My Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1 ml-8">Your planting activity and impact</p>
        </div>
        <UserMenu />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            My Verified
          </div>
          <div className="font-serif text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
            {myVerified}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Pending
          </div>
          <div className="font-serif text-3xl font-semibold text-amber-600 dark:text-amber-400">
            {myPending}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Global Trees
          </div>
          <div className="font-serif text-3xl font-semibold">
            {stats?.totalVerified ?? "..."}
          </div>
        </div>
      </div>

      {/* My Plantings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold">My Plantings</h2>
          <Link to="/submit" className={buttonVariants({ size: "sm" })}>
            <Leaf className="h-4 w-4 mr-1.5" />
            Add New
          </Link>
        </div>

        {myPlantings === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-leaf" />
          </div>
        ) : myPlantings.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center space-y-3">
            <TreePine className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">You haven't logged any plantings yet.</p>
            <Link to="/submit" className={buttonVariants()}>
              Log your first tree
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myPlantings.map((p) => (
              <div
                key={p._id}
                className="rounded-xl border bg-card overflow-hidden flex hover:shadow-md transition-shadow"
              >
                {p.photoUrl ? (
                  <img
                    src={p.photoUrl}
                    alt={p.species}
                    className="w-24 h-24 object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 flex-shrink-0 bg-mist dark:bg-forest-mid flex items-center justify-center text-2xl">
                    🌳
                  </div>
                )}
                <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-serif font-semibold truncate">{p.species}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="space-y-0.5">
                    {p.verificationResult?.reason && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {p.verificationResult.reason}
                      </p>
                    )}
                    {p.verificationResult?.tips && p.status === "verified" && (
                      <p className="text-xs text-leaf">💡 {p.verificationResult.tips}</p>
                    )}
                    <div className="text-xs text-muted-foreground">
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

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="overflow-y-auto">
      <Authenticated>
        <DashboardContent />
      </Authenticated>
      <Unauthenticated>
        <div className="max-w-md mx-auto py-10 px-4 space-y-4">
          {showSignIn ? (
            <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
          ) : (
            <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
          )}
        </div>
      </Unauthenticated>
      <AuthLoading>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-leaf" />
        </div>
      </AuthLoading>
    </div>
  );
}
