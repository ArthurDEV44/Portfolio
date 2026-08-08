"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-foreground text-4xl font-bold">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-4 max-w-md">
        Something broke. You can try again or go back to the homepage.
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
        <Button onClick={() => (window.location.href = "/")}>Home</Button>
      </div>
    </div>
  );
}
