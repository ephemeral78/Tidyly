import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Check, Users, Calendar, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-24 pb-16">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{ background: 'var(--gradient-hero)' }}
      />
      
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20 mb-8"
        >
          <Sparkles size={16} />
          <span className="text-sm font-medium">Smart task management for everyone</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          <span className="block">Get things done,</span>
          <span className="font-serif italic gradient-text">together</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance"
        >
          Tidyly helps families, teams, and roommates organize tasks with intelligent 
          scheduling and fair distribution. Create rooms, assign tasks, and stay on top of everything.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button variant="hero" size="xl" asChild>
            <a href="/signup">
              Start for free
              <ArrowRight size={20} />
            </a>
          </Button>
          <Button variant="hero-outline" size="xl" asChild>
            <a href="#how-it-works">See how it works</a>
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Check size={16} className="text-accent" />
            <span>Free forever plan</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={16} className="text-accent" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={16} className="text-accent" />
            <span>5 minute setup</span>
          </div>
        </motion.div>

        {/* Preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-2xl p-6 shadow-lg">
            <TaskPreview />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TaskPreview() {
  const tasks = [
    {
      icon: "🧹",
      title: "Vacuum living room",
      assignee: "Sarah",
      due: "Today",
      priority: "P1",
      isDue: true,
    },
    {
      icon: "🗑️",
      title: "Take out trash",
      assignee: "Mike",
      due: "Tomorrow",
      repeat: "Weekly",
      isDue: false,
    },
    {
      icon: "🌿",
      title: "Water the plants",
      assignee: "You",
      due: "In 2 days",
      repeat: "Every 3 days",
      isDue: false,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users size={16} className="text-muted-foreground" />
            <span>Home</span>
          </div>
          <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-md">
            3 members
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} />
          <span>This week</span>
        </div>
      </div>

      {/* Tasks */}
      {tasks.map((task, index) => (
        <motion.div
          key={task.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
        >
          <div className="text-2xl">{task.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{task.title}</span>
              {task.priority && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">
                  {task.priority}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{task.assignee}</span>
              {task.repeat && (
                <>
                  <span>·</span>
                  <span>{task.repeat}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${task.isDue ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              {task.due}
            </span>
            <button className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Check size={16} className="text-accent-foreground" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
