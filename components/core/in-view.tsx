"use client"

import { motion, Transition, Variants } from "framer-motion"

interface InViewProps {
  children: React.ReactNode
  variants?: Variants
  transition?: Transition
  viewOptions?: {
    once?: boolean
    margin?: string
    amount?: number | "some" | "all"
  }
  className?: string
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions,
  className,
}: InViewProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={variants}
      transition={transition}
      viewport={viewOptions}
      className={className}
    >
      {children}
    </motion.div>
  )
}
