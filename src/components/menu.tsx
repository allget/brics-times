"use client"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

interface MenuProps {
  onClose: () => void
  onCartClick: () => void
  cartItemCount: number
}

const newsLinks = [
  "ÚLTIMAS",
  "BRASIL",
  "RÚSSIA",
  "ÍNDIA",
  "CHINA",
  "ÁFRICA DO SUL",
  "NOVOS MEMBROS",
  "TODAS AS NOTÍCIAS",
]
const resourceLinks = ["SOBRE O BRICS", "ARQUIVO", "ANÁLISES", "NEWSLETTER", "CONTATO", "CONTA"]

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
}

export function Menu({ onClose, onCartClick, cartItemCount }: MenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 bg-[#1C1C1C] text-white z-50 p-2 md:p-4"
    >
      <div className="max-w-[1440px] mx-auto border-x border-t border-b border-gray-600 h-full flex flex-col">
        <header className="border-b border-gray-600 text-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-24 md:w-48 text-center py-3 md:py-5 border-r border-gray-600">
              <button onClick={onClose} className="tracking-widest font-bold text-xs">
                CLOSE
              </button>
            </div>
            <div className="flex-1 text-center py-3">
              <h1 className="text-lg md:text-2xl tracking-[0.2em] font-normal">BRICS NEWS</h1>
            </div>
            <div className="flex-shrink-0 w-24 md:w-48 text-center py-3 md:py-5 border-l border-gray-600">
              <button onClick={onCartClick} className="tracking-widest font-bold text-xs">
                SALVAS {cartItemCount}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          <div className="border-b md:border-b-0 md:border-r border-gray-600 p-4 md:p-10">
            <h2 className="text-3xl md:text-5xl font-serif mb-6 md:mb-8">Notícias</h2>
            <motion.ul className="space-y-2 md:space-y-4" variants={listVariants} initial="hidden" animate="visible">
              {newsLinks.map((link) => (
                <motion.li key={link} variants={itemVariants}>
                  <a
                    href="#"
                    className="block text-xl md:text-3xl tracking-widest uppercase p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-black hover:text-white"
                  >
                    {link}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </div>
          <div className="p-4 md:p-10">
            <h2 className="text-3xl md:text-5xl font-serif mb-6 md:mb-8">Recursos</h2>
            <motion.ul className="space-y-2 md:space-y-4" variants={listVariants} initial="hidden" animate="visible">
              {resourceLinks.map((link) => (
                <motion.li key={link} variants={itemVariants}>
                  <a
                    href="#"
                    className="block text-2xl md:text-4xl tracking-widest uppercase p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-black hover:text-white"
                  >
                    {link}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </main>

        <footer className="border-t border-gray-600">
          <div className="flex items-center p-4">
            <input
              type="text"
              placeholder="SEARCH"
              className="bg-transparent text-lg tracking-widest placeholder-white w-full focus:outline-none"
            />
            <Search className="h-6 w-6" />
          </div>
        </footer>
      </div>
    </motion.div>
  )
}
