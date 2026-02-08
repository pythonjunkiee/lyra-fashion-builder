import { Link } from "react-router-dom";
import { Scissors, Ruler, Truck, Clock, CheckCircle, HelpCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  {
    number: "01",
    title: "Choose Your Mukhawar",
    description: "Browse our collection and select your perfect piece. Add it to your bag with the Stitch & Style option.",
    icon: CheckCircle,
  },
  {
    number: "02",
    title: "Submit Your Measurements",
    description: "Enter your measurements or use our size guide. Our team will reach out if clarification is needed.",
    icon: Ruler,
  },
  {
    number: "03",
    title: "Expert Tailoring",
    description: "Our skilled artisans stitch your Mukhawar with precision and care, ensuring a perfect fit.",
    icon: Scissors,
  },
  {
    number: "04",
    title: "Fast Delivery",
    description: "Your beautifully stitched Mukhawar is delivered to your door within 2-3 business days.",
    icon: Truck,
  },
];

const faqs = [
  {
    question: "How long does the stitching service take?",
    answer: "Our Stitch & Style service takes 2-3 business days from the time we receive your order. During peak seasons (Ramadan, Eid), delivery may take up to 5 business days.",
  },
  {
    question: "What measurements do I need to provide?",
    answer: "You'll need to provide bust, waist, hip, length, and sleeve measurements. We also accept custom notes for specific adjustments like neckline depth or sleeve style.",
  },
  {
    question: "Can I make alterations after stitching?",
    answer: "Minor alterations can be made at our branches for a small fee. Major alterations may require additional time and cost.",
  },
  {
    question: "Is the stitching service available for all products?",
    answer: "Yes! All Mukhawars in our collection are eligible for the Stitch & Style service. The flat rate of AED 40 applies to all styles.",
  },
  {
    question: "What if the stitched item doesn't fit?",
    answer: "If your measurements were submitted correctly and the item doesn't fit, we'll make adjustments free of charge. Please contact our customer care within 7 days of receiving your order.",
  },
  {
    question: "Can I return a stitched item?",
    answer: "Stitched items are made-to-measure and are final sale. However, we're committed to ensuring your satisfaction and will work with you on alterations if needed.",
  },
];

const StitchStyle = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-16 md:py-24 overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-body font-medium tracking-wide bg-lyra-gold text-white rounded-full">
              Premium Service
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-6">
              Stitch & Style
              <br />
              <span className="font-medium">Perfect Fit, Delivered</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Experience the luxury of made-to-measure fashion. Send us your measurements, 
              and we'll stitch your Mukhawar to perfection—delivered in just 2-3 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-lyra-gold hover:bg-lyra-gold/90 text-white font-body tracking-wide"
                asChild
              >
                <Link to="/shop/mukhawar">Shop Now</Link>
              </Button>
              <div className="flex items-center justify-center gap-2 font-body">
                <span className="text-3xl font-display font-semibold">AED 40</span>
                <span className="text-primary-foreground/60">flat rate</span>
              </div>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full border border-primary-foreground/10" />
        <div className="absolute bottom-1/4 right-10 w-24 h-24 rounded-full bg-lyra-gold/20" />
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
              How It Works
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to your perfectly fitted Mukhawar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative text-center group"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
                )}
                
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-lyra-gold/10 flex items-center justify-center group-hover:bg-lyra-gold/20 transition-colors">
                  <step.icon className="h-10 w-10 text-lyra-gold" />
                </div>
                <span className="font-display text-4xl font-light text-muted-foreground/30 block mb-2">
                  {step.number}
                </span>
                <h3 className="font-display text-xl font-medium mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-12 bg-lyra-cream/50">
        <div className="container">
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Scissors className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-display text-lg font-medium mb-1">Expert Tailoring</h4>
              <p className="font-body text-sm text-muted-foreground">
                Skilled artisans with years of experience
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-display text-lg font-medium mb-1">Fast Turnaround</h4>
              <p className="font-body text-sm text-muted-foreground">
                Ready and delivered in 2-3 days
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-display text-lg font-medium mb-1">Satisfaction Guaranteed</h4>
              <p className="font-body text-sm text-muted-foreground">
                Free alterations if measurements are correct
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="font-body text-muted-foreground">
                One flat rate for all Mukhawar styles
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 lyra-shadow-elegant">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                <div>
                  <h3 className="font-display text-2xl font-medium mb-1">Stitch & Style Service</h3>
                  <p className="font-body text-muted-foreground">Custom stitching for any Mukhawar</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-4xl font-semibold text-primary">AED 40</span>
                  <p className="font-body text-sm text-muted-foreground">per item</p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 font-body">
                  <CheckCircle className="h-5 w-5 text-lyra-gold flex-shrink-0" />
                  <span>Custom measurements stitching</span>
                </li>
                <li className="flex items-center gap-3 font-body">
                  <CheckCircle className="h-5 w-5 text-lyra-gold flex-shrink-0" />
                  <span>Professional finishing</span>
                </li>
                <li className="flex items-center gap-3 font-body">
                  <CheckCircle className="h-5 w-5 text-lyra-gold flex-shrink-0" />
                  <span>Quality inspection before shipping</span>
                </li>
                <li className="flex items-center gap-3 font-body">
                  <CheckCircle className="h-5 w-5 text-lyra-gold flex-shrink-0" />
                  <span>2-3 business days delivery</span>
                </li>
                <li className="flex items-center gap-3 font-body">
                  <CheckCircle className="h-5 w-5 text-lyra-gold flex-shrink-0" />
                  <span>Free alterations for measurement errors*</span>
                </li>
              </ul>

              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 font-body tracking-wide"
                asChild
              >
                <Link to="/shop/mukhawar">Start Shopping</Link>
              </Button>

              <p className="font-body text-xs text-muted-foreground text-center mt-4">
                *Alterations for incorrect measurements may incur additional fees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-lyra-cream/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
                Frequently Asked Questions
              </h2>
              <p className="font-body text-muted-foreground">
                Everything you need to know about our Stitch & Style service
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="font-display text-lg text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center">
              <p className="font-body text-muted-foreground mb-4">
                Still have questions? We're here to help.
              </p>
              <Button variant="outline" className="font-body" asChild>
                <Link to="/contact">Contact Customer Care</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
            Ready for Your Perfect Fit?
          </h2>
          <p className="font-body text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Browse our collection and add the Stitch & Style option at checkout.
          </p>
          <Button
            size="lg"
            className="bg-lyra-gold hover:bg-lyra-gold/90 text-white font-body tracking-wide"
            asChild
          >
            <Link to="/shop/mukhawar">Shop Mukhawar</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default StitchStyle;
