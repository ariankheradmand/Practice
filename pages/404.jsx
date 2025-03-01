// pages/404.js
import SEO from "@/components/SEO";

export default function Custom404() {
  return (
    <div
      className=""
      style={{ textAlign: "center", marginTop: "50px", fontFamily: "Nunito" }}
    >
      <SEO
        title="Page Not Found - MovieHub"
        description="The page you are looking for could not be found."
        canonical="/404"
        openGraph={{
          images: [
            {
              url: "/404-og-image.jpg",
              width: 1200,
              height: 630,
              alt: "Page Not Found",
            },
          ],
        }}
        // Tell search engines not to index this page
        robots="noindex, nofollow"
      />
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for does not exist.</p>
    </div>
  );
}
