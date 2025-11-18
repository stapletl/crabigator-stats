"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { validateApiKey } from "@/lib/wanikani/api";
import { useAppStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { StoragePreferenceSelect } from "@/components/storage-preference-select";

export default function Home() {
  const router = useRouter();
  const { setApiKey, setUser, setIsValidating } = useAppStore();

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [storagePreference, setStoragePreference] = useState<
    "session" | "local"
  >("session");
  const [isValidating, setIsValidatingLocal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKeyInput.trim()) {
      toast.error("Please enter your API key");
      return;
    }

    setIsValidatingLocal(true);
    setIsValidating(true);

    try {
      const result = await validateApiKey(apiKeyInput.trim());

      if (!result.valid) {
        toast.error(result.error || "Invalid API key");
        setApiKeyInput("");
        setIsValidatingLocal(false);
        setIsValidating(false);
        return;
      }

      if (result.user) {
        // Store API key and user data
        setApiKey(apiKeyInput.trim(), storagePreference);
        setUser(result.user);

        // Update localStorage/sessionStorage based on preference
        const storage =
          storagePreference === "local" ? localStorage : sessionStorage;
        storage.setItem("crabigator-api-key", apiKeyInput.trim());
        storage.setItem("crabigator-storage-preference", storagePreference);

        toast.success(`Welcome back, ${result.user.data.username}! 🦀`);

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard/progress");
        }, 500);
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsValidatingLocal(false);
      setIsValidating(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <main className="flex flex-col items-center justify-center gap-8 text-center w-full max-w-4xl">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Crabigator <LineShadowText>Stats</LineShadowText>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
            A comprehensive statistics dashboard for WaniKani users. Track your
            progress, analyze your learning patterns, and visualize your journey
            to Japanese mastery.
          </p>
        </div>

        {/* API Key Input Card */}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Enter your WaniKani API key to begin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* API Key Input */}
              <div className="space-y-2">
                <Label htmlFor="apiKey">WaniKani API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    placeholder="Enter your API key"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="pr-10"
                    disabled={isValidating}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    disabled={isValidating}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You can find your API key in your{" "}
                  <a
                    href="https://www.wanikani.com/settings/personal_access_tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    WaniKani settings
                  </a>
                </p>
              </div>

              {/* Storage Preference */}
              <div className="space-y-3">
                <Label>Storage Preference</Label>{" "}
                <StoragePreferenceSelect
                  value={storagePreference}
                  onChange={setStoragePreference}
                  disabled={isValidating}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {storagePreference === "session"
                    ? "Your API key will be stored only for this session"
                    : "Your API key will be remembered on this device"}
                </p>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isValidating}>
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Carousel */}
        {/* <div className="w-full">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Preview of your statistics dashboard:
          </p>
          <DemoCarousel />
        </div> */}

        {/* Footer */}
        <p className="text-xs text-slate-500 dark:text-slate-500">
          This app requires a full WaniKani subscription (Level 60 access). Not
          affiliated with WaniKani.
        </p>
      </main>
    </div>
  );
}
