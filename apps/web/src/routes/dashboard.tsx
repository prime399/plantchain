import { api } from "@plantchain-new/backend/convex/_generated/api";
import { buttonVariants } from "@plantchain-new/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import { CheckCircle2, Clock, XCircle, TreePine, Loader2, Leaf } from "lucide-react";
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
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-500/10 rounded-full px-2 py-0.5">
        <CheckCircle2 className="h-3 w-3" /> Verified
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 rounded-full px-2 py-0.5">
        <XCircle className="h-3 w-3" /> Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-500 bg-yellow-500/10 rounded-full px-2 py-0.5">
      <Clock className="h-3 w-3" /> Pending
    </span>
  );
}

function DashboardContent() {
  const myPlantings = useQuery(api.plantings.listMine);
  const stats = useQuery(api.plantings.stats);

  const myVerified = myPlantings?.filter((p) => p.status === "verified").length ?? 0;
  const myPending = myPlantings?.filter((p) => p.status === "pending").length ?? 0;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TreePine className="h-6 w-6 text-green-500" />
          My Dashboard
        </h1>
        <UserMenu />
      </div>

      {/* Personal stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-green-500">{myVerified}</div>
          <div className="text-xs text-muted-foreground mt-1">My Verified Trees</div>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">{myPending}</div>
          <div className="text-xs text-muted-foreground mt-1">Pending Review</div>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <div className="text-2xl font-bold">{stats?.totalVerified ?? "..."}</div>
          <div className="text-xs text-muted-foreground mt-1">Global Trees</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Plantings</h2>
        <Link to="/submit" className={buttonVariants({ size: "sm" })}>
          <Leaf className="h-4 w-4 mr-1" />
          Add New
        </Link>
      </div>

      {myPlantings === undefined ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : myPlantings.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center space-y-3">
          <TreePine className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">You haven't logged any plantings yet.</p>
          <Link to="/submit" className={buttonVariants()}>Log your first tree</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {myPlantings.map((p) => (
            <div key={p._id} className="rounded-xl border bg-card overflow-hidden flex">
              {p.photoUrl && (
                <img
                  src={p.photoUrl}
                  alt={p.species}
                  className="w-24 h-24 object-cover flex-shrink-0"
                />
              )}
              <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium truncate">{p.species}</div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="space-y-0.5">
                  {p.verificationResult?.reason && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {p.verificationResult.reason}
                    </p>
                  )}
                  {p.verificationResult?.tips && p.status === "verified" && (
                    <p className="text-xs text-green-600">💡 {p.verificationResult.tips}</p>
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
        <div className="max-w-md mx-auto py-8 px-4 space-y-4">
          {showSignIn ? (
            <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
          ) : (
            <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
          )}
        </div>
      </Unauthenticated>
      <AuthLoading>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AuthLoading>
    </div>
  );
}
