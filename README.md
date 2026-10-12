# CloudPrep — AWS Certified Cloud Practitioner (CLF-C02) Practice Platform

CloudPrep is a full-featured, responsive exam preparation platform for the **AWS Certified Cloud Practitioner (CLF-C02)** certification exam. Designed with a clean, minimal light theme, it offers realistic 65-question timed mock exams, self-paced practice drills, detailed performance diagnostics, and zero-login local privacy.

---

## Key Features

- **Full-Length 65-Question Mock Exams**: 9 comprehensive mock exams matching the official AWS blueprint (90-minute timer, question navigator palette, flagged review system, and scaled score calculation out of 1000 with a 700 passing cutoff).
- **Dual Taking Modes**:
  - **Exam Mode**: Strict 90-minute countdown with all answer feedback hidden until final submission.
  - **Practice Mode**: Untimed with instant or blind answer reveals, detailed explanations, and direct links to official AWS documentation.
- **Diagnostic Performance Dashboard**: Real-time exam readiness gauge, domain-by-domain mastery matrix across all 4 CLF-C02 blueprint domains, time efficiency tracking against the official 83s/question benchmark, and targeted weak-spot remediation.
- **Dedicated Review Hubs**: Quick one-click drills for missed questions and saved bookmarks.
- **Client-Side Storage & Zero Login**: All question progress, attempts, and bookmarks persist directly in your browser's `localStorage` — no account creation, passwords, or external database required.
- **Minimal Light Theme**: High-contrast, clean slate typography, curated accent colors, and fully responsive layout for desktop, tablet, and mobile.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Logic**: React 19, TypeScript
- **Styling**: Tailwind CSS v4 (Minimal Light Design System)
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage with type-safe state handlers
- **Hosting**: Zero-config static output on Vercel

---

## How to Update or Add Service-Wise Questions

All questions in CloudPrep are centrally managed in a single, type-safe JSON file:

```text
src/data/questions.json
```

### 1. Question Schema

Each question object in `src/data/questions.json` follows this format:

```json
{
  "id": "clf-q559",
  "number": 559,
  "questionText": "Which AWS service provides a fully managed NoSQL database with single-digit millisecond latency?",
  "type": "single",
  "options": [
    { "id": "A", "text": "Amazon RDS" },
    { "id": "B", "text": "Amazon DynamoDB" },
    { "id": "C", "text": "Amazon Redshift" },
    { "id": "D", "text": "Amazon Aurora" }
  ],
  "correctOptionIds": ["B"],
  "explanation": "Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale.",
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
    "NoSQL",
    "Database Services"
  ],
  "status": "published",
  "contentVersion": 1
}
```

### 2. Field Specifications

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (e.g. `"clf-q559"`). |
| `number` | `number` | Sequential question index. |
| `questionText` | `string` | The scenario or question prompt. |
| `type` | `"single" \| "multiple"` | Single-select (1 correct answer) or multi-select (e.g. choose two). |
| `options` | `Array<{ id: string, text: string }>` | Option identifiers (`"A"`, `"B"`, etc.) and text. |
| `correctOptionIds` | `string[]` | Array of correct option letters (e.g. `["B"]` or `["A", "C"]`). |
| `explanation` | `string` | Educational explanation shown after answering or submitting. |
| `references` | `Array<{ title?: string, url: string }>` | Links to official AWS whitepapers, documentation, or FAQs. |
| `domain` | `1 \| 2 \| 3 \| 4` | Mapped CLF-C02 exam domain: <br>• `1`: Cloud Concepts (24%)<br>• `2`: Security and Compliance (30%)<br>• `3`: Cloud Technology and Services (34%)<br>• `4`: Billing, Pricing, and Support (12%) |
| `topic` | `string` | High-level category (e.g. `"Compute"`, `"Storage"`, `"Security"`, `"Networking"`). |
| `tags` | `string[]` | **Service-wise keywords** (e.g. `["Amazon S3", "Storage", "Encryption"]`). |

### 3. How Service-Wise Search & Filtering Works

The Practice Mode search engine (`filterQuestions` in [`src/lib/questions.ts`](src/lib/questions.ts)) automatically indexes:
- The question text
- All option text
- The explanation
- **All items in the `tags` array**

When learners type an AWS service name (such as `"S3"`, `"EC2"`, `"IAM"`, `"Lambda"`, `"CloudFront"`, or `"Billing"`) into the search bar, the engine instantly matches all questions tagged with that service.

### 4. Creating Service-Specific Mock Exams or Drills (Optional)

To create a dedicated service drill (e.g., a 20-question drill focused purely on AWS Storage or Security), add a new definition in [`src/lib/mockExams.ts`](src/lib/mockExams.ts):

```typescript
{
  id: "mock-storage-specialist",
  title: "AWS Storage Services Drill",
  description: "Targeted questions on Amazon S3, EBS, EFS, and AWS Backup.",
  questionCount: 20,
  durationMinutes: 30,
  questionIds: allQuestions
    .filter((q) => q.tags.some((t) => t.toLowerCase().includes("s3") || t.toLowerCase().includes("storage")))
    .map((q) => q.id),
}
```

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To validate TypeScript and build for production:
```bash
npm run build
```

---

## Deploying to Vercel

CloudPrep is configured for 1-click deployment on [Vercel](https://vercel.com):

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Update CloudPrep platform"
   git push origin main
   ```
2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and select `Jayanesh2494/CloudPrep`.
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Environment Variables**: *None needed* (all data and scoring logic run client-side).
3. **Click Deploy**. Vercel will build and deploy the application in ~30 seconds.

---

## Disclaimer

CloudPrep is an independent educational tool designed to help learners prepare for the AWS Certified Cloud Practitioner (CLF-C02) examination. It is not affiliated with, endorsed by, or sponsored by Amazon Web Services, Inc. (AWS). AWS and AWS Certified Cloud Practitioner are registered trademarks of Amazon.com, Inc. or its affiliates.
