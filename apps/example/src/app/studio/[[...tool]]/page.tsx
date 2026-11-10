import { readEnv } from "@factory/sanity-client";
import { Studio } from "./studio";

export const dynamic = "force-static";

export default function StudioPage() {
  if (!readEnv().configured) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 560, margin: "15vh auto", padding: 24, lineHeight: 1.5 }}>
        <h1 style={{ fontSize: 22 }}>Studio not connected yet</h1>
        <p>
          Create a Sanity project, then set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in{" "}
          <code>apps/starter/.env.local</code> and restart the dev server. The README has the steps.
        </p>
      </main>
    );
  }
  return <Studio />;
}
