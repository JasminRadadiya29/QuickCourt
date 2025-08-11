# App Directory Structure

This directory follows Next.js 13+ App Router conventions with a clean, organized structure.

## 📁 Directory Organization

### Route Groups
- `(auth)/` - Authentication-related pages
- `(dashboard)/` - Dashboard and user management pages  
- `(features)/` - Main application features

### Core Directories
- `components/` - Reusable UI components
- `lib/` - Utilities and helpers
- `providers/` - React Context providers

## 🗂️ Detailed Structure

```
app/
├── (auth)/                          # Route group for authentication
│   ├── auth/                        # Auth pages (login, signup, etc.)
│   └── login-registration/          # Login/registration components
│
├── (dashboard)/                     # Route group for dashboards
│   ├── admin/                       # Admin dashboard pages
│   ├── owner/                       # Facility owner dashboard pages
│   ├── user/                        # User dashboard pages
│   ├── home-dashboard/              # Main home dashboard
│   └── facility-owner-dashboard/    # Facility owner specific dashboard
│
├── (features)/                      # Route group for main features
│   ├── venues-listing-search/       # Venue search and listing
│   ├── venue-details-booking/       # Venue details and booking
│   └── user-profile-my-bookings/    # User profile and bookings
│
├── components/                      # Shared components
│   ├── ui/                         # Base UI components (Button, Input, etc.)
│   ├── layout/                     # Layout components (Navigation, etc.)
│   ├── features/                   # Feature-specific shared components
│   ├── AppIcon.jsx                 # Icon wrapper component
│   ├── AppImage.jsx                # Image wrapper component
│   └── ErrorBoundary.jsx           # Error boundary component
│
├── lib/                            # Utilities and helpers
│   └── Icon.jsx                    # Icon utility component
│
├── providers/                      # React Context providers
│   ├── AuthContext.jsx             # Authentication context
│   ├── BookingContext.jsx          # Booking management context
│   ├── NotificationContext.jsx     # Notification context
│   └── index.jsx                   # Provider exports
│
├── globals.css                     # Global styles
├── layout.tsx                      # Root layout component
└── page.tsx                        # Home page
```

## 🎯 Benefits of This Structure

1. **Route Groups** - Organize related pages without affecting URL structure
2. **Clear Separation** - Auth, dashboard, and features are clearly separated
3. **Component Organization** - UI, layout, and feature components are organized by purpose
4. **Maintainability** - Easy to find and maintain related code
5. **Scalability** - Structure supports future growth and new features

## 📝 Naming Conventions

- **Route Groups**: Use parentheses `(group-name)` to group related routes
- **Components**: Use PascalCase for component files
- **Directories**: Use kebab-case for directory names
- **Files**: Use appropriate extensions (.tsx, .jsx, .css)

## 🔄 Migration Notes

- All import paths have been updated to reflect the new structure
- Navigation components moved to `components/layout/`
- Icon utility moved to `lib/`
- Feature-specific components remain in their respective directories
