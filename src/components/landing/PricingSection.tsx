import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    period: "forever",
    features: [
      "Up to 2 rooms",
      "5 members per room",
      "Basic scheduling",
      "Task history (30 days)",
      "Email reminders",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Plus",
    description: "For active households & teams",
    price: "$5",
    period: "per month",
    features: [
      "Unlimited rooms",
      "Unlimited members",
      "Advanced scheduling",
      "Full task history",
      "Priority notifications",
      "Calendar integration",
      "Analytics dashboard",
      "API access",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Team",
    description: "For larger organizations",
    price: "$12",
    period: "per user/month",
    features: [
      "Everything in Plus",
      "Admin controls",
      "SSO authentication",
      "Advanced permissions",
      "Priority support",
      "Custom integrations",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, transparent{" "}
            <span className="font-serif italic">pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start for free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 lg:p-8 ${
                plan.highlighted
                  ? "bg-card border-2 border-primary shadow-lg"
                  : "bg-card border border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    <Sparkles size={12} />
                    <span>Most popular</span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">/{plan.period}</span>
              </div>

              <Button 
                variant={plan.highlighted ? "hero" : "outline"} 
                className="w-full mb-6"
              >
                {plan.cta}
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* FAQ teaser */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          Have questions?{" "}
          <a href="#" className="text-primary hover:underline">
            Check our FAQ
          </a>{" "}
          or{" "}
          <a href="#" className="text-primary hover:underline">
            contact support
          </a>
        </motion.p>
      </div>
    </section>
  );
}
