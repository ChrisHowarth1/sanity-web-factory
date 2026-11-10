"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

/** The Studio is a client-side app; keeping its config import here keeps it out of server bundles. */
export function Studio() {
  return <NextStudio config={config} />;
}
