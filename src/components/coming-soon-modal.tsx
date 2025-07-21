"use client"
import { motion } from "framer-motion"

interface ComingSoonModalProps {
  onClose: () => void
}

export function ComingSoonModal({ onClose }: ComingSoonModalProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white dark:bg-[#1C1C1C] p-12 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-serif mb-4">Feature Coming Soon</h2>
          <button
            onClick={onClose}
            className="mt-6 border border-black dark:border-white px-8 py-3 text-xs font-bold tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
          >
            CLOSE
          </button>
        </motion.div>
      </div>
    </>
  )
}
