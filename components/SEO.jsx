import Head from "next/head";

/**
 * Reusable SEO component for pages in the Pages Router
 *
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} [props.canonical] - Canonical URL for the page
 * @param {Object} [props.openGraph] - Open Graph metadata
 * @param {Array} [props.keywords] - Keywords for meta tags
 */
const SEO = ({
  title = "MovieHub - Discover and Explore Movies and TV Shows",
  description = "Browse the latest movies and TV shows, discover trending content, and explore by genres with MovieHub - your ultimate entertainment guide.",
  canonical,
  openGraph,
  keywords = [
    "movies",
    "tv shows",
    "entertainment",
    "film",
    "streaming",
    "watch online",
  ],
}) => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://moviehub.example.com";
  const defaultOG = {
    title: title,
    description: description,
    url: canonical ? `${siteUrl}${canonical}` : siteUrl,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    site_name: "MovieHub",
  };

  const og = { ...defaultOG, ...openGraph };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={og.url} />
      <meta property="og:title" content={og.title} />
      <meta property="og:description" content={og.description} />
      <meta property="og:site_name" content={og.site_name} />
      {og.images && og.images[0] && (
        <>
          <meta property="og:image" content={og.images[0].url} />
          <meta
            property="og:image:width"
            content={og.images[0].width?.toString()}
          />
          <meta
            property="og:image:height"
            content={og.images[0].height?.toString()}
          />
          <meta property="og:image:alt" content={og.images[0].alt} />
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={og.title} />
      <meta name="twitter:description" content={og.description} />
      {og.images && og.images[0] && (
        <meta name="twitter:image" content={og.images[0].url} />
      )}

      {/* Robots */}
      <meta name="robots" content="index, follow" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </Head>
  );
};

export default SEO;
