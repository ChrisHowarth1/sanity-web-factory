import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBuilder } from "@factory/blocks/page-builder";
import { HOME_SLUG } from "@factory/sanity-client";
import { getAllSlugs, getPage } from "@/sanity/fetch";
import { env } from "@/sanity/live";

type Props = { params: Promise<{ slug?: string[] }> };

const toSlug = (segments?: string[]) => (segments?.length ? segments.join("/") : HOME_SLUG);

/** Every published page is generated at build time. */
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug: slug === HOME_SLUG ? [] : slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage(toSlug((await params).slug));
  if (!page) return {};
  const title = page.slug === HOME_SLUG ? undefined : (page.seo?.title ?? page.title);
  return { title, description: page.seo?.description };
}

export default async function Page({ params }: Props) {
  const page = await getPage(toSlug((await params).slug));
  if (!page) notFound();

  return (
    <PageBuilder
      blocks={page.pageBuilder}
      documentId={page._id}
      documentType={page._type}
      studio={{ baseUrl: env.studioUrl, projectId: env.projectId, dataset: env.dataset }}
    />
  );
}
