import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

/** Layout for policy and help pages. */
export function TextPage({
  eyebrow,
  title,
  intro,
  updated,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title}>
        {intro}
      </PageHeader>
      <article className="container-page max-w-3xl py-10 sm:py-14 prose-page">
        {updated && <p className="!text-sm !text-muted">Last updated: {updated}</p>}
        {children}
      </article>
    </>
  );
}
