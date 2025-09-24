# Parabola Setup Guide

## 🚀 Quick Start

### 1. **Clone and Install**
```bash
git clone <your-repository-url>
cd parabola.app
pnpm install
```

### 2. **Set Up Authentication**

1. **Create a Clerk Account:**
   - Go to [clerk.com](https://clerk.com) and sign up
   - Create a new application
   - Choose your preferred authentication methods (email, social logins, etc.)

2. **Configure Environment Variables:**
   ```bash
   # Copy the example file
   cp .env.local.example .env.local
   
   # Edit .env.local and add your Clerk keys:
   # NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   # CLERK_SECRET_KEY=sk_test_...
   ```

3. **Get Your Clerk Keys:**
   - In your Clerk dashboard, go to "API Keys"
   - Copy the "Publishable Key" and "Secret Key"
   - Paste them into your `.env.local` file

### 3. **Start Development**
```bash
pnpm dev
```

Your app will be running at `http://localhost:3000`

## 🔧 Configuration Options

### **Authentication URLs** (Optional)
You can customize where users are redirected:
```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### **Social Providers**
In your Clerk dashboard, you can enable:
- Google
- GitHub  
- Discord
- Microsoft
- Apple
- Facebook
- And many more!

## 🚀 **Production Deployment**

### **Build for Production**
```bash
pnpm build
pnpm start
```

### **Environment Variables for Production**
Make sure to set these in your hosting platform:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_DOMAIN` (if using custom domain)

### **Recommended Hosting Platforms**
- **Vercel** (optimized for Next.js)
- **Netlify**
- **Railway**
- **Digital Ocean App Platform**

## 🔒 **Security Features**

- **Route Protection**: Only authenticated users can access the main app
- **User Isolation**: Each user's data is completely separate
- **Secure Sessions**: Automatic session management and refresh
- **HTTPS Only**: All authentication happens over secure connections

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **"Authentication Error"**
   - Check your Clerk keys in `.env.local`
   - Make sure the keys start with `pk_test_` and `sk_test_`

2. **"Middleware Error"**
   - Ensure you have the latest `@clerk/nextjs` version
   - Restart your development server

3. **"Build Errors"**
   - Run `pnpm build` to check for TypeScript errors
   - Make sure all environment variables are set

### **Get Help:**
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- Open an issue in this repository

## ✨ **What's Next?**

After setup, you'll have:
- ✅ Secure user authentication
- ✅ User profiles with avatars
- ✅ Social login options
- ✅ Protected routes
- ✅ User-specific data storage
- ✅ Professional UI/UX

**Ready to boost your productivity!** 🚀