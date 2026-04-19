import { Link } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/feed", label: "Registry" },
    { to: "/submit", label: "Log Planting" },
    { to: "/dashboard", label: "Dashboard" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-forest/95 backdrop-blur-sm border-b border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-leaf rounded-full rounded-bl-none -rotate-45 flex items-center justify-center transition-transform group-hover:rotate-0">
            <div className="w-2.5 h-0.5 bg-white rounded-full rotate-45" />
          </div>
          <span className="font-serif text-lg font-semibold text-mist tracking-tight">
            PlantChain
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-4 h-14 flex items-center text-[0.8rem] font-medium text-sprout uppercase tracking-widest border-b-2 border-transparent hover:text-white transition-colors"
              activeProps={{
                className:
                  "px-4 h-14 flex items-center text-[0.8rem] font-medium text-white uppercase tracking-widest border-b-2 border-gold transition-colors",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Authenticated>
            <Link
              to="/submit"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium bg-gold hover:bg-gold-light text-forest px-3.5 py-2 rounded-lg transition-colors"
            >
              <Leaf className="h-3.5 w-3.5" />
              Plant a Tree
            </Link>
            <UserMenu />
          </Authenticated>
          <Unauthenticated>
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center text-xs font-medium text-sprout hover:text-white border border-white/20 hover:border-white/40 px-3.5 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </Unauthenticated>
          <ModeToggle />
          <button
            className="md:hidden text-mist p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-forest border-t border-white/8 px-4 pb-4">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block py-3 text-sm text-sprout hover:text-white border-b border-white/5 last:border-0"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
