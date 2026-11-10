import { Button } from "@factory/ui/components/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-32 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">This page doesn’t exist</h1>
      <Button asChild variant="outline">
        <a href="/">Back to home</a>
      </Button>
    </section>
  );
}
