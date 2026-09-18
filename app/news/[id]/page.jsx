import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase";
import ShareButtons from "../../../components/ShareButtons";

export const dynamic = "force-dynamic";

async function getNews(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (error || !data) return null;

  return data;
}

function getImageUrl(news) {
  return (
    news.image_url ||
    news.cover_image ||
    news.image ||
    null
  );
}

export async function generateMetadata({ params }) {
  const news = await getNews(params.id);

  if (!news) {
    return {
      title: "बातमी सापडली नाही | लोकमदत",
    };
  }

  const title =
    news.header ||
    news.title ||
    "लोकमदत";

  const description = (
    news.content ||
    news.body ||
    news.story ||
    "लोकमदत — महाराष्ट्रातील ताज्या बातम्या"
  ).substring(0, 160);

  const image = getImageUrl(news);

  return {
    title: `${title} | लोकमदत`,
    description,

    openGraph: {
      title,
      description,
      type: "article",
      ...(image ? { images: [image] } : {}),
    },

    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function NewsPage({ params }) {
  const news = await getNews(params.id);

  if (!news) notFound();

  const title =
    news.header ||
    news.title ||
    "लोकमदत बातमी";

  const location =
    news.location ||
    news.place ||
    "";

  const content =
    news.content ||
    news.body ||
    news.story ||
    "";

  const image = getImageUrl(news);

  const date =
    news.published_at ||
    news.created_at;

  const formattedDate = date
    ? new Date(date).toLocaleString("mr-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <main className="article-page">
      <article className="article-container">

        <div className="article-top">
          <a href="/" className="back-link">
            ← मुख्यपृष्ठ
          </a>
        </div>

        <header className="article-header">
          <h1>{title}</h1>

          {(location || formattedDate) && (
            <div className="article-meta">
              {location && (
                <span>📍 {location}</span>
              )}

              {formattedDate && (
                <span>🕒 {formattedDate}</span>
              )}
            </div>
          )}
        </header>

        {image && (
          <div className="article-image">
            <img
              src={image}
              alt={title}
            />
          </div>
        )}

        <div className="article-content">
          {content
            .split("\n")
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
        </div>

        <ShareButtons title={title} />

        <div className="article-bottom">
          <a href="/">
            ← आणखी बातम्या
          </a>
        </div>

      </article>
    </main>
  );
}
