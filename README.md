# ResumeForge AI - Frontend

Production-grade React frontend for ResumeForge AI SaaS platform.

## Technology Stack

- **React 18.3**
- **Vite 5.4** (Build tool)
- **React Router 6.30** (Routing)
- **Zustand 4.5** (State management)
- **Axios 1.8** (HTTP client)
- **Tailwind CSS 3.4** (Styling)

## Features

### User Authentication
- Registration with email verification
- Login/Logout
- Password reset flow
- Protected routes
- JWT token management

### Resume Builder
- Step-by-step resume creation
- Live preview
- Multiple ATS-optimized templates
- Section-based editing
- Auto-save functionality
- Version history

### AI-Powered Features
- Content rewriting
- Bullet point improvement
- Professional summary generation
- Skill extraction
- Job-specific tailoring
- ATS compatibility scoring
- Cover letter generation
- LinkedIn profile optimization
- Grammar checking
- Interview question preparation

### Export Options
- PDF export
- DOCX export
- TXT export (ATS-safe)
- Export history
- Free tier limits (3/day)

### Premium Features
- Unlimited exports
- Advanced templates
- Priority AI processing
- Razorpay payment integration

### Referral System
- Unique referral code
- Referral tracking
- Reward management

### Admin Panel
- User management
- Payment tracking
- Analytics dashboard
- System monitoring

## Setup Instructions

### Prerequisites
- Node.js 18+ or Bun
- npm/yarn/pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

5. Start development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The frontend will start on `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
│   ├── common/      # Common UI components
│   ├── layout/      # Layout components
│   └── resume/      # Resume-specific components
├── pages/           # Page components
│   ├── auth/        # Authentication pages
│   ├── dashboard/   # Dashboard pages
│   ├── resume/      # Resume builder pages
│   ├── admin/       # Admin panel pages
│   └── public/      # Public pages
├── services/        # API services
│   ├── api.js       # Axios instance
│   ├── authService.js
│   ├── resumeService.js
│   ├── aiService.js
│   └── ...
├── store/           # Zustand stores
│   ├── authStore.js
│   └── resumeStore.js
├── utils/           # Utility functions
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Key Components

### Authentication
- `LoginPage` - User login
- `RegisterPage` - User registration
- `VerifyEmailPage` - Email verification with OTP
- `ForgotPasswordPage` - Password reset request
- `ResetPasswordPage` - Password reset

### Resume Builder
- `ResumeBuilder` - Main builder interface
- `TemplateSelector` - Template selection
- `PersonalInfoForm` - Personal details
- `ExperienceForm` - Work experience
- `EducationForm` - Education details
- `SkillsForm` - Skills section
- `ResumePreview` - Live preview

### Dashboard
- `Dashboard` - User dashboard
- `ResumeList` - List of resumes
- `ExportHistory` - Export tracking
- `PremiumStatus` - Premium subscription

### Admin
- `AdminDashboard` - Admin overview
- `UserManagement` - User administration
- `PaymentManagement` - Payment tracking
- `Analytics` - System analytics

## State Management

Using Zustand for global state:

```javascript
// Auth Store
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (token, user) => set({ token, user, isAuthenticated: true }),
  logout: () => set({ token: null, user: null, isAuthenticated: false }),
}))

// Resume Store
const useResumeStore = create((set) => ({
  resumes: [],
  currentResume: null,
  setResumes: (resumes) => set({ resumes }),
  setCurrentResume: (resume) => set({ currentResume: resume }),
}))
```

## Routing

```javascript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  
  {/* Protected Routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/resume/create" element={<ResumeBuilder />} />
    <Route path="/resume/:id/edit" element={<ResumeBuilder />} />
  </Route>
  
  {/* Admin Routes */}
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminDashboard />} />
  </Route>
</Routes>
```

## API Integration

All API calls go through centralized services:

```javascript
// Example: Resume Service
import api from './api'

export const resumeService = {
  getAll: () => api.get('/resumes'),
  getById: (id) => api.get(`/resumes/${id}`),
  create: (data) => api.post('/resumes', data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
}
```

## Styling

Using Tailwind CSS with custom configuration:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#8b5cf6',
          600: '#7c3aed',
          // ...
        },
      },
    },
  },
}
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Production Deployment

### Vercel/Netlify
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variable: `VITE_API_BASE_URL`

### Custom Server
1. Build: `npm run build`
2. Serve `dist/` directory with any static server
3. Configure HTTPS
4. Set proper headers (CORS, CSP)

## Performance Optimization

- Code splitting with React.lazy
- Image optimization
- Route-based chunking
- Tree shaking
- Minification
- Gzip compression

## Security

- JWT token storage in memory/secure storage
- XSS prevention
- CSRF protection via SameSite cookies
- Input validation
- Secure API communication (HTTPS)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - ResumeForge AI
