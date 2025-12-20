import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Users, 
  Calendar, 
  Repeat, 
  Bell, 
  BarChart3, 
  Shuffle,
  Trophy,
  Zap,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Rooms for Everyone",
    description: "Create rooms for your household, team, or friends. Everyone stays in sync with shared task lists.",
    color: "primary",
  },
  {
    icon: Shuffle,
    title: "Smart Assignment",
    description: "Automatically rotate tasks fairly with round-robin, random, or least-busy algorithms.",
    color: "accent",
  },
  {
    icon: Repeat,
    title: "Flexible Scheduling",
    description: "Set up recurring tasks daily, weekly, monthly, or with custom intervals that fit your routine.",
    color: "primary",
  },
  {
    icon: Bell,
    title: "Timely Reminders",
    description: "Get notified before, on, or after due dates. Never miss an important task again.",
    color: "accent",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Track completion rates, view history, and spot trends with clear visualizations.",
    color: "primary",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Earn points for completing tasks. Climb leaderboards and stay motivated.",
    color: "accent",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const Icon = feature.icon;
  const isAccent = feature.color === "accent";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover-lift">
        <div 
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
            isAccent 
              ? 'bg-accent/10 text-accent' 
              : 'bg-primary/10 text-primary'
          }`}
        >
          <Icon size={24} />
        </div>
        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

export function FeaturesSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap size={14} />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to stay{" "}
            <span className="font-serif italic">organized</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tidyly combines simple task management with powerful automation to keep 
            your home or team running smoothly.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Additional features list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 p-6 rounded-2xl bg-muted/50 border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock size={20} className="text-primary" />
            <h3 className="font-semibold">And much more...</h3>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Priority levels</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Task notes & history</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Calendar view</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Labels & categories</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Subtasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>API & webhooks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Mobile friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Dark mode</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
