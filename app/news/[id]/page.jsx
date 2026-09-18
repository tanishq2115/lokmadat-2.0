import Link from "next/link";
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
    .eq("status", "published")
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getPhotos(id) {
  const supabase = createClient();

  const { data } = await supabase
    .from("news_photos")
    .select("*")
    .eq("news_id", id)
    .order("created_at", { ascending: true });

  return data || [];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await getNews(id);

  if (!item) {
    return {
      title: "बातमी सापडली | लोकमदत",
    };
  }

  const title =
    item.headline ||
    item.title ||
    "लोकमदत";

  const description =
    item.seo_description ||
    item.content?.slice(0, 160) ||
    "लोकमदत — महाराष्ट्रातील ताज्या बातम्या.";

  const image =
    item.main_image_url ||
    item.image_url ||
    item.cover_image ||
    item.image;

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
  const { id } = await params;

  const item = await getNews(id);

  if (!item) {
    notFound();
  }

  const photos = await getPhotos(id);

  const title =
    item.headline ||
    item.title ||
    "लोकमदत";

  const mainImage =
    item.main_image_url ||
    item.image_url ||
    item.cover_image ||
    item.image;

  const isEpaper =
    item.epaper_layout === "direct-newspaper";

  if (isEpaper) {
    const pages = [];

    if (mainImage) {
      pages.push(mainImage);
    }

    for (const photo of photos) {
      const image =
        photo.image_url ||
        photo.url ||
        photo.photo_url;

      if (image && !pages.includes(image)) {
        pages.push(image);
      }
    }

    return (
      <main className="article-page">
        <Link href="/epaper" className="back-link">
          ← ई-पेपर
        </Link>

        <h1 className="article-title">
          {title}
        </h1>

        <div className="article-meta">
          {item.location && `📍 ${item.location}`}

          {item.published_at &&
            ` • ${new Date(
              item.published_at
            ).toLocaleDateString("mr-IN")}`}
        </div>

        <div className="epaper-reader">
          {pages.length === 0 ? (
            <div className="empty-state">
              ई-पेपरचे पेज उपलब्ध नाही.
            </div>
          ) : (
            pages.map((url, index) => (
              <img
                key={`${url}-${index}`}
                src={url}
                alt={`${title} - पेज ${index + 1}`}
                className="epaper-page"
              />
            ))
          )}
        </div>

        <ShareButtons title={title} />
      </main>
    );
  }

  const content =
    item.content ||
    item.body ||
    item.story ||
    "";

  const paragraphs = content
    .split(/\n+/)
    .map((text) => text.trim())
    .filter(Boolean);

  return (
    <main className="article-page">
      <Link href="/" className="back-link">
        ← मुख्यपृष्ठ
      </Link>

      <h1 className="article-title">
        {title}
      </h1>

      <div className="article-meta">
        {item.location && `📍 ${item.location}`}

        {item.published_at &&
          ` • ${new Date(
            item.published_at
          ).toLocaleDateString("mr-IN")}`}
      </div>

      {mainImage && (
        <img
          src={mainImage}
          alt={title}
          className="article-image"
        />
      )}

      <ShareButtons title={title} />

      <article className="article-content">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <p key={index}>
              {paragraph}
            </p>
          ))
        ) : (
          <p>
            या बातमीचा मजकूर उपलब्ध नाही.
          </p>
        )}
      </article>

      {photos.length > 0 && (
        <section>
          <h2 className="section-title">
            अधिक फोटो
          </h2>

          <div className="news-grid">
            {photos.map((photo, index) => {
              const image =
                photo.image_url ||
                photo.url ||
                photo.photo_url;

              if (!image) {
                return null;
              }

              return (
                <img
                  key={photo.id || index}
                  src={image}
                  alt={`${title} फोटो ${index + 1}`}
                  className="news-card-image"
                />
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
