"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Cpu,
  Gauge,
  CircuitBoard,
  Radio,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BlueprintGrid } from "@/components/visuals/LabDecor";
import { cn } from "@/lib/utils";

/* ─── Projects Preview ──────────────────────────────────────────── */

const projectSteps = [
  { label: "Wiring", done: true },
  { label: "Code", done: true },
  { label: "Assembly", done: true },
  { label: "Testing", done: false },
];

export function ProjectsPreview() {
  return (
    <div className="relative mt-4 flex flex-1 flex-col gap-3 overflow-hidden rounded-[14px] border border-border/80 bg-background/60 p-3 backdrop-blur-sm">
      <BlueprintGrid size={14} opacity={0.3} />

      <div className="relative flex items-center justify-between">
        <span className="font-heading text-[9px] uppercase tracking-wider text-muted-foreground">
          Line Follower · Step 4/8
        </span>
        <span className="font-heading text-[9px] text-accent">50%</span>
      </div>

      <div className="relative h-1 overflow-hidden rounded-full bg-border">
        <div className="h-full w-1/2 rounded-full bg-foreground/80" />
      </div>

      <div className="relative grid grid-cols-4 gap-1.5">
        {projectSteps.map((step, i) => (
          <div key={step.label} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border text-[8px] font-heading",
                step.done
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted",
              )}
            >
              {i + 1}
            </div>
            <span className="text-[8px] text-muted-foreground">{step.label}</span>
          </div>
        ))}
      </div>

      <div className="relative grid grid-cols-2 gap-2">
        <div className="overflow-hidden rounded-[10px] border border-border">
          <div className="relative aspect-video">
            <Image
              src="https://images.unsplash.com/photo-1535378917022-76240dbc3f92?w=400&q=60&auto=format&fit=crop"
              alt=""
              fill
              className="object-cover grayscale-[30%]"
              sizes="200px"
            />
            <div className="absolute inset-0 bg-foreground/10 mix-blend-multiply" />
          </div>
        </div>
        <div className="rounded-[10px] border border-border bg-[#0a0a0a] p-2 font-mono text-[7px] leading-relaxed text-white/50">
          <p>
            <span className="text-white/30">int</span> left = A0;
          </p>
          <p>
            <span className="text-white/30">int</span> right = A1;
          </p>
          <p>if (left &lt; 500) {"{"}</p>
          <p className="pl-2">turnLeft();</p>
          <p>{"}"}</p>
        </div>
      </div>

      <div className="relative rounded-[10px] border border-border bg-surface p-2">
        <span className="font-heading text-[8px] uppercase tracking-wider text-muted-foreground">
          Circuit Preview
        </span>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-6 w-10 rounded border border-border bg-[#1a6b3c]/20" />
          <div className="h-px flex-1 border-t border-dashed border-foreground/20" />
          <div className="h-5 w-5 rounded-full border border-border" />
          <div className="h-px w-6 border-t border-dashed border-foreground/20" />
          <div className="h-4 w-8 rounded border border-border bg-foreground/5" />
        </div>
      </div>
    </div>
  );
}

/* ─── Component Library Preview ─────────────────────────────────── */

type ComponentItem = {
  name: string;
  pins: string;
  category: string;
  icon: LucideIcon;
  offset: string;
  z: number;
};

const libraryComponents: ComponentItem[] = [
  { name: "Arduino UNO", pins: "14 DIG", category: "MCU", icon: Cpu, offset: "translate-x-0 translate-y-0", z: 30 },
  { name: "ESP32-WROOM", pins: "38 PIN", category: "WiFi", icon: Radio, offset: "translate-x-3 translate-y-4", z: 20 },
  { name: "HC-SR04", pins: "4 PIN", category: "Sensor", icon: Gauge, offset: "translate-x-6 translate-y-8", z: 10 },
  { name: "L298N", pins: "15 PIN", category: "Driver", icon: CircuitBoard, offset: "translate-x-9 translate-y-12", z: 0 },
];

