# HCS-U7 Website Deployment Guide

## 🚀 Deployment to Vercel

This guide covers deploying the HCS-U7 scientific cognitive profiling website to Vercel.

### Prerequisites

- GitHub repository: `https://github.com/zefparis/HCS-U7-website.git`
- Vercel account (free tier works)
- Node.js 18+ locally for testing

### Environment Variables

Create these in Vercel dashboard:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://hcs-u7.vercel.app
NEXT_PUBLIC_SITE_NAME=HCS-U7

# Optional: HCS-Lab API Integration
NEXT_PUBLIC_HCS_LAB_URL=https://hcs-lab-production.up.railway.app/api/generate
NEXT_PUBLIC_HCS_LAB_ENABLED=true

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_BACKEND_GENERATION=true

# Contact
NEXT_PUBLIC_CONTACT_EMAIL=contact@hcs-u7.org
NEXT_PUBLIC_GITHUB_REPO=https://github.com/zefparis/HCS-U7-website
```

### Deployment Steps

#### Option 1: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import from GitHub: `https://github.com/zefparis/HCS-U7-website.git`
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: **./** (leave as is)
   - Build Command: `npm run build`
   - Install Command: `npm install`
5. Add environment variables (copy from above)
6. Click "Deploy"

#### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# In project directory
cd c:\Users\ia-solution\CascadeProjects\hcs-u7-website

# Deploy
vercel

# Follow prompts:
# - Set up and deploy: Yes
# - Which scope: Your account
# - Link to existing project: No
# - Project name: hcs-u7-website
# - Directory: ./
# - Build settings: Default (detects Next.js)
```

### Post-Deployment Checklist

#### ✅ Core Functionality
- [ ] Homepage loads with scientific badges
- [ ] Language switcher (FR/EN) works
- [ ] Generate page loads with tabs
- [ ] Questionnaire completes successfully
- [ ] Cognitive tests load (Stroop, N-Back)
- [ ] Results page shows HCS code
- [ ] Code can be copied to clipboard

#### ✅ Scientific Features
- [ ] References display correctly
- [ ] Validation status shows
- [ ] Test instructions clear
- [ ] Cognitive tests run smoothly
- [ ] Results include interpretation

#### ✅ Performance
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Images optimized
- [ ] Fast page transitions

#### ✅ SEO & Meta
- [ ] OpenGraph tags present
- [ ] Twitter cards configured
- [ ] Sitemap generated
- [ ] Robots.txt correct

### Domain Configuration (Optional)

To use a custom domain:

1. In Vercel Dashboard → Project Settings → Domains
2. Add your domain (e.g., `hcs-u7.org`)
3. Configure DNS:
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.21.21`

### Monitoring

1. **Analytics**: Vercel Analytics auto-enabled
2. **Error Tracking**: Check Vercel Functions logs
3. **Performance**: Monitor Web Vitals in dashboard

### Troubleshooting

#### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### TypeScript Errors

```bash
# Check types
npm run type-check

# If alert component error persists
npm install class-variance-authority
```

#### Environment Variables Not Working

- Ensure prefixed with `NEXT_PUBLIC_` for client-side
- Redeploy after adding variables
- Check in Settings → Environment Variables

### Production Optimizations

1. **Enable ISR** (Incremental Static Regeneration):
   ```javascript
   // In pages with dynamic content
   export const revalidate = 3600; // Revalidate every hour
   ```

2. **Image Optimization**:
   - Use `next/image` for all images
   - Add blur placeholders

3. **Bundle Size**:
   ```bash
   # Analyze bundle
   npm run analyze
   ```

### Security Considerations

1. **API Keys**: Never expose in client code
2. **CORS**: Configure for your domain only
3. **Rate Limiting**: Use Vercel Edge Config
4. **CSP Headers**: Add in `next.config.js`

### Backup & Recovery

1. **Database**: Export profiles regularly (if using DB)
2. **Code**: GitHub auto-backup on push
3. **Analytics**: Export monthly

### Support

- **GitHub Issues**: [github.com/zefparis/HCS-U7-website/issues](https://github.com/zefparis/HCS-U7-website/issues)
- **Email**: contact@hcs-u7.org
- **Discord**: [Join community](https://discord.gg/hcs-u7)

---

## 📊 Current Deployment Status

- **Production URL**: [https://hcs-u7.vercel.app](https://hcs-u7.vercel.app)
- **GitHub**: [github.com/zefparis/HCS-U7-website](https://github.com/zefparis/HCS-U7-website)
- **Status**: 🟢 Ready for deployment
- **Last Updated**: December 2024
