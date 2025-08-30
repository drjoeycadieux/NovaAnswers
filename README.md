# Nova Answers

Nova Answers is an advanced AI-powered Q&A web application that provides comprehensive and attributed answers to user questions. Built with a modern tech stack, it features a clean, responsive interface and is ready for monetization with Google AdSense.

## ✨ Features

- **AI-Powered Q&A**: Leverages Generative AI to provide intelligent and in-depth answers.
- **Source Attribution**: Automatically displays the sources used to generate an answer, ensuring credibility.
- **Responsive Design**: A clean and modern user interface that works seamlessly on desktop and mobile devices.
- **Google AdSense Ready**: Pre-configured with placeholders and the necessary scripts to easily integrate Google AdSense.
- **Dark Mode**: Comes with a sleek dark theme as the default.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation & Running Locally

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/nova-answers.git
   cd nova-answers
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root of your project and add your GenAI API key:
   ```env
   GEMINI_API_KEY=YOUR_API_KEY
   ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

##  monetize Google AdSense

This project is set up to be ready for Google AdSense. To enable it:

1. **Update your AdSense Account ID**:
   In `src/app/layout.tsx`, you will find a `meta` tag for `google-adsense-account`. Make sure your publisher ID is correct.

2. **Verify `ads.txt`**:
   The `public/ads.txt` file is included. Update it with your publisher information to ensure ad crawlers can verify your site.

3. **Ad Placement**:
   Ad placeholders are included in the application. Once your AdSense account is approved and configured, ads will be served in these locations.
