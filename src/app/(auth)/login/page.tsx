"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuthStore();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [email, setEmail] = useState("user@email.com");
  const [password, setPassword] = useState("12312344");
  const [error, setError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const validate = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email.trim()) {
        setError("Email is required");
        return;
      }

      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (!password.trim()) {
        setError("Password is required");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      setError(null);
    };

    if (hasInteracted) {
      validate();
    }
  }, [email, password, hasInteracted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasInteracted(true);

    if (error) {
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <FolderKanban className="size-6" />
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm text-muted-foreground text-center">
              Sign in to your project management account
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setHasInteracted(true);
                }}
                className={error && hasInteracted ? "border-destructive" : ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setHasInteracted(true);
                }}
                className={error && hasInteracted ? "border-destructive" : ""}
                required
              />
            </div>

            {hasInteracted && error && (
              <p className="text-destructive text-xs">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !hasInteracted || (hasInteracted && !!error)}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            <span>Don&lsquo;t have an account? </span>
            <Link
              href="/register"
              className="text-primary underline hover:no-underline"
            >
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
