# Deployment Configuration for Parabola

## 🚀 **Pre-Deployment Checklist**

### **1. Environment Variables**

Ensure these are set in your deployment platform:

**Required:**

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key

**Optional:**

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/`
- `NEXT_PUBLIC_CLERK_DOMAIN` - For custom domains

### **2. Build Configuration**

Make sure your deployment platform:

- Uses Node.js 18+
- Runs `pnpm install` (or `npm install`)
- Runs `pnpm build` (or `npm run build`)
- Serves from `pnpm start` (or `npm start`)

### **3. Files to Exclude**

These files should NOT be uploaded to your deployment:

- `.next/` directory (build output - will be rebuilt)
- `node_modules/` directory
- `.env.local` (environment variables set in platform)
- Development files (`.DS_Store`, `*.log`, etc.)

## 🔧 **Platform-Specific Instructions**

### **Vercel (Recommended)**

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

### **Netlify**

1. Build command: `pnpm build`
2. Publish directory: `.next`
3. Set environment variables in site settings

### **Railway**

1. Connect GitHub repository
2. Set environment variables
3. Railway will auto-detect Next.js

### **Digital Ocean App Platform**

1. Use Node.js app
2. Build command: `pnpm build`
3. Run command: `pnpm start`

## ⚠️ **Common Deployment Issues**

### **Issue 1: `.next` directory warning**

**Solution:** Ensure `.next/` is in your `.gitignore` and not committed to Git

### **Issue 2: Clerk build scripts warning**

**Solution:** Use the `.pnpmrc` configuration included in this project

### **Issue 3: Environment variables not found**

**Solution:**

- Check variable names match exactly
- Ensure they're set in your deployment platform
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser

### **Issue 4: Authentication not working**

**Solution:**

- Add your deployment domain to Clerk dashboard
- Check that Clerk keys are for the correct environment
- Verify middleware configuration

## 🔒 **Security Considerations**

- Never commit `.env.local` to Git
- Use different Clerk keys for development/production
- Enable domain restrictions in Clerk dashboard
- Set up HTTPS redirects in your deployment platform

## 📊 **Performance Optimization**

- The app is already optimized for production
- Uses Next.js 15 with automatic optimizations
- Images are optimized by Next.js
- Bundle size is minimal with code splitting

## 🆘 **Getting Help**

If you encounter deployment issues:

1. Check the deployment logs
2. Verify environment variables
3. Ensure `.gitignore` is properly configured
4. Review this deployment guide
5. Check platform-specific documentation
