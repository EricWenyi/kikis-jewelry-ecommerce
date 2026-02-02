import { motion } from 'framer-motion'
import Link from 'next/link'
import { useQuery } from 'react-query'

const fetchCategories = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
  if (!response.ok) throw new Error('Failed to fetch categories')
  return response.json()
}

export default function Collections() {
  const { data: categoriesData, isLoading } = useQuery('categories', fetchCategories)
  const categories = categoriesData?.categories || []

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-32 bg-gradient-to-b from-warm-white to-cream text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-label">Our Collections</span>
            <h1 className="hero-title font-serif font-light tracking-wider mb-6 text-charcoal">
              Handcrafted Beauty
            </h1>
            <p className="text-lg text-gray max-w-2xl mx-auto leading-relaxed">
              Each collection tells a unique story, inspired by the natural beauty and 
              artistic spirit of the San Francisco Bay Area.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="product-grid">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-warm-white">
                  <div className="aspect-square loading-skeleton mb-6" />
                  <div className="p-8">
                    <div className="h-8 loading-skeleton mb-4" />
                    <div className="h-4 loading-skeleton mb-4 w-3/4" />
                    <div className="h-4 loading-skeleton w-24" />
                  </div>
                </div>
              ))
            ) : (
              categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Link 
                    href={`/collections/${category.slug}`} 
                    className="block bg-warm-white transition-all duration-300 hover:shadow-xl hover:-translate-y-3"
                  >
                    <div className="aspect-square image-placeholder">
                      {category.name === 'Golden Hour' && <span className="text-8xl">○</span>}
                      {category.name === 'Pacific Silver' && <span className="text-8xl">◇</span>}
                      {category.name === 'Rose Bloom' && <span className="text-8xl">❋</span>}
                      {category.name === 'Mixed Metals' && <span className="text-8xl">✦</span>}
                    </div>
                    
                    <div className="p-8">
                      <h3 className="font-serif text-2xl mb-3 text-charcoal group-hover:text-gold transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gold-dark">
                          {category.product_count} {category.product_count === 1 ? 'piece' : 'pieces'}
                        </span>
                        <span className="text-xs tracking-wider uppercase text-gray group-hover:text-charcoal transition-colors">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-charcoal text-cream text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl mb-6">Can&apos;t Decide?</h2>
            <p className="text-white text-opacity-70 mb-8 text-lg leading-relaxed">
              Schedule a private consultation at our Mission District studio. 
              We&apos;ll help you find the perfect piece for any occasion.
            </p>
            <Link href="/contact" className="btn btn-secondary">
              Book Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}