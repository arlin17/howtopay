import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cheddarl.ink - One Link, All Your Payment Methods | Get Paid Faster",
  description:
    "Create a free payment link that shows all your payment options in one place. Perfect for freelancers, small businesses, side hustles, and splitting bills. Accept Venmo, Cash App, PayPal, Zelle, crypto, and more.",
  keywords: [
    "payment link",
    "pay me link",
    "venmo link",
    "cashapp link",
    "payment page",
    "freelancer payments",
    "small business payments",
    "accept payments",
    "split bills",
    "tip jar",
    "digital tip jar",
    "QR code payments",
    "payment aggregator",
    "get paid online",
    "side hustle payments",
  ],
  authors: [{ name: "Cheddarl.ink" }],
  creator: "Cheddarl.ink",
  publisher: "Cheddarl.ink",
  metadataBase: new URL("https://cheddarl.ink"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cheddarl.ink",
    siteName: "Cheddarl.ink",
    title: "One Link for All Your Payment Methods",
    description:
      "Stop asking 'Do you have Venmo?' Create a free payment page with all your payment options. Perfect for freelancers, creators, and anyone who needs to get paid.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cheddarl.ink - One link, all your payment methods",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cheddarl.ink - One Link, All Your Payment Methods",
    description:
      "Create a free payment page with Venmo, Cash App, PayPal, Zelle, and more. Perfect for freelancers and small businesses.",
    images: ["/og-image.png"],
    creator: "@cheddarlink",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when you have the verification codes
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
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
        {children}
      </body>
    </html>
  );
}
