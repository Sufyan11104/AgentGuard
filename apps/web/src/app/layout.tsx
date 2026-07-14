import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#38d5b5",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: {
    default: "AgentGuard — Defensive AI Agent Evaluation",
    template: "%s | AgentGuard",
  },
  description:
    "Open-source TypeScript toolkit for testing AI agents against prompt injection, fake canary leakage, unsafe tool calls, hallucinated actions, and unsafe output — with CLI, dashboard, scoring, and reports.",
  keywords: [
    "AI security",
    "LLM security",
    "prompt injection",
    "agent evaluation",
    "red teaming",
    "TypeScript",
    "Next.js",
  ],
  authors: [{ name: "AgentGuard" }],
  openGraph: {
    title: "AgentGuard — Defensive AI Agent Evaluation",
    description:
      "CLI-first and dashboard-backed toolkit for testing AI agents against common defensive failure modes.",
    type: "website",
    locale: "en_GB",
    siteName: "AgentGuard",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentGuard — Defensive AI Agent Evaluation",
    description:
      "CLI-first and dashboard-backed toolkit for testing AI agents against common defensive failure modes.",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23090d14'/><text x='50%' y='50%' dominant-baseline='central' text-anchor='middle' font-family='system-ui,sans-serif' font-size='14' font-weight='800' fill='%2338d5b5'>AG</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={inter.variable} lang="en">
      <body style={{ fontFamily: "var(--font-inter), 'Inter', ui-sans-serif, system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
