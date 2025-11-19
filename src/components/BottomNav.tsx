import { Home, Calendar, CheckSquare, Target } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/scheduler", icon: Calendar, label: "Scheduler" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/focus", icon: Target, label: "Focus" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
