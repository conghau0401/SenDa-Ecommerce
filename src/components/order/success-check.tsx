"use client";

import { motion } from "motion/react";

/** Dấu tick vẽ dần khi đặt hàng thành công */
export function SuccessCheck() {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 12, stiffness: 180 }}
      className="relative flex size-20 items-center justify-center rounded-full bg-leaf-600 shadow-lift"
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-leaf-400"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 1.6, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.2, repeat: 1 }}
        aria-hidden
      />
      <svg viewBox="0 0 24 24" className="relative size-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden>
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}
