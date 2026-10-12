# CloudPrep — AWS Certified Cloud Practitioner (CLF-C02) Practice Platform

CloudPrep is a full-featured, responsive exam preparation platform for the **AWS Certified Cloud Practitioner (CLF-C02)** certification exam.

## Features

- **Full-Length Mock Exams**: 9 realistic 65-question mock exams (90-minute timer limit, question palette, flagging system, scaled scoring out of 1000).
- **Dual Taking Modes**: Choose between timed **Exam Mode** and self-paced **Practice Mode** with hidden or instant answer reveals.
- **Diagnostic Performance Dashboard**: Real-time readiness meter, official CLF-C02 4-domain mastery tracking, pacing analytics, and weak-area drills.
- **Dedicated Review Centers**: Dedicated hubs for missed questions review, saved bookmarks, and historical attempt diagnostic breakdowns.
- **Client-Side Storage**: Progress, scores, and bookmarks persist directly in your browser without requiring account creation or third-party logins.
- **Minimal Light Theme**: Clean design with clear typography, intuitive navigation, and responsive mobile support.

---

## Getting Started Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel

CloudPrep is configured for 1-click deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the repository in your Vercel Dashboard.
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Environment Variables**: None required! CloudPrep runs completely client-side without external database or authentication service credentials.
6. Click **Deploy**.
