import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <Head>
        <title>Kiki&apos;s Jewelry | Handcrafted in the Bay Area</title>
        <meta name="description" content="Small batch, artisan jewelry designed for the modern woman. Each piece tells a story of elegance and simplicity." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 py-5 transition-all duration-300 ${
        isScrolled ? 'bg-cream bg-opacity-95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="font-serif text-3xl font-medium tracking-wider text-charcoal">
            Kiki&apos;s
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-xs font-medium tracking-wider uppercase transition-colors duration-300 ${
                  router.pathname === item.href 
                    ? 'text-gold' 
                    : 'text-gray hover:text-gold'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* User Account */}
            <Link href="/account" className="text-charcoal hover:text-gold transition-colors">
              <User size={20} />
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart" className="relative text-charcoal hover:text-gold transition-colors">
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="cart-badge">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-charcoal hover:text-gold transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-menu md:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-80 max-w-full bg-cream p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-serif text-3xl font-medium tracking-wider text-charcoal">
                  Kiki&apos;s
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-charcoal hover:text-gold transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="space-y-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg text-charcoal hover:text-gold transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-charcoal text-cream py-15">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start pb-10 border-b border-white border-opacity-10">
            {/* Brand */}
            <div className="mb-8 md:mb-0">
              <span className="font-serif text-3xl font-medium tracking-wider block mb-3">
                Kiki&apos;s
              </span>
              <p className="text-white text-opacity-60 text-sm max-w-sm">
                Handcrafted jewelry for the modern minimalist.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <div className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-white text-opacity-60 text-sm hover:text-gold transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col space-y-2">
                <Link href="/privacy" className="text-white text-opacity-60 text-sm hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-white text-opacity-60 text-sm hover:text-gold transition-colors">
                  Terms of Service
                </Link>
                <Link href="/shipping" className="text-white text-opacity-60 text-sm hover:text-gold transition-colors">
                  Shipping & Returns
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 text-center">
            <p className="text-white text-opacity-40 text-xs">
              © 2026 Kiki&apos;s Jewelry. Made with ♡ in San Francisco.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}