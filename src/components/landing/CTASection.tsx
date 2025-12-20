import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div 
          className="relative rounded-3xl p-8 sm:p-12 overflow-hidden"
          style={{ background: 'var(--gradient-primary)' }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-background/20 blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-background/20 blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/20 text-primary-foreground text-sm font-medium mb-6">
              <Sparkles size={14} />
              <span>Start for free today</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Ready to get{" "}
              <span className="font-serif italic">organized?</span>
            </h2>

            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-lg">
              Join thousands of households and teams who use Tidyly to stay on top 
              of their tasks. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="xl" 
                className="bg-background text-foreground hover:bg-background/90 shadow-lg"
              >
                Get started for free
                <ArrowRight size={20} />
              </Button>
              <Button 
                size="xl" 
                variant="ghost"
                className="text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/10"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
