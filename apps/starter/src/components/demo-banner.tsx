/** Shown until a Sanity project is connected, so demo content is never mistaken for live. */
export function DemoBanner() {
  return (
    <div className="bg-highlight px-4 py-2 text-center text-sm text-highlight-foreground">
      Demo content from <code className="font-mono">templates/seed</code>. Set{" "}
      <code className="font-mono">NEXT_PUBLIC_SANITY_PROJECT_ID</code> in <code className="font-mono">.env.local</code>{" "}
      to connect Sanity.
    </div>
  );
}
