"use client";

"use client";

import { motion } from "framer-motion";
import {
  CircuitBoard,
  Cpu,
  Gauge,
  Layers,
  Microchip,
  Radio,
  Settings2,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  BlueprintGrid,
  FloatingParticles,
  GlassPanel,
  MeasurementLine,
  TechLabel,
  WireframeCircle,
} from "@/components/visuals/LabDecor";
import { cn } from "@/lib/utils";

type ComponentSpec = {
  id: string;
  name: string;
  spec: string;
  icon: LucideIcon;
  className?: string;
  delay?: number;
  rotate?: number;
};

const floatingComponents: ComponentSpec[] = [
  {
    id: "arduino",
    name: "Arduino UNO",
    spec: "ATmega328P · 14 DIG",
    icon: Cpu,
    className: "left-[0%] top-[6%]",
    delay: 0,
    rotate: -2,
  },
  {
    id: "esp32",
    name: "ESP32",
    spec: "WiFi/BLE · 38 PIN",
    icon: Radio,
    className: "right-[-2%] top-[4%]",
    delay: 0.8,
    rotate: 3,
  },
  {
    id: "servo",
    name: "Servo MG996R",
    spec: "180° · 10kg·cm",
    icon: Settings2,
    className: "right-[2%] bottom-[14%]",
    delay: 1.4,
    rotate: -1,
  },
  {
    id: "ultrasonic",
    name: "HC-SR04",
    spec: "2–400 cm · 40kHz",
    icon: Gauge,
    className: "left-[4%] bottom-[38%]",
    delay: 0.5,
    rotate: 2,
  },
  {
    id: "motor",
    name: "DC Motor",
    spec: "12V · 300 RPM",
    icon: Zap,
    className: "left-[-1%] bottom-[12%]",
    delay: 1.1,
    rotate: -3,
  },
  {
    id: "rpi",
    name: "Raspberry Pi",
    spec: "ARM · 40 GPIO",
    icon: Microchip,
    className: "right-[18%] top-[38%]",
    delay: 1.7,
    rotate: 1,
  },
  {
    id: "pcb",
    name: "PCB Rev.A",
    spec: "2-Layer · FR4",
    icon: CircuitBoard,
    className: "right-[6%] top-[52%]",
    delay: 0.3,
    rotate: -2,
  },
  {
    id: "gear",
    name: "Gear Assy",
    spec: "M1.5 · 48T",
    icon: Layers,
    className: "left-[10%] top-[42%]",
    delay: 2,
    rotate: 4,
  },
];

function FloatingComponentCard({
  name,
  spec,
  icon: Icon,
  className,
  delay = 0,
  rotate = 0,
}: ComponentSpec) {
  return (
    <motion.div
      className={cn("absolute z-20 w-[132px]", className)}
      style={{ rotate: `${rotate}deg` }}
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <div className="rounded-[14px] border border-white/70 bg-white/55 p-3 shadow-elevated backdrop-blur-xl">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-border/80 bg-background/80">
            <Icon className="h-3.5 w-3.5 text-foreground/70" strokeWidth={1.5} />
          </div>
          <span className="font-heading text-[7px] tracking-wider text-muted-foreground/50">
            RF-{name.slice(0, 3).toUpperCase()}
          </span>
        </div>
        <p className="mt-2 font-heading text-[10px] font-medium tracking-tight">
          {name}
        </p>
        <p className="mt-0.5 text-[9px] text-muted-foreground">{spec}</p>
      </div>
    </motion.div>
  );
}

function WorkstationCore() {
  return (
    <motion.div
      className="relative z-10 w-full max-w-[300px]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <GlassPanel label="Workstation" coord="X:042 Y:018" className="w-full">
          <div className="relative p-4">
            <BlueprintGrid size={12} opacity={0.5} />

            {/* Monitor */}
            <div className="relative mx-auto w-[85%] rounded-[10px] border border-border bg-[#0a0a0a] p-2 shadow-soft">
              <div className="mb-1.5 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="ml-auto font-heading text-[7px] text-white/30">
                  main.ino
                </span>
              </div>
              <div className="space-y-1 rounded-[6px] bg-white/5 p-2 font-mono text-[8px] leading-relaxed text-white/50">
                <p>
                  <span className="text-white/30">void</span> setup() {"{"}
                </p>
                <p className="pl-2">pinMode(9, OUTPUT);</p>
                <p className="pl-2">Serial.begin(9600);</p>
                <p>{"}"}</p>
              </div>
            </div>

            {/* Breadboard */}
            <div className="relative mx-auto mt-3 w-[90%] rounded-[8px] border border-border bg-[#f0ede8] p-2">
              <div className="grid grid-cols-10 gap-[3px]">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      i % 7 === 0 ? "bg-foreground/40" : "bg-foreground/15",
                    )}
                  />
                ))}
              </div>
              <div className="absolute -left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-foreground/20" />
              <div className="absolute -right-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-foreground/20" />
            </div>

            {/* Oscilloscope readout */}
            <div className="mt-3 flex items-end justify-between gap-1 px-1">
              {[40, 65, 30, 80, 45, 70, 35, 90, 50, 60, 75, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-accent/25"
                  style={{ height: `${h * 0.22}px` }}
                />
              ))}
            </div>

            <TechLabel coord="CH-01" className="absolute bottom-2 right-3">
              Signal · 3.3V
            </TechLabel>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}

export function HeroComposition() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <BlueprintGrid size={20} opacity={0.35} />
      <FloatingParticles />
      <WireframeCircle className="left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2" />
      <WireframeCircle className="left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 opacity-60" />

      <MeasurementLine
        orientation="horizontal"
        label="480mm"
        className="left-[8%] right-[8%] top-[4%]"
      />
      <MeasurementLine
        orientation="vertical"
        label="480mm"
        className="bottom-[8%] left-[4%] top-[8%]"
      />

      <TechLabel coord="ORIGIN 0,0" className="absolute left-3 top-3">
        Lab Environment
      </TechLabel>
      <TechLabel className="absolute bottom-3 right-3">
        Build Zone A
      </TechLabel>

      {/* Center workstation */}
      <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <WorkstationCore />
      </div>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.04] blur-3xl" />

      {/* Floating component cards */}
      {floatingComponents.map((comp) => (
        <FloatingComponentCard key={comp.id} {...comp} />
      ))}

      {/* Connection traces */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[22%] top-[20%] h-px w-[28%] border-t border-dashed border-border/60" />
        <div className="absolute right-[18%] top-[22%] h-[30%] w-px border-l border-dashed border-border/60" />
        <div className="absolute bottom-[28%] left-[20%] h-px w-[32%] border-t border-dashed border-border/60" />
      </div>
    </div>
  );
}
