import "@/app/globals.css";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import SEO from "@/components/SEO";

export default function MyApp({ Component, pageProps }) {
  // Get the pathname from the pageProps
  const canonicalPath = pageProps.canonical || "";

  return (
    <WatchlistProvider>
      {/* Default SEO - will be overridden by page-specific SEO */}
      <SEO canonical={canonicalPath} />
      <Component {...pageProps} />
    </WatchlistProvider>
  );
}
