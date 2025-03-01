import "@/app/globals.css";
import { WatchlistProvider } from "@/contexts/WatchlistContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <WatchlistProvider>
      <Component {...pageProps} />
    </WatchlistProvider>
  );
}
