# Autopilot.monster - AI Agents & Automation Marketplace

A production-ready, scalable marketplace for AI agents, n8n workflows, and automation assets built with MERN stack, NestJS microservices, and Next.js.

## 🚀 Project Overview

Autopilot.monster is a comprehensive marketplace platform that enables vendors to sell:
- AI Agents (no-code, low-code, code-first)
- n8n Workflows (free and paid downloads)
- Automation Assets and Templates

## 🏗️ Architecture

- **Frontend**: Next.js 14+ with App Router, SCSS, Framer Motion
- **Backend**: NestJS Microservices Architecture
- **Database**: MongoDB with Redis caching
- **Infrastructure**: Kubernetes, Docker, Terraform
- **Design**: Production-grade UI with 20+ year industry expert standards

## 📁 Project Structure

```
autopilot.monster/
├── docs/                          # Complete technical documentation
├── apps/                          # Next.js applications
│   ├── customer-portal/           # Customer-facing marketplace
│   ├── vendor-portal/             # Vendor dashboard
│   └── admin-console/             # Admin management
├── services/                      # NestJS microservices
│   ├── auth-service/
│   ├── catalog-service/
│   ├── payment-service/
│   └── ...
├── shared/                        # Shared libraries and types
├── infrastructure/                # Terraform, K8s manifests
└── tools/                        # Development tools and scripts
```

## 🎯 Key Features

- **Professional Design System**: Pixel-perfect UI with SCSS architecture
- **Advanced Animations**: Framer Motion + Lottie for smooth interactions
- **Microservices**: Scalable NestJS backend architecture
- **Security**: Enterprise-grade security with proper authentication
- **Performance**: Optimized for production with monitoring
- **Accessibility**: WCAG 2.1 AA compliant

## 📚 Documentation

Complete technical documentation is available in the `docs/` directory:

- [Technical Architecture](./docs/technical-architecture.md)
- [Frontend Design System](./docs/frontend-design-system.md)
- [Backend Services](./docs/backend-services.md)
- [Implementation Guide](./docs/implementation-guide.md)
- [Production Deployment](./docs/production-deployment.md)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development environment
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## 🛠️ Tech Stack

### Frontend
- Next.js 14+ (App Router)
- React 18+
- SCSS (ITCSS + BEM + CSS Modules)
- Framer Motion
- Lottie
- React Query
- Zustand
- React Hook Form + Zod

### Backend
- NestJS
- MongoDB
- Redis
- NATS/RabbitMQ
- Docker
- Kubernetes

### DevOps
- Terraform
- GitHub Actions
- ArgoCD
- Sentry
- Lighthouse CI

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. For internal development guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

**Built with ❤️ for the future of automation**
