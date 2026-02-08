import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BestSellers } from "@/components/home/BestSellers";
import { StitchStylePromo } from "@/components/home/StitchStylePromo";
import { WhyLyra } from "@/components/home/WhyLyra";
import { CollectionsPreview } from "@/components/home/CollectionsPreview";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategoryGrid />
      <BestSellers />
      <StitchStylePromo />
      <CollectionsPreview />
      <WhyLyra />
    </Layout>
  );
};

export default Index;
