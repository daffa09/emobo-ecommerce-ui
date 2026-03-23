# Emobo Frontend - E-Commerce Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-black)
![Docker](https://img.shields.io/badge/Docker-supported-blue)

Modern, responsive e-commerce frontend built with Next.js 16, React 19, Tailwind CSS, and Docker.

</div>

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Components](#components)
- [Development](#development)

---

## ✨ Features

### Public Pages
- ✅ **Homepage** - Hero, featured products, categories, brands
- ✅ **Product Catalog** - Browse with filters and search
- ✅ **Product Details** - Full product information with image gallery
- ✅ **Shopping Cart** - Add, update, remove items (localStorage)
- ✅ **Checkout** - Order placement with shipping information
- ✅ **Contact** - Contact form with validation

### Customer Dashboard
- ✅ **Profile Management** - View and update profile
- ✅ **Order History** - View past orders
- ✅ **Order Tracking** - Track order status

### Admin Dashboard
- ✅ **Product Management** - CRUD operations
- ✅ **Order Management** - View and update orders
- ✅ **Customer Management** - View customer list

### Cart System
- ✅ **Context-based state** - Global cart state
- ✅ **localStorage persistence** - Cart survives refresh
- ✅ **Real-time updates** - Instant badge updates
- ✅ **Quick view** - Sheet dropdown in navbar
- ✅ **Full cart page** - Detailed cart management

### UI/UX Features
- ✅ **Responsive Design** - Mobile, tablet, desktop
- ✅ **Dark Mode Support** - Theme switching
- ✅ **Toast Notifications** - User feedback (Sonner)
- ✅ **Form Validation** - React Hook Form + Zod
- ✅ **Loading States** - Skeletons and spinners
- ✅ **Error Handling** - User-friendly error messages

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4.0 |
| **Components** | shadcn/ui |
| **Forms** | React Hook Form + Zod |
| **State** | React Context API |
| **Storage** | localStorage |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Theme** | next-themes |
| **Container** | Docker |

---

## 🏗 Architecture

```
┌─────────────────────────────────────┐
│         Next.js App Router          │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │      Public Layout          │   │
│  │  ┌────────────────────────┐ │   │
│  │  │   CartProvider         │ │   │
│  │  │  (Context + localStorage)││   │
│  │  └────────────────────────┘ │   │
│  │  ┌────────────────────────┐ │   │
│  │  │   Navbar + CartButton  │ │   │
│  │  └────────────────────────┘ │   │
│  │  ┌────────────────────────┐ │   │
│  │  │   Page Components      │ │   │
│  │  └────────────────────────┘ │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│      shadcn/ui Components           │
│   (Button, Card, Sheet, etc.)       │
└─────────────────────────────────────┘
```

### Data Flow

```
User Action (e.g., Add to Cart)
    ↓
Component Event Handler
    ↓
CartContext.addItem()
    ↓
Update Cart State
    ↓
Save to localStorage
    ↓
React Re-render
    ↓
UI Updates (badge, cart list)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Emobo
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start development server**
```bash
npm run dev
```

Application will start at `http://localhost:3000`

### Running with Docker

1. **Build the image**
```bash
docker build -t emobo-ui .
```

2. **Run the container**
```bash
docker run -p 3000:3000 --env-file .env.local emobo-ui
```

---

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public pages
│   │   ├── _components/         # Shared public components
│   │   ├── page.tsx            # Homepage
│   │   ├── catalog/            # Product catalog
│   │   ├── products/[id]/      # Product detail
│   │   ├── cart/               # Shopping cart
│   │   ├── contact/            # Contact page
│   │   └── layout.tsx          # Public layout + CartProvider
│   ├── account/                # Customer dashboard
│   │   ├── profile/
│   │   └── orders/
│   ├── admin/                  # Admin dashboard
│   │   ├── products/
│   │   ├── orders/
│   │   └── customers/
│   ├── checkout/               # Checkout flow
│   ├── login/                  # Login page
│   ├── register/               # Registration
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── template/
│       └── layout/             # Layout components
│           ├── navbar.tsx
│           ├── footer.tsx
│           └── cart-button.tsx
├── lib/
│   ├── cart-context.tsx        # Cart state management
│   └── utils.ts                # Utility functions
├── hooks/                      # Custom hooks
├── public/                     # Static assets
├── styles/                     # Additional styles
├── .env.local                  # Environment variables
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## 🎯 Key Features

### 1. Shopping Cart

**Implementation**: Context API + localStorage

```typescript
// Usage in component
import { useCart } from "@/lib/cart-context";

function ProductCard() {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      sku: product.sku,
    }, quantity);
  };
}
```

**Features**:
- Persistent across page refreshes
- Real-time cart count badge
- Quick view in navbar sheet
- Full cart page with management

### 2. Form Validation

**Implementation**: React Hook Form + Zod

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### 3. Toast Notifications

**Implementation**: Sonner

```typescript
import { toast } from "sonner";

toast.success("Added to cart!");
toast.error("Failed to load products");
```

### 4. Theme Support

**Implementation**: next-themes

Automatic dark mode support across all components.

---

## 🧩 Components

### Layout Components

**Navbar** (`components/template/layout/navbar.tsx`)
- Logo and navigation links
- Cart button with badge
- Authentication buttons
- Responsive mobile menu

**CartButton** (`components/template/layout/cart-button.tsx`)
- Cart icon with item count badge
- Sheet dropdown with cart preview
- Quick remove items
- Link to full cart page

**Footer** (`components/template/layout/footer.tsx`)
- Links and copyright
- Responsive layout

### Page Components

**Homepage** (`app/(public)/page.tsx`)
- Hero section
- Featured products
- Categories showcase
- Brand logos

**Product Card** (`app/(public)/_components/product-card.tsx`)
- Product image
- Name, price, rating
- Specs badges
- Add to cart button

**Cart Page** (`app/(public)/cart/page.tsx`)
- Cart items list
- Quantity controls
- Remove items
- Order summary
- Checkout button

**Contact Form** (`app/(public)/contact/_components/send-message-form.tsx`)
- Form fields with validation
- Success/error feedback
- localStorage storage

### UI Components (shadcn/ui)

Pre-built components in `components/ui/`:
- Button, Card, Input, Textarea
- Sheet, Dialog, Toast
- Select, Checkbox, Label
- Table, Badge, Separator
- And more...

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build for production
npm start              # Start production server

# Code Quality
npm run lint           # Run ESLint

# Type Checking
tsc --noEmit           # Check TypeScript
```

### Adding New Pages

1. Create page in `app/` directory
2. Use appropriate layout
3. Import and use components
4. Style with Tailwind CSS

Example:
```typescript
// app/(public)/about/page.tsx
export default function AboutPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p className="mt-4">...</p>
    </div>
  );
}
```

### Adding New Components

1. Create in appropriate directory
2. Use TypeScript for props
3. Style with Tailwind
4. Export component

```typescript
// components/product-badge.tsx
interface ProductBadgeProps {
  label: string;
  variant?: "default" | "sale";
}

