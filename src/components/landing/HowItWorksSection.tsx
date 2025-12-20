import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Home, ListTodo, UserPlus, Repeat2, PartyPopper } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Home,
    title: "Create a Room",
    description: "Set up a room for your household, team, or any group you want to coordinate with.",
  },
  {
    number: "02",
    icon: UserPlus,
    title: "Invite Members",
    description: "Add family members, roommates, or teammates to your room so everyone can participate.",
  },
  {
    number: "03",
    icon: ListTodo,
    title: "Add Tasks",
    description: "Create tasks with due dates, priorities, and schedules. Assign them manually or let Tidyly do it automatically.",
  },
  {
    number: "04",
    icon: Repeat2,
    title: "Set Up Rotation",
    description: "Choose how tasks rotate between members: random, round-robin, or based on who's least busy.",
  },
  {
    number: "05",
    icon: PartyPopper,
    title: "Stay Organized",
    description: "Get reminders, track progress, and celebrate when tasks are completed. It's that simple!",
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How <span className="font-serif italic">Tidyly</span> works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Getting started takes just a few minutes. Here's how to transform 
            the way you manage tasks.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center gap-8 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Step indicator */}
                  <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-sm z-10" />

                  {/* Content */}
                  <div className={`flex-1 ml-20 md:ml-0 ${isEven ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                    <div className={`inline-flex items-center gap-3 mb-2 ${isEven ? "md:flex-row-reverse" : ""}`}>
                      <span className="text-sm font-mono text-primary">{step.number}</span>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon size={20} className="text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                      {step.description}
                    </p>
                  </div>

                  {/* Spacer for desktop layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
