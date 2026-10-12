<div align="center">

# ☁️ CloudPrep
### AWS Certified Cloud Practitioner (CLF-C02) Practice Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-cloud--prep.vercel.app-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://cloud-prep-itgm5xa5y-jayanesh-projects.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<br />

**A responsive, production-grade exam preparation platform for the AWS Certified Cloud Practitioner (CLF-C02) exam.**  
Equipped with realistic 65-question timed mock exams, self-paced practice drills, real-time performance analytics, and zero-login client-side persistence.

[🚀 **Launch Live Application**](https://cloud-prep-itgm5xa5y-jayanesh-projects.vercel.app/) • [✨ **Features**](#-key-features) • [🏛️ **CLF-C02 Domains**](#️-official-clf-c02-blueprint-alignment) • [🛠️ **Service-Wise Guide**](#-updating--adding-service-wise-questions) • [💻 **Local Setup**](#-local-development)

</div>

---

## 🌐 Live Deployment

> **Production Application**: [https://cloud-prep-itgm5xa5y-jayanesh-projects.vercel.app/](https://cloud-prep-itgm5xa5y-jayanesh-projects.vercel.app/)  
> Deployed on **Vercel** with client-side execution and instant response times.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| ⏱️ **65-Question Mock Exams** | 9 full-length simulation tests adhering strictly to the official AWS blueprint (90-minute countdown, question palette, review flags, and scaled score calculation out of 1000). |
| 🎛️ **Dual Taking Modes** | **Exam Mode** (strict 90m timer, zero answer reveals before submission) or **Practice Mode** (untimed, instant explanations, and official AWS documentation references). |
| 📊 **Performance & Readiness Dashboard** | Real-time gauge calculating readiness percentage against the official **700 / 1000** passing line, domain-by-domain mastery bars, and pacing speed analytics (83s/question benchmark). |
| 🎯 **Targeted Remediation Hubs** | Dedicated centers to immediately practice **Missed Questions** and review **Bookmarked Questions**. |
| 🔒 **Zero-Login & 100% Privacy** | Immediate access without credentials or sign-up. All study progress, scores, and bookmarks persist directly in your browser's `localStorage`. |
| 🎨 **Minimal Light Theme** | Clean typography, subtle slate borders, accessible contrast ratios, and complete responsiveness across mobile, tablet, and desktop. |

---

## 🏛️ Official CLF-C02 Blueprint Alignment

CloudPrep structures its questions and diagnostic performance tracking according to the four official AWS CLF-C02 examination domains:

| Domain | Exam Weight | Key Competencies |
|:---:|:---:|---|
| **Domain 1** | **24%** | **Cloud Concepts**: AWS Cloud value proposition, cloud economics, agility, global infrastructure, and Well-Architected Framework pillars. |
| **Domain 2** | **30%** | **Security and Compliance**: AWS Shared Responsibility Model, IAM policies and MFA, security services (GuardDuty, Shield, WAF, KMS), and compliance frameworks. |
| **Domain 3** | **34%** | **Cloud Technology and Services**: Core compute (EC2, Lambda, ECS, Fargate), storage (S3, EBS, EFS), databases (RDS, DynamoDB, Aurora), and networking (VPC, CloudFront, Route 53). |
| **Domain 4** | **12%** | **Billing, Pricing, and Support**: Pricing models (On-Demand, Reserved, Spot), AWS Organizations consolidated billing, Cost Explorer, Budgets, and AWS Support tiers. |

---

## 🛠️ Updating & Adding Service-Wise Questions

All question data is stored centrally in:

```text
src/data/questions.json
```

### Question Format

When adding new questions or expanding questions for specific AWS services (e.g. S3, EC2, IAM, DynamoDB, VPC, Lambda), use the following structure:

```json
{
  "id": "clf-q559",
  "number": 559,
  "questionText": "Which AWS service provides a fully managed NoSQL database with single-digit millisecond latency at any scale?",
  "type": "single",
  "options": [
    { "id": "A", "text": "Amazon RDS" },
    { "id": "B", "text": "Amazon DynamoDB" },
    { "id": "C", "text": "Amazon Redshift" },
    { "id": "D", "text": "Amazon Aurora" }
  ],
  "correctOptionIds": ["B"],
  "explanation": "Amazon DynamoDB is a serverless, key-value and document NoSQL database that delivers single-digit millisecond performance at any scale.",
  "references": [
    {
      "title": "Amazon DynamoDB Documentation",
      "url": "https://aws.amazon.com/dynamodb/"
    }
  ],
  "domain": 3,
  "topic": "Databases",
  "difficulty": "medium",
  "tags": [
    "CLF-C02",
    "Domain-3",
    "Amazon DynamoDB",
    "NoSQL"
  ],
  "status": "published",
  "contentVersion": 1
}
```

> **Tip for Service Search**: Any service keyword included in `tags` (or mentioned in `questionText`) is immediately searchable by learners in Practice Mode.

---

## 📂 Project Architecture

```text
CloudPrep/
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── bookmarks/      # Bookmarked questions review
│   │   ├── dashboard/      # Main prep overview and quick stats
│   │   ├── exam/           # 65-question mock exam hub & runner
│   │   ├── history/        # Historical mock exam records
│   │   ├── performance/    # Diagnostic performance dashboard
│   │   ├── practice/       # Self-paced practice mode
│   │   ├── privacy/        # Privacy policy (local-storage guarantee)
│   │   ├── profile/        # Preferences & local data management
│   │   ├── results/        # Exam score breakdown & review
│   │   ├── review/         # Missed questions remediation hub
│   │   ├── terms/          # Terms & educational disclaimer
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Modern landing page
│   ├── components/         # Reusable UI components
│   │   ├── exam/           # ExamTimer, QuestionNavigator, SubmitDialog
│   │   ├── layout/         # AppLayout, Navbar, Footer
│   │   └── questions/      # QuestionCard, AnswerOption
│   ├── data/
│   │   └── questions.json  # Complete question repository
│   ├── lib/                # Business logic & utilities
│   │   ├── mockExams.ts    # 65Q mock exam definitions & generator
│   │   ├── questions.ts    # Filtering, indexing, and search engine
│   │   └── storage.ts      # Type-safe LocalStorage scoring handlers
│   └── types/              # TypeScript interfaces (Exam, Question)
├── .gitignore              # Production-grade ignore rules for Vercel
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies & scripts
└── tsconfig.json           # TypeScript configuration
```

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run the Next.js development server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Educational Disclaimer

CloudPrep is an independent educational tool designed to help candidates prepare for the AWS Certified Cloud Practitioner (CLF-C02) examination. It is not affiliated with, endorsed by, or sponsored by Amazon Web Services, Inc. (AWS). AWS and AWS Certified Cloud Practitioner are registered trademarks of Amazon.com, Inc. or its affiliates.
