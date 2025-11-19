import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Lightbulb, BookOpen, Users } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Welcome to StudyFlow.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-card rounded-3xl border-2 border-border shadow-lg">
            <GraduationCap className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-5xl font-bold tracking-tight">StudyFlow</h1>
            <p className="text-xl text-muted-foreground mt-3">
              Start your academic success story
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <Card className="p-6 text-center space-y-3 hover:shadow-lg transition-shadow">
            <GraduationCap className="w-10 h-10 mx-auto" />
            <h3 className="font-semibold text-lg">Smart Planning</h3>
          </Card>
          <Card className="p-6 text-center space-y-3 hover:shadow-lg transition-shadow">
            <Lightbulb className="w-10 h-10 mx-auto" />
            <h3 className="font-semibold text-lg">Focus Mode</h3>
          </Card>
          <Card className="p-6 text-center space-y-3 hover:shadow-lg transition-shadow">
            <BookOpen className="w-10 h-10 mx-auto" />
            <h3 className="font-semibold text-lg">Task Tracking</h3>
          </Card>
          <Card className="p-6 text-center space-y-3 hover:shadow-lg transition-shadow">
            <Users className="w-10 h-10 mx-auto" />
            <h3 className="font-semibold text-lg">Study Groups</h3>
          </Card>
        </div>

        {/* Auth Form */}
        <Card className="p-8 md:p-10 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to continue your learning journey"
                : "Join thousands of successful students"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-14 text-base bg-muted/50"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-14 text-base bg-muted/50"
            />
            <Button
              type="submit"
              className="w-full h-14 text-base font-semibold"
              disabled={loading}
              size="lg"
            >
              {loading
                ? "Loading..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-base hover:underline"
            >
              {isLogin
                ? "Don't have an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
