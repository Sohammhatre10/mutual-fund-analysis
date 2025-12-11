import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/app")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Logo size="sm" />
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Theme Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Choose your preferred color theme
            </p>
            <div className="grid grid-cols-3 gap-3">
              <ThemeOption
                icon={<Sun className="h-5 w-5" />}
                label="Light"
                active={theme === "light"}
                onClick={() => setTheme("light")}
              />
              <ThemeOption
                icon={<Moon className="h-5 w-5" />}
                label="Dark"
                active={theme === "dark"}
                onClick={() => setTheme("dark")}
              />
              <ThemeOption
                icon={<Monitor className="h-5 w-5" />}
                label="System"
                active={false}
                onClick={() => {
                  const prefersDark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                  ).matches;
                  setTheme(prefersDark ? "dark" : "light");
                }}
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <Logo size="md" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fund Analyser Pro is your intelligent co-pilot for mutual fund analysis.
              Get AI-powered insights, historical trends, and personalized investment
              strategies to make smarter investment decisions.
            </p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">Version 1.0.0</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ThemeOption({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