export function ComponentLibraryPreview() {
  return (
    <div className="relative mt-4 h-[160px] flex-1">
      <BlueprintGrid size={12} opacity={0.25} />
      {libraryComponents.map((comp, i) => {
        const Icon = comp.icon;
        return (
          <motion.div
            key={comp.name}
            className={cn(
              "absolute left-0 top-0 w-[calc(100%-36px)] rounded-[12px] border border-white/70 bg-white/60 p-2.5 shadow-soft backdrop-blur-md",
              comp.offset,
            )}
            style={{ zIndex: comp.z }}
            animate={{ y: [0, -4 - i, 0] }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border border-border/80 bg-background/80">
                <Icon className="h-3.5 w-3.5 text-foreground/60" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-[10px] font-medium">
                  {comp.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-[8px] text-muted-foreground">
                    {comp.pins}
                  </span>
                  <span className="rounded-[4px] bg-foreground/5 px-1.5 py-px font-heading text-[7px] uppercase tracking-wider text-muted">
                    {comp.category}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── AI Chat Preview ───────────────────────────────────────────── */

export function AIChatPreview() {
  return (
    <div className="relative mt-4 flex flex-1 flex-col overflow-hidden rounded-[14px] border border-border bg-background shadow-soft">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </div>
        <span className="mx-auto font-heading text-[10px] text-muted-foreground">
          RoboForge AI
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <div className="max-w-[85%] self-end rounded-[12px] rounded-br-[4px] bg-foreground px-3 py-2">
          <p className="text-[10px] leading-relaxed text-background">
            Why isn&apos;t my HC-SR04 returning distance values?
          </p>
        </div>

        <div className="max-w-[90%] rounded-[12px] rounded-bl-[4px] border border-border bg-surface px-3 py-2">
          <p className="text-[10px] leading-relaxed text-muted">
            Check your trigger pin is set to OUTPUT and echo to INPUT. Add a
            15µs delay after the trigger pulse.
          </p>
          <div className="mt-2 overflow-hidden rounded-[8px] bg-[#0a0a0a] p-2 font-mono text-[8px] leading-relaxed text-white/50">
            <p>
              <span className="text-white/30">digitalWrite</span>(TRIG, HIGH);
            </p>
            <p>
              <span className="text-white/30">delayMicroseconds</span>(15);
            </p>
            <p>
              <span className="text-white/30">digitalWrite</span>(TRIG, LOW);
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-t border-border bg-surface/50 p-2">
        {["Debug Circuit", "Generate Code", "Fix Wiring"].map((prompt) => (
          <span
            key={prompt}
            className="rounded-full border border-border bg-background px-2 py-0.5 text-[8px] text-muted-foreground"
          >
            {prompt}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Roadmap Preview ───────────────────────────────────────────── */

const roadmapSteps = [
  "Electronics",
  "Arduino",
  "Sensors",
  "Programming",
  "Robotics",
  "AI Robotics",
] as const;

export function RoadmapPreview() {
  return (
    <div className="relative mt-5 flex flex-1 flex-col items-center py-2">
      <div className="absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 bg-border" />
      <div className="absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-accent/30 to-accent/50" />

      {roadmapSteps.map((step, i) => {
        const isActive = i === roadmapSteps.length - 2;
        const isComplete = i < roadmapSteps.length - 2;

        return (
          <div key={step} className="relative z-10 flex flex-col items-center py-2">
            <motion.div
              className={cn(
                "relative flex items-center gap-2 rounded-[10px] border px-4 py-2 font-heading text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm",
                isActive
                  ? "border-accent/30 bg-white/80 text-foreground"
                  : isComplete
                    ? "border-border bg-background/80 text-muted"
                    : "border-border/60 bg-surface/60 text-muted-foreground",
              )}
              animate={
                isActive
                  ? { scale: [1, 1.02, 1] }
                  : undefined
              }
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {isActive && (
                <>
                  <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                  <span className="absolute inset-0 rounded-[10px] shadow-glow" />
                </>
              )}
              {step}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Community Network ─────────────────────────────────────────── */

const networkNodes = [
  { x: 20, y: 50, size: 6 },
  { x: 50, y: 25, size: 8 },
  { x: 80, y: 45, size: 7 },
  { x: 35, y: 75, size: 5 },
  { x: 65, y: 70, size: 6 },
  { x: 90, y: 20, size: 4 },
];

const networkEdges = [
  [0, 1], [1, 2], [0, 3], [3, 4], [2, 4], [1, 5], [2, 5],
];

export function CommunityNetwork() {
  return (
    <div className="relative mt-2 h-[140px] w-full overflow-hidden rounded-[14px] border border-border/60 bg-background/40 backdrop-blur-sm">
      <BlueprintGrid size={16} opacity={0.2} />
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {networkEdges.map(([a, b], i) => (
          <line
            key={i}
            x1={`${networkNodes[a].x}%`}
            y1={`${networkNodes[a].y}%`}
            x2={`${networkNodes[b].x}%`}
            y2={`${networkNodes[b].y}%`}
            stroke="rgba(37,99,235,0.15)"
            strokeWidth="1"
          />
        ))}
      </svg>
      {networkNodes.map((node, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-foreground"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(37,99,235,0)",
              "0 0 0 4px rgba(37,99,235,0.15)",
              "0 0 0 0 rgba(37,99,235,0)",
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Why RoboForge pillar previews ─────────────────────────────── */

export function LearnPreview() {
  return (
    <div className="relative h-28 w-full overflow-hidden rounded-[12px] border border-border/60 bg-background/50 p-3 backdrop-blur-sm">
      <BlueprintGrid size={10} opacity={0.3} />
      <div className="relative flex items-center justify-between">
        <span className="font-heading text-[9px] uppercase tracking-wider text-muted-foreground">
          Module 03
        </span>
        <span className="font-heading text-[9px] text-foreground">68%</span>
      </div>
      <div className="relative mt-2 h-1 rounded-full bg-border">
        <div className="h-full w-[68%] rounded-full bg-foreground/70" />
      </div>
      <div className="relative mt-3 space-y-1.5">
        {["Ohm's Law", "LED Circuits", "Resistor Codes"].map((item, i) => (
          <div key={item} className="flex items-center gap-2 text-[9px] text-muted">
            <span className={cn("h-1 w-1 rounded-full", i < 2 ? "bg-foreground" : "bg-border")} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PracticePreview() {
  return (
    <div className="relative h-28 w-full overflow-hidden rounded-[12px] border border-border/60 bg-[#0a0a0a] p-3">
      <div className="font-heading text-[8px] text-white/30">lab_session.sh</div>
      <div className="mt-2 space-y-1 font-mono text-[8px] leading-relaxed text-white/45">
        <p>
          <span className="text-emerald-400/70">✓</span> Upload firmware
        </p>
        <p>
          <span className="text-emerald-400/70">✓</span> Calibrate sensor
        </p>
        <p>
          <span className="text-amber-400/70">→</span> Run motor test...
        </p>
      </div>
      <div className="absolute bottom-2 right-2 flex gap-0.5">
        {[3, 5, 2, 6, 4].map((h, i) => (
          <div key={i} className="w-1 rounded-full bg-accent/40" style={{ height: `${h * 3}px` }} />
        ))}
      </div>
    </div>
  );
}

export function BuildPreview() {
  return (
    <div className="relative h-28 w-full overflow-hidden rounded-[12px] border border-border/60 bg-background/50 p-3 backdrop-blur-sm">
      <BlueprintGrid size={10} opacity={0.3} />
      <div className="relative flex items-center justify-between">
        <span className="font-heading text-[9px] uppercase tracking-wider">
          Project Status
        </span>
        <span className="rounded-[4px] bg-foreground/5 px-1.5 py-px font-heading text-[7px] uppercase tracking-wider text-muted">
          Active
        </span>
      </div>
      <div className="relative mt-3 grid grid-cols-3 gap-2">
        {[
          { label: "Wiring", val: "Done" },
          { label: "Code", val: "Done" },
          { label: "Test", val: "Live" },
        ].map((item) => (
          <div key={item.label} className="rounded-[8px] border border-border bg-surface p-1.5 text-center">
            <p className="font-heading text-[8px] text-muted-foreground">{item.label}</p>
            <p className="mt-0.5 font-heading text-[9px] font-medium">{item.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
