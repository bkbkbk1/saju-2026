import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2026년 병오년 운세",
  description: "생년월일시와 성별을 입력하면 ChatGPT가 2026년 병오년 운세를 해석해드립니다. 재물운, 직업운, 건강운까지 상세하게!",
  openGraph: {
    title: "2026년 병오년 운세",
    description: "생년월일시와 성별을 입력하면 ChatGPT가 2026년 병오년 운세를 해석해드립니다.",
    images: ["https://saju-2026.vercel.app/og-welcome.png"],
    url: "https://saju-2026.vercel.app/fortune"
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://saju-2026.vercel.app/og-welcome.png',
    'fc:frame:button:1': '운세 보기',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://saju-2026.vercel.app/fortune'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
