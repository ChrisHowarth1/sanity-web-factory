// Regenerates starter.ndjson. Edit the content here, then: node templates/seed/build-seed.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

let n = 0;
const key = () => `k${(++n).toString(36).padStart(4, "0")}`;
const link = (label, href) => ({ _type: "link", label, href });
const block = (text, style = "normal") => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

const docs = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "Web Factory",
    description: "A starter site built from shared blocks, edited in Sanity.",
    nav: [
      { ...link("Home", "/"), _key: key() },
      { ...link("About", "/about"), _key: key() },
    ],
    headerCta: link("Get in touch", "/about"),
    footerText: "Built with Next.js, Sanity and Netlify.",
  },
  {
    _id: "theme",
    _type: "theme",
    preset: "neutral",
    mode: "light",
  },
  {
    _id: "page-home",
    _type: "page",
    title: "Home",
    slug: { _type: "slug", current: "home" },
    seo: { title: "Home", description: "A starter site built from shared blocks." },
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        variant: "centered",
        eyebrow: "New variant",
        heading: "A new site, built from blocks you already have",
        body: "Every section on this page is a block from the shared library. Add, reorder and edit them in Sanity, and the site rebuilds when you publish.",
        primaryCta: link("Open the Studio", "/studio"),
        secondaryCta: link("About this site", "/about"),
      },
      {
        _type: "featureGrid",
        _key: key(),
        variant: "cards",
        heading: "What every variant gets",
        intro: "Shared code, separate content. Each site has its own Sanity dataset, theme and Netlify sites.",
        items: [
          { _key: key(), icon: "layers", title: "Shared block library", body: "Hero, features, FAQ, call to action and rich text, all built on shadcn/ui." },
          { _key: key(), icon: "sparkles", title: "Theme in minutes", body: "Pick a preset and a brand colour; the full palette and dark mode are generated for you." },
          { _key: key(), icon: "zap", title: "Static and fast", body: "Production is pre-rendered HTML, rebuilt by a webhook whenever you publish." },
          { _key: key(), icon: "rocket", title: "Live visual editing", body: "Click any text in the preview to edit it, and drag blocks to reorder the page." },
          { _key: key(), icon: "shield", title: "Accessible by default", body: "The theme picker checks every colour pair against WCAG AA before you publish." },
          { _key: key(), icon: "globe", title: "One command to launch", body: "The factory script copies this app into a new variant, ready to connect." },
        ],
      },
      {
        _type: "carousel",
        _key: key(),
        variant: "cards",
        heading: "Built from the same parts",
        intro: "Every variant draws on one shared library. Swap these placeholders for your own images in the Studio.",
        loop: true,
        slides: [
          { _key: key(), _type: "slide", title: "Hero", body: "Centred or split with an image." },
          { _key: key(), _type: "slide", title: "Feature grid", body: "Cards or plain, with icons." },
          { _key: key(), _type: "slide", title: "Carousel", body: "Cards or large images, built on shadcn/ui." },
          { _key: key(), _type: "slide", title: "FAQ", body: "An accessible accordion." },
          { _key: key(), _type: "slide", title: "Call to action", body: "Brand, highlight or subtle panels." },
        ],
      },
      {
        _type: "cta",
        _key: key(),
        variant: "panel",
        heading: "Make this site your own",
        body: "Connect a Sanity project, set your brand colours, and replace this content.",
        link: link("Read the setup steps", "/about"),
      },
      {
        _type: "faq",
        _key: key(),
        heading: "Questions",
        intro: "Common questions about how variants work.",
        items: [
          { _key: key(), question: "Can editors change the page layout?", answer: "Yes. Pages are a list of blocks: editors add, remove and reorder them, and choose each block's layout option. They can't place things freely, which keeps every page on-brand." },
          { _key: key(), question: "When does the live site update?", answer: "When you publish. A Sanity webhook calls a Netlify build hook and the static site rebuilds, usually in under a couple of minutes." },
          { _key: key(), question: "How do I add a new block?", answer: "Add a folder to packages/blocks with its schema, component and query, register it in the index files, then list it in a variant's factory.config.ts." },
        ],
      },
    ],
  },
  {
    _id: "page-about",
    _type: "page",
    title: "About",
    slug: { _type: "slug", current: "about" },
    seo: { title: "About", description: "How this starter site works." },
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        variant: "split",
        eyebrow: "About",
        heading: "How this site works",
        body: "This page uses the split hero layout and a rich text block. Swap in your own image and words in the Studio.",
        primaryCta: link("Back to home", "/"),
      },
      {
        _type: "richText",
        _key: key(),
        content: [
          block("Getting started", "h2"),
          block("Create a Sanity project, copy apps/starter/.env.example to .env.local, and add the project ID. Then run pnpm seed to import this starter content into your dataset."),
          block("Theming", "h2"),
          block("Open the Theme document in the Studio. Choose a preset, set a primary and accent colour, and adjust the corner radius and fonts. The preview above the fields shows the palette and flags any contrast problems."),
          block("Publishing", "h2"),
          block("Production is a static site. Publishing in Sanity triggers a webhook that rebuilds it on Netlify. A separate preview site shows drafts live while you edit."),
        ],
      },
      {
        _type: "cta",
        _key: key(),
        variant: "subtle",
        heading: "Ready to launch a variant?",
        body: "Run pnpm factory:new my-site from the repo root.",
        link: link("Back to home", "/"),
      },
    ],
  },
];

const out = fileURLToPath(new URL("./starter.ndjson", import.meta.url));
writeFileSync(out, docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`Wrote ${docs.length} documents to ${out}`);
