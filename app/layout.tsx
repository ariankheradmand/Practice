import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MovieHub - Discover and Explore Movies and TV Shows",
  description:
    "Browse the latest movies and TV shows, discover trending content, and explore by genres with MovieHub - your ultimate entertainment guide.",
  keywords: [
    "movies",
    "tv shows",
    "entertainment",
    "film",
    "streaming",
    "watch online",
  ],
  authors: [{ name: "MovieHub Team" }],
  openGraph: {
    title: "MovieHub - Discover and Explore Movies and TV Shows",
    description:
      "Browse the latest movies and TV shows, discover trending content, and explore by genres with MovieHub - your ultimate entertainment guide.",
    url: "https://moviehub.example.com",
    siteName: "MovieHub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MovieHub - Discover Movies and TV Shows",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieHub - Discover and Explore Movies and TV Shows",
    description:
      "Browse the latest movies and TV shows, discover trending content, and explore by genres with MovieHub - your ultimate entertainment guide.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased `}>{children}</body>
    </html>
  );
}
