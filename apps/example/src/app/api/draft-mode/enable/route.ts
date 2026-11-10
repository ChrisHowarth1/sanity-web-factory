import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client, env } from "@/sanity/live";

/**
 * Called by the Presentation tool to switch the preview site into draft mode.
 * Only the preview site has a token, so production always answers 404.
 */
const handler = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});

export async function GET(request: Request) {
  if (!env.visualEditing || !process.env.SANITY_API_READ_TOKEN) {
    return new Response(
      "Visual editing is off. Set NEXT_PUBLIC_SANITY_VISUAL_EDITING=true and SANITY_API_READ_TOKEN in .env.local (or the preview site's env), then restart.",
      { status: 404 },
    );
  }
  return handler.GET(request);
}
