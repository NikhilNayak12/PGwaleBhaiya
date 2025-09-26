# 🏠 PG Wale Bhaiya - Complete PG Listing Platform

A comprehensive web application for students to find and book PG accommodations near LPU (Lovely Professional University). Built with React, Firebase, and modern web technologies.

## ✨ Features

### 🎯 For Students
- **Advanced Search**: Filter by location, price, room type, amenities
- **Detailed Listings**: High-quality photos, amenities, contact details
- **Verified PGs**: Only approved and verified accommodations
- **Direct Contact**: WhatsApp and phone integration
- **Mobile Responsive**: Optimized for all devices

### 🏠 For Landlords
- **Easy Listing**: Simple form to list your PG
- **Dashboard**: Manage your listings and inquiries
- **Real-time Notifications**: Get notified of new inquiries
- **Analytics**: View listing performance and stats

### 🔧 For Admins
- **Complete Control**: Approve/reject PG listings
- **User Management**: Handle landlord verifications
- **Analytics Dashboard**: Platform-wide statistics
- **Inquiry Management**: Oversee all student inquiries

## 🚀 Live Demo

- **Frontend**: [https://pg-walebhaiya.web.app](https://pg-walebhaiya.web.app)
- **Admin Panel**: [https://pg-walebhaiya.web.app/admin](https://pg-walebhaiya.web.app/admin)
- **API Documentation**: See `backend/functions/API_DOCUMENTATION.md`

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Firebase Functions** - Serverless backend
- **Express.js** - Web application framework
- **Firestore** - NoSQL database
- **JWT** - Authentication tokens
- **Nodemailer** - Email notifications
- **Multer** - File upload handling

### Deployment
- **Firebase Hosting** - Frontend hosting
- **Firebase Functions** - Backend hosting
- **Firebase Firestore** - Database
- **Custom Domain** - Professional URLs

## 📦 Project Structure

```
pg-wale-bhaiya/
├── src/                      # React frontend source
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components
│   ├── utils/               # API utilities
│   └── data/                # Static data (fallback)
├── backend/
│   └── functions/           # Firebase Functions
├── public/                  # Static assets
├── dist/                    # Production build (generated)
├── firebase.json            # Firebase configuration
├── DEPLOYMENT_GUIDE.md      # Deployment instructions
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase CLI
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pg-wale-bhaiya.git
   cd pg-wale-bhaiya
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend/functions
   npm install
   cd ../..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Start backend
   npm run start:backend
   
   # Terminal 2: Start frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5001/pg-walebhaiya/us-central1/api`
   - Firebase UI: `http://localhost:4000`

## 🔧 Configuration

### Environment Variables

Create `.env.local` with:
```bash
# API Configuration
VITE_API_BASE_URL=http://127.0.0.1:5001/pg-walebhaiya/us-central1/api
VITE_NODE_ENV=development

# Firebase Project
VITE_FIREBASE_PROJECT_ID=pg-walebhaiya
VITE_FIREBASE_REGION=us-central1
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Functions
4. Enable Hosting
5. Update project ID in configuration files

## 📚 API Documentation

Complete API documentation is available in:
- `backend/functions/API_DOCUMENTATION.md`
- Interactive testing with the included test scripts

### Key Endpoints
- `GET /pgs` - List all PGs with filters
- `POST /pgs` - Create new PG listing
- `GET /pgs/:id` - Get PG details
- `POST /pgs/:id/inquire` - Submit inquiry
- `POST /admin-login` - Admin authentication
- `GET /admin/dashboard` - Admin dashboard data

## 🧪 Testing

### API Testing
```bash
# Test all endpoints
npm run test:api

# Manual testing
curl http://localhost:5001/pg-walebhaiya/us-central1/api/health
```

### Frontend Testing
```bash
# Run development server
npm run dev

# Build for production
npm run build:prod
```

## 📱 Features Overview

### Advanced Search & Filtering
- Location-based search
- Price range filtering
- Room type selection
- Amenities filtering
- Real-time results

### PG Management
- Create, read, update, delete operations
- Image upload and management
- Status management (pending/approved/rejected)
- Featured listings

### User Management
- Admin authentication
- Landlord accounts
- Student inquiries
- Contact management

### Communication System
- Email notifications
- WhatsApp integration
- Direct phone contact
- Inquiry tracking

## 🔐 Security Features

- JWT-based authentication
- Input validation and sanitization
- Rate limiting
- CORS configuration
- XSS protection
- SQL injection prevention

## 📊 Analytics & Monitoring

- View count tracking
- Inquiry analytics
- Popular search terms
- User behavior insights
- Error monitoring

## 🚀 Deployment

See detailed deployment instructions in [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

### Quick Deploy
```bash
# Full deployment (frontend + backend)
npm run deploy:full

# Frontend only
npm run deploy:frontend

# Backend only
npm run deploy:backend
```

## 🎨 Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace logo in `public/` directory
- Modify text content in components

### Features
- Add new amenities in `backend/functions/config.js`
- Modify search filters in components
- Extend API with new endpoints

## 📈 Performance

### Optimization Features
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Service worker (PWA)

### Metrics
- Lighthouse score: 95+
- First Contentful Paint: <1.5s
- Time to Interactive: <3s

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- LPU community for inspiration
- Firebase for excellent developer experience
- React team for the amazing framework
- Tailwind CSS for beautiful styling

## 📞 Support

For support and questions:
- Email: support@pgwalebhaiya.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/pg-wale-bhaiya/issues)
- Documentation: Check the `/docs` folder

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release
- Complete PG listing platform
- Admin dashboard
- Mobile responsive design
- Email notifications
- WhatsApp integration

## 🚧 Roadmap

### Upcoming Features
- [ ] Payment integration
- [ ] Rating and review system
- [ ] Advanced map integration
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Multi-language support

---

**Built with ❤️ for the LPU student community**

*Making PG hunting easier, one click at a time!* 🏠✨
