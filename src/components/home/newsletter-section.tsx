import { NewsletterForm } from "@/components/home/newsletter-form";

export function NewsletterSection() {
  return (
    <section className="section-y bg-secondary/30">
      <div className="container-wide flex flex-col items-center gap-6 text-center">
        <p className="eyebrow">Stay Close</p>
        <h2 className="max-w-md font-serif text-3xl text-foreground sm:text-4xl">
          Join our journey.
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          New arrivals, workshop notes, and the occasional early-access sale — no more than twice a month.
        </p>
        <NewsletterForm />
      </div>
    </section>
  );
}
