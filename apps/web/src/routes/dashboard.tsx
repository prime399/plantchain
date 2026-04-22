import { api } from "@plantchain-new/backend/convex/_generated/api";
import { Button, buttonVariants } from "@plantchain-new/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Fingerprint,
  Globe,
  Leaf,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import UserMenu from "@/components/user-menu";
import { LeafCluster, Sapling } from "@/components/svg/tree-illustrations";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function StatusBadge({
  status,
}: {
  status: "pending" | "verified" | "rejected";
}) {
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
      <Clock className="h-3 w-3 animate-pulse" />
      Verifying
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <div className={`p-2 rounded-lg ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="font-serif text-3xl font-semibold">{value}</div>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

const DONUT_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

function StatusDonut({
  verified,
  pending,
  rejected,
}: {
  verified: number;
  pending: number;
  rejected: number;
}) {
  const data = [
    { name: "Verified", value: verified },
    { name: "Pending", value: pending },
    { name: "Rejected", value: rejected },
  ].filter((d) => d.value > 0);

  const total = verified + pending + rejected;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell
                key={data[index]?.name}
                fill={DONUT_COLORS[
                  data[index]?.name === "Verified"
                    ? 0
                    : data[index]?.name === "Pending"
                      ? 1
                      : 2
                ] ?? DONUT_COLORS[0]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-serif text-2xl font-semibold">{total}</span>
        <span className="text-[0.65rem] text-muted-foreground">Total</span>
      </div>
    </div>
  );
}

function ActivityChart({
  plantings,
}: {
  plantings: Array<{ createdAt: number; status: string }>;
}) {
  const data = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 14 }, (_, i) => {
      const date = new Date(now - (13 - i) * 86400000);
      const dayStart = new Date(date).setHours(0, 0, 0, 0);
      const dayEnd = dayStart + 86400000;
      const dayPlantings = plantings.filter(
        (p) => p.createdAt >= dayStart && p.createdAt < dayEnd,
      );
      return {
        date: date.toLocaleDateString("en", {
          month: "short",
          day: "numeric",
        }),
        total: dayPlantings.length,
        verified: dayPlantings.filter((p) => p.status === "verified").length,
      };
    });
  }, [plantings]);

  const hasActivity = data.some((d) => d.total > 0);

  if (!hasActivity) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-sm text-muted-foreground gap-2">
        <Leaf className="h-8 w-8 opacity-30" />
        <p>No activity in the last 14 days</p>
        <Link
          to="/submit"
          className="text-leaf hover:underline text-xs"
        >
          Log your first planting
        </Link>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradVerified" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#059669" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={24}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#gradTotal)"
          name="Submitted"
        />
        <Area
          type="monotone"
          dataKey="verified"
          stroke="#059669"
          strokeWidth={2}
          fill="url(#gradVerified)"
          name="Verified"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function DashboardContent() {
  const user = useQuery(api.auth.getCurrentUser);
  const myPlantings = useQuery(api.plantings.listMine);
  const stats = useQuery(api.plantings.stats);
  const [filter, setFilter] = useState<
    "all" | "verified" | "pending" | "rejected"
  >("all");

  const myVerified =
    myPlantings?.filter((p) => p.status === "verified").length ?? 0;
  const myPending =
    myPlantings?.filter((p) => p.status === "pending").length ?? 0;
  const myRejected =
    myPlantings?.filter((p) => p.status === "rejected").length ?? 0;
  const totalMine = myPlantings?.length ?? 0;

  const filtered =
    filter === "all"
      ? myPlantings
      : myPlantings?.filter((p) => p.status === filter);

  const uniqueSpecies = new Set(myPlantings?.map((p) => p.species)).size;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{greeting()}</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold">
            {user?.name ?? "Planter"}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Leaf className="h-3.5 w-3.5 text-leaf" />
            {totalMine > 0
              ? `${myVerified} verified out of ${totalMine} plantings`
              : "Ready to plant your first tree?"}
          </p>
        </div>
        <UserMenu />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Verified"
          value={myVerified}
          icon={CheckCircle2}
          accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          subtitle={
            totalMine > 0
              ? `${Math.round((myVerified / totalMine) * 100)}% success rate`
              : undefined
          }
        />
        <StatCard
          label="Pending"
          value={myPending}
          icon={Clock}
          accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Species"
          value={uniqueSpecies}
          icon={Sparkles}
          accent="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          subtitle="Unique varieties planted"
        />
        <StatCard
          label="Global Trees"
          value={stats?.totalVerified ?? "..."}
          icon={Globe}
          accent="bg-sky-500/10 text-sky-600 dark:text-sky-400"
          subtitle={`${stats?.uniquePlanters ?? "..."} planters worldwide`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-semibold">Activity</h2>
              <p className="text-xs text-muted-foreground">
                Plantings over the last 14 days
              </p>
            </div>
            {myVerified > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                {myVerified} verified
              </div>
            )}
          </div>
          {myPlantings ? (
            <ActivityChart plantings={myPlantings} />
          ) : (
            <div className="h-[200px] animate-pulse rounded bg-muted/20" />
          )}
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-2">
          <h2 className="font-serif text-lg font-semibold">Breakdown</h2>
          <p className="text-xs text-muted-foreground">
            Status distribution
          </p>
          <StatusDonut
            verified={myVerified}
            pending={myPending}
            rejected={myRejected}
          />
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Pending</span>
            </div>
            {myRejected > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Rejected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">My Plantings</h2>
          <Link to="/submit" className={buttonVariants({ size: "sm" })}>
            <Leaf className="h-4 w-4 mr-1.5" />
            Log Planting
          </Link>
        </div>

        <div className="flex gap-2">
          {(
            [
              { key: "all", label: "All", count: totalMine },
              { key: "verified", label: "Verified", count: myVerified },
              { key: "pending", label: "Pending", count: myPending },
              { key: "rejected", label: "Rejected", count: myRejected },
            ] as const
          )
            .filter((f) => f.key === "all" || f.count > 0)
            .map((f) => (
              <Button
                key={f.key}
                variant={filter === f.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f.key)}
                className="text-xs"
              >
                {f.label}
                <span className="ml-1.5 text-[0.65rem] opacity-70">
                  {f.count}
                </span>
              </Button>
            ))}
        </div>

        {myPlantings === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl border bg-card h-28 animate-pulse"
              />
            ))}
          </div>
        ) : filtered && filtered.length === 0 && filter === "all" ? (
          <div className="rounded-xl border bg-card p-12 text-center space-y-4 relative overflow-hidden">
            <LeafCluster className="absolute -top-4 -right-4 w-32 opacity-10 rotate-12 pointer-events-none" />
            <Sapling className="w-16 h-20 mx-auto opacity-60" />
            <div className="space-y-2">
              <p className="font-serif text-lg font-semibold">
                Plant your first tree
              </p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Log a planting, snap a photo, and our AI will verify it
                for the permanent registry.
              </p>
            </div>
            <Link to="/submit" className={buttonVariants()}>
              <Leaf className="h-4 w-4 mr-1.5" />
              Get Started
            </Link>
          </div>
        ) : filtered && filtered.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No {filter} plantings
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered?.map((p) => (
              <div
                key={p._id}
                className="group rounded-xl border bg-card overflow-hidden flex hover:shadow-md transition-all"
              >
                {p.photoUrl ? (
                  <img
                    src={p.photoUrl}
                    alt={p.species}
                    className="w-28 h-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-28 flex-shrink-0 bg-mist dark:bg-forest-mid flex items-center justify-center">
                    <Sapling className="w-12 h-16 opacity-40" />
                  </div>
                )}
                <div className="p-4 flex flex-col justify-between flex-1 min-w-0 gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-serif font-semibold truncate">
                        {p.species}
                      </h3>
                      {p.locationName && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{p.locationName}</span>
                        </p>
                      )}
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="space-y-1">
                    {p.verificationResult?.reason && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {p.verificationResult.reason}
                      </p>
                    )}
                    {p.verificationResult?.tips &&
                      p.status === "verified" && (
                        <p className="text-xs text-leaf line-clamp-1">
                          <Sparkles className="h-3 w-3 inline mr-1" />
                          {p.verificationResult.tips}
                        </p>
                      )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {new Date(p.createdAt).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {p.status === "verified" && p.verificationResult && (
                      <div className="space-y-1.5 mt-2">
                        <div className="flex items-center gap-1.5 text-[0.6rem]">
                          <Fingerprint className="h-3 w-3 text-violet-500 shrink-0" />
                          <span className="text-violet-600 dark:text-violet-400 font-medium">Auth0</span>
                          <span className="text-muted-foreground font-mono truncate">
                            {p.verificationResult.agentId}
                          </span>
                        </div>
                        {p.solanaTxSignature && (
                          <a
                            href={`https://explorer.solana.com/tx/${p.solanaTxSignature}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[0.6rem] hover:underline"
                          >
                            <ShieldCheck className="h-3 w-3 text-amber-500 shrink-0" />
                            <span className="text-amber-600 dark:text-amber-400 font-medium">Solana</span>
                            <span className="text-muted-foreground font-mono truncate">
                              {p.solanaTxSignature.slice(0, 12)}...{p.solanaTxSignature.slice(-6)}
                            </span>
                            <ExternalLink className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                          </a>
                        )}
                      </div>
                    )}
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
