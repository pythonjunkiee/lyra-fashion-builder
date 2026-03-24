import { Layout } from "@/components/layout/Layout";

export default function AboutUs() {
  return (
    <Layout>
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="container text-center">
          <p className="font-display text-2xl md:text-3xl text-muted-foreground">
            scheduled to launch soon
          </p>
        </div>
      </section>
    </Layout>
  );
}
