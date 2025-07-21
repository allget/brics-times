"use client"
import { motion } from "framer-motion"
import { X, Plus, Minus } from "lucide-react"
import type { CartItem } from "@/types"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveItem: (id: number) => void
  subtotal: number
  onCheckout: () => void
}

export function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  subtotal,
  onCheckout,
}: CartSidebarProps) {
  if (!isOpen) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#1C1C1C] text-black dark:text-gray-100 z-50 shadow-lg border-l border-gray-300 dark:border-gray-600 flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-serif dark:text-gray-50">Your Cart</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-start p-6 border-b border-gray-300 dark:border-gray-600">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-24 h-24 object-cover mr-4" />
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold dark:text-gray-50">{item.name}</h3>
                      {item.size && <p className="text-sm text-gray-500 dark:text-gray-400">Size: {item.size}</p>}
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-xs uppercase tracking-widest dark:text-gray-300 dark:hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-semibold dark:text-gray-50">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-300 dark:border-gray-600">
            <div className="flex justify-between mb-4">
              <p className="dark:text-gray-100">Subtotal</p>
              <p className="font-semibold dark:text-gray-50">${subtotal.toFixed(2)}</p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Shipping and taxes calculated at checkout</p>
            <button
              onClick={onCheckout}
              className="cursor-pointer w-full bg-black text-white dark:bg-white dark:text-black py-4 text-center text-sm font-bold tracking-widest hover:bg-white dark:hover:bg-zinc-800 dark:hover:text-white hover:text-white transition-colors"
            >
              CHECK OUT
            </button>
          </div>
        )}
      </motion.div>
    </>
  )
}
