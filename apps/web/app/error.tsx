"use client";
import { Button } from "@pearos/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="panel">
      <h1>This view is unavailable.</h1>
      <p>Configuration or an upstream request could not be loaded.</p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
