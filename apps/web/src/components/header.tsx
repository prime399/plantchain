import { Link } from "@tanstack/react-router";
import { TreePine, Leaf } from "lucide-react";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/feed", label: "Feed" },
    { to: "/submit", label: "Plant a Tree" },
    { to: "/dashboard", label: "Dashboard" },
  ] as const;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1.5 font-bold text-green-500">
            <TreePine className="h-5 w-5" />
            PlantChain
          </Link>
          <nav className="hidden sm:flex gap-4 text-sm text-muted-foreground">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/submit"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-green-500 text-white rounded-full px-3 py-1.5 font-medium hover:bg-green-600 transition-colors"
          >
            <Leaf className="h-3 w-3" />
            Log Planting
          </Link>
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
