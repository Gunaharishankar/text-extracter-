import React, { useState } from "react";
import { MotionConfig, motion } from "motion/react";
import { cn } from "@/lib/utils";

export const VARIANTS = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["35%", "50%", "50%"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "35%"],
    },
  },
  middle: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
    },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      bottom: ["35%", "50%", "50%"],
      left: "50%",
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "35%"],
      left: "calc(50% + 10px)",
    },
  },
};

export const AnimatedHamburgerButton = ({
  active: activeProp,
  setActive: setActiveProp,
  onClick,
  size = "sm",
  barClassName = "bg-foreground",
  className,
  title,
  ariaLabel = "Toggle sidebar",
  ...props
}) => {
  const [internalActive, setInternalActive] = useState(false);
  const isControlled = activeProp !== undefined;
  const active = isControlled ? activeProp : internalActive;

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!isControlled) {
      setInternalActive((pv) => !pv);
    }
    if (setActiveProp) {
      setActiveProp((pv) => !pv);
    }
  };

  // Sizing configurations
  // "lg" is the original 80px (h-20 w-20) size
  // "sm" is compact (36px / h-9 w-9) ideal for the sidebar / navbar header
  // "xs" is 32px (h-8 w-8)
  // "md" is 48px (h-12 w-12)
  const sizeMap = {
    xs: { button: "h-8 w-8 rounded-lg", scale: 0.38 },
    sm: { button: "h-9 w-9 rounded-lg", scale: 0.44 },
    md: { button: "h-12 w-12 rounded-xl", scale: 0.6 },
    lg: { button: "h-20 w-20 rounded-full", scale: 1 },
  };

  const selectedSize = sizeMap[size] || sizeMap.sm;

  return (
    <MotionConfig
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <motion.button
        type="button"
        initial={false}
        animate={active ? "open" : "closed"}
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-expanded={active}
        title={title || ariaLabel}
        className={cn(
          "relative flex items-center justify-center transition-colors cursor-pointer select-none",
          size === "lg"
            ? "bg-white/0 hover:bg-white/20"
            : "hover:bg-accent/70 hover:text-accent-foreground text-foreground",
          selectedSize.button,
          className
        )}
        {...props}
      >
        <motion.div
          animate={active ? "open" : "closed"}
          className="relative h-20 w-20 shrink-0 origin-center pointer-events-none"
          style={{ transform: `scale(${selectedSize.scale})` }}
        >
          <motion.span
            variants={VARIANTS.top}
            className={cn("absolute h-1 w-10 rounded-full", barClassName)}
            style={{ y: "-50%", left: "50%", x: "-50%", top: "35%" }}
          />
          <motion.span
            variants={VARIANTS.middle}
            className={cn("absolute h-1 w-10 rounded-full", barClassName)}
            style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
          />
          <motion.span
            variants={VARIANTS.bottom}
            className={cn("absolute h-1 w-5 rounded-full", barClassName)}
            style={{
              x: "-50%",
              y: "50%",
              bottom: "35%",
              left: "calc(50% + 10px)",
            }}
          />
        </motion.div>
      </motion.button>
    </MotionConfig>
  );
};

export const Example = () => {
  return (
    <div className="grid h-screen place-content-center bg-gradient-to-br from-violet-500 to-indigo-500">
      <AnimatedHamburgerButton size="lg" barClassName="bg-white" />
    </div>
  );
};

export default AnimatedHamburgerButton;
