import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { ChevronDown } from 'lucide-react'

// API functions
const fetchFeaturedProducts = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/featured/list?limit=4`)
  if (!response.ok) throw new Error('Failed to fetch featured products')
  return response.json()
}

const fetchCategories = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
  if (!response.ok) throw new Error('Failed to fetch categories')
  return response.json()
}

export default function Home() {
  // Fetch data
  const { data: featuredData, isLoading: featuredLoading } = useQuery(
    'featured-products',
    fetchFeaturedProducts
  )
  
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    'categories',
    fetchCategories
  )

  const featuredProducts = featuredData?.featured_products || []
  const categories = categoriesData?.categories || []

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 pb-16 bg-gradient-to-b from-warm-white to-cream relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <span className="section-label">Handcrafted in the Bay Area</span>
          <h1 className="hero-title font-serif font-light tracking-wider mb-6 text-charcoal">
            Kiki&apos;s Jewelry
          </h1>
          <p className="text-lg text-gray mb-10 max-w-2xl mx-auto leading-relaxed">
            Small batch, artisan jewelry designed for the modern woman.<br />
            Each piece tells a story of elegance and simplicity.
          </p>
          <Link href="/collections" className="btn btn-primary">
            Explore Collections
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-10 flex flex-col items-center space-y-3"
        >
          <span className="text-xs tracking-wider uppercase text-gray">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-16 bg-gradient-to-b from-gold to-transparent"
          />
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-32 bg-warm-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="image-placeholder aspect-[4/5]"
            >
              <span className="text-8xl">✨</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="section-label">Our Story</span>
              <h2 className="section-title font-serif mb-6">Beauty in Simplicity</h2>
              <p className="text-gray mb-5 leading-relaxed">
                Born in San Francisco, Kiki&apos;s Jewelry celebrates the understated elegance of minimalist design. 
                We believe that the most beautiful jewelry doesn&apos;t shout—it whispers.
              </p>
              <p className="text-gray mb-10 leading-relaxed">
                Each piece is handcrafted in our Bay Area studio using ethically sourced materials. 
                From delicate gold chains to sculptural silver earrings, we create jewelry that becomes part of your everyday story.
              </p>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-light-gray">
                <div>
                  <div className="font-serif text-2xl text-charcoal mb-1">100%</div>
                  <div className="text-xs tracking-wider uppercase text-gray">Handcrafted</div>
                </div>
                <div>
                  <div className="font-serif text-2xl text-charcoal mb-1">Local</div>
                  <div className="text-xs tracking-wider uppercase text-gray">Bay Area Made</div>
                </div>
                <div>
                  <div className="font-serif text-2xl text-charcoal mb-1">Ethical</div>
                  <div className="text-xs tracking-wider uppercase text-gray">Materials</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label">Collections</span>
            <h2 className="section-title font-serif">Curated for You</h2>
          </motion.div>

          <div className="product-grid">
            {categoriesLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-warm-white">
                  <div className="aspect-square loading-skeleton mb-6" />
                  <div className="p-6">
                    <div className="h-6 loading-skeleton mb-2" />
                    <div className="h-4 loading-skeleton mb-4 w-3/4" />
                    <div className="h-4 loading-skeleton w-20" />
                  </div>
                </div>
              ))
            ) : (
              categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={`/collections/${category.slug}`} className="block bg-warm-white transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                    <div className="aspect-square image-placeholder">
                      {category.name === 'Golden Hour' && <span className="text-6xl">○</span>}
                      {category.name === 'Pacific Silver' && <span className="text-6xl">◇</span>}
                      {category.name === 'Rose Bloom' && <span className="text-6xl">❋</span>}
                      {category.name === 'Mixed Metals' && <span className="text-6xl">✦</span>}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-serif text-xl mb-2 text-charcoal group-hover:text-gold transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray mb-3 leading-relaxed">
                        {category.description}
                      </p>
                      <span className="text-sm font-medium text-gold-dark">
                        {category.product_count} pieces
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="py-32 bg-charcoal text-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="section-label">Featured</span>
              <h2 className="section-title font-serif mb-6 text-cream">The Signature Piece</h2>
              <p className="text-white text-opacity-70 mb-8 leading-relaxed">
                Our bestselling Crescent Moon Necklace—a delicate 14k gold-filled pendant on a whisper-thin chain. 
                The perfect everyday piece that transitions from coffee runs to cocktail hours.
              </p>
              
              <div className="flex items-center space-x-6">
                <span className="font-serif text-4xl text-gold">$68</span>
                <Link href="/products/crescent-moon-necklace" className="btn btn-secondary">
                  Shop Now
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="aspect-square bg-gradient-to-br from-gray-700 to-charcoal flex items-center justify-center"
            >
              <span className="text-9xl text-gold">☽</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-warm-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="font-serif text-3xl italic text-charcoal mb-5 leading-relaxed">
              &quot;The most beautiful necklace I own. I never take it off.&quot;
            </p>
            <span className="text-sm tracking-wider text-gray">
              — Sarah M., San Francisco
            </span>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="section-label">Get in Touch</span>
              <h2 className="section-title font-serif mb-6">Let&apos;s Connect</h2>
              <p className="text-gray mb-10 leading-relaxed">
                Visit us at our studio in the Mission District, or reach out to schedule a private viewing of our collections.
              </p>

              <div className="space-y-6">
                <div>
                  <div className="text-xs tracking-wider uppercase text-gray mb-1">Studio</div>
                  <div className="font-serif text-xl text-charcoal">Mission District, SF</div>
                </div>
                <div>
                  <div className="text-xs tracking-wider uppercase text-gray mb-1">Email</div>
                  <div className="font-serif text-xl text-charcoal">hello@kikisjewelry.com</div>
                </div>
                <div>
                  <div className="text-xs tracking-wider uppercase text-gray mb-1">Instagram</div>
                  <div className="font-serif text-xl text-charcoal">@kikisjewelry</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <form className="space-y-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="form-input"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="form-input"
                  required
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  className="form-textarea"
                  required
                />
                <button type="submit" className="btn btn-primary w-full">
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}