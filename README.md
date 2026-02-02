# 💎 Kiki's Jewelry E-commerce

A beautiful, full-stack e-commerce jewelry website built with Next.js and Node.js.

## ✨ Features

### Frontend (Next.js)
- 🎨 Beautiful, minimalist design
- 📱 Fully responsive
- ⚡ Fast loading with image optimization
- 🛒 Shopping cart functionality
- 💳 Stripe payment integration
- 🔍 Product search and filtering
- 👤 User authentication
- 📊 Real-time inventory tracking

### Backend (Node.js/Express)
- 🗄️ PostgreSQL database
- 🔐 JWT authentication
- 📧 Email notifications
- 💰 Payment processing (Stripe)
- 📈 Order management
- 🛡️ Security middleware
- 📝 Input validation
- 🖼️ Image upload (Cloudinary)

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- React Query
- Stripe React

**Backend:**
- Node.js
- Express
- PostgreSQL
- JWT
- Stripe
- Cloudinary
- Nodemailer

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Git

### 1. Clone & Install
```bash
git clone <repo-url>
cd kikis-jewelry-ecommerce

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb kikis_jewelry

# Set up tables and seed data
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm run setup-db
```

### 3. Environment Variables

**Backend (.env):**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/kikis_jewelry
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kikis_jewelry
DB_USER=your_username
DB_PASS=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Visit: http://localhost:3000

## 📋 Default Accounts

After running the database setup:

**Admin Account:**
- Email: admin@kikisjewelry.com
- Password: admin123

**Test Customer:**
- Email: sarah@example.com  
- Password: password123

## 🎨 Design

The design features:
- **Colors:** Cream, warm gold, charcoal, soft rose
- **Typography:** Cormorant Garamond (headings), Montserrat (body)
- **Style:** Minimalist, elegant, boutique jewelry aesthetic
- **Inspiration:** Bay Area artisan craftsmanship

## 📦 Sample Data

The seed script includes:
- 4 jewelry collections (Golden Hour, Pacific Silver, Rose Bloom, Mixed Metals)
- 9 sample products with descriptions and pricing
- High-quality placeholder images from Unsplash
- Realistic product details (materials, dimensions, care instructions)

## 🏗️ Project Structure

```
kikis-jewelry-ecommerce/
├── backend/
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth, validation, etc.
│   ├── database/         # Schema, seeds
│   ├── config/           # Database connection
│   └── scripts/          # Setup utilities
├── frontend/
│   ├── pages/            # Next.js pages
│   ├── components/       # React components
│   ├── styles/           # CSS and Tailwind
│   └── utils/            # Helper functions
└── shared/               # Shared types/utils
```

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Connect your Git repository
2. Set environment variables
3. Deploy automatically on push

### Frontend Deployment (Vercel)
```bash
npm install -g vercel
vercel --prod
```

### Database (Railway/Neon/Supabase)
- Use the DATABASE_URL from your provider
- Run migrations in production

## 📈 Development Roadmap

**Phase 1: Core E-commerce** ✅
- Product catalog
- Shopping cart
- User authentication
- Basic checkout

**Phase 2: Payments & Orders**
- Stripe integration
- Order management
- Email notifications
- Inventory tracking

**Phase 3: Advanced Features**
- Product reviews
- Wishlist
- Discount codes
- Advanced search

**Phase 4: Admin Dashboard**
- Product management
- Order processing
- Analytics
- Customer management

**Phase 5: Enhancements**
- Mobile app
- Social login
- Multi-language
- Advanced SEO

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

Private commercial project - All rights reserved.

---

Made with ♡ in the Bay Area for Kiki's Jewelry