export function ProductBadge({ label, variant = "default" }: ProductBadgeProps) {
  return (
    <span className={/* ... */}>
      {label}
    </span>
  );
}
```

### Adding shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

Components will be added to `components/ui/`.

---

## 🎨 Styling Guidelines

### Tailwind CSS Classes

Use Tailwind utility classes:
```tsx
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
</div>
```

### Responsive Design

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>
```

### Dark Mode

Use Tailwind's dark mode utilities:
```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
```

---

## 🔌 API Integration

### Fetching Data

```typescript
// Example: Fetch products
async function getProducts() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  const data = await response.json();
  return data;
}
```

### Authenticated Requests

```typescript
const response = await fetch(url, {
  credentials: 'include', // Send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## 📱 Responsive Design

### Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Mobile-First Approach

Design for mobile first, then add larger breakpoints:
```tsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

---

## 🐛 Troubleshooting

### Common Issues

**Module not found**
```bash
rm -rf node_modules .next
npm install
```

**Environment variables not working**
- Restart dev server after changing `.env.local`
- Ensure variables start with `NEXT_PUBLIC_`

**Cart not persisting**
- Check browser localStorage is enabled
- Check browser console for errors
- Clear localStorage and test again

**Build errors**
```bash
npm run build
# Check error messages
# Fix TypeScript/ESLint errors
```

---

## 📖 Additional Documentation

- [ERD](../docs/ERD.md) - Database schema
- [Class Diagram](../docs/CLASS_DIAGRAM.md) - Frontend architecture
- [Sequence Diagrams](../docs/SEQUENCE_DIAGRAM.md) - User flows
- [How to Run](../docs/HOW_TO_RUN.md) - Complete setup guide

---

---

## 🔄 CI/CD

This project uses **GitHub Actions** for continuous integration and delivery.

- **Build & Push**: Triggered on push to `main` branch.
- **Workflow**: `.github/workflows/docker-build.yml`
- **Docker Hub**: Automatically pushes image to `daffa09/emobo-ecommerce-ui:latest`.

---

## 🚀 Deployment

### Docker Compose (Full Setup)

For a complete setup with API and Gateway, use the `docker-compose.yml` located in the `deployments/` folder:

```bash
cd deployments
docker compose up -d
```

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Build Optimization

- Images optimized with Next.js Image
- Code splitting automatic
- CSS optimization with Tailwind
- Static generation where possible

---

## ✅ Best Practices

### Performance
- Use Next.js Image for images
- Implement lazy loading
- Minimize client-side JavaScript
- Use server components when possible

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus management

### SEO
- Meta tags in layouts
- Descriptive titles
- Open Graph tags
- Structured data (future)

---

## 📄 License

This project is part of a thesis/skripsi project.

---

## 👥 Contributors

Built as part of academic project at [Your University]

---

**For detailed setup instructions, see [HOW_TO_RUN.md](../docs/HOW_TO_RUN.md)**