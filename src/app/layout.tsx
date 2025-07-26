import "../../styles/global.css";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Admotion - AI Video Ads, On Command",
  description: "Generate polished marketing videos from a prompt using AI and Remotion. Drop your prompt, we'll handle the rest.",
  keywords: ["AI video generation", "marketing videos", "Remotion", "Claude AI", "video ads"],
  authors: [{ name: "Admotion" }],
  openGraph: {
    title: "Admotion - AI Video Ads, On Command",
    description: "Generate polished marketing videos from a prompt using AI and Remotion.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Admotion - AI Video Ads, On Command",
    description: "Generate polished marketing videos from a prompt using AI and Remotion.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.__NEXT_DATA__ = window.__NEXT_DATA__ || {};
                window.__NEXT_DATA__.dev = false;
              }
            `,
          }}
        />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
