import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, Target, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

export default function Landing() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser(username.trim());
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(168,76%,42%,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(168,76%,42%,0.05),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm">
              Documentation
            </Button>
            <Button variant="ghost" className="text-sm">
              Pricing
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            AI-Powered Investment Analysis
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Your intelligent co-pilot for{" "}
            <span className="text-gradient">mutual fund analysis</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up [animation-delay:0.1s]">
            Unlock market insights, historical trends, and personalized investment
            strategies with cutting-edge AI. Make smarter investment decisions today.
          </p>

          {/* Sign In Form */}
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto animate-slide-up [animation-delay:0.2s]"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 h-14 text-base px-6"
                required
              />
              <Button
                type="submit"
                variant="hero"
                size="xl"
                disabled={loading || !username.trim()}
                className="gap-2"
              >
                {loading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                ) : (
                  <>
                    Access Platform
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Advanced Analytics"
            description="AI-driven insights with comprehensive data visualization for informed decision making."
            delay="0.3s"
          />
          <FeatureCard
            icon={<Target className="h-6 w-6" />}
            title="Personalized Strategies"
            description="Tailored investment recommendations based on your goals and risk tolerance."
            delay="0.4s"
          />
          <FeatureCard
            icon={<TrendingUp className="h-6 w-6" />}
            title="Real-time Insights"
            description="Stay ahead with live market data and instant fund performance tracking."
            delay="0.5s"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 Fund Analyser Pro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-glow transition-all duration-300 animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
