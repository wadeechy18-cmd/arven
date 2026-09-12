import { Hero } from "@/components/home/hero";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { BestSellers } from "@/components/home/best-sellers";
import { BrandStory } from "@/components/home/brand-story";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { LifestyleSection } from "@/components/home/lifestyle-section";
import { NewsletterSection } from "@/components/home/newsletter-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <BestSellers />
      <BrandStory />
      <WhyChooseUs />
      <LifestyleSection />
      <NewsletterSection />
    </>
  );
}
