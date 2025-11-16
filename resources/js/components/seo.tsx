import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "article";
    author?: string;
    publishedTime?: string;
    tags?: string[];
}

const DEFAULT_TITLE = "BroderLab - Blog de Tecnologia";
const DEFAULT_DESCRIPTION =
    "Artigos sobre desenvolvimento de software, arquitetura de sistemas, frontend, backend e performance.";
const DEFAULT_IMAGE = "https://blog.devbroder.com/images/og-default.jpg";
const SITE_URL = "https://blog.devbroder.com";

export const SEO = ({
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    url = SITE_URL,
    type = "website",
    author,
    publishedTime,
    tags,
}: SEOProps) => {
    const fullTitle = title ? `${title} | BroderLab` : DEFAULT_TITLE;
    const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:site_name" content="Dev" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {author && <meta name="author" content={author} />}
            {publishedTime && (
                <meta
                    property="article:published_time"
                    content={publishedTime}
                />
            )}
            {tags?.map(tag => (
                <meta key={tag} property="article:tag" content={tag} />
            ))}

            <link rel="canonical" href={fullUrl} />
        </Helmet>
    );
};
