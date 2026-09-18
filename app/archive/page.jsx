import Link from "next/link";
import { createClient } from "../../lib/supabase";

export const dynamic = "force-dynamic";

async function getNews() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export default async function ArchivePage() {
  const news = await getNews();

  return (
    <main className="archive-page">
      <div className="archive-container">

        <div className="archive-heading">
          <Link href="/" className="back-link">
            ← मुख्यपृष्ठ
          </Link>

          <h1>📰 बातम्यांचे संग्रहालय</h1>
          <p>लोकमदतमधील प्रकाशित बातम्या</p>
        </div>

        {news.length === 0 ? (
          <div className="empty-state">
            सध्या कोणत्याही बातम्या उपलब्ध नाहीत.
          </div>
        ) : (
          <div className="archive-list">

            {news.map((item) => {
              const title =
                item.header ||
                item.title ||
                "लोकमदत बातमी";

              const image =
                item.image_url ||
                item.cover_image ||
                item.image ||
                null;

              const date =
                item.published_at ||
                item.created_at;

              return (
                <article
                  className="archive-card"
                  key={item.id}
                >

                  {image && (
                    <img
                      src={image}
                      alt={title}
                      className="archive-card-image"
                    />
                  )}

                  <div className="archive-card-content">

                    <h2>
                      <Link href={`/news/${item.id}`}>
                        {title}
                      </Link>
                    </h2>

                    {item.location && (
                      <div className="archive-location">
                        📍 {item.location}
                      </div>
                    )}

                    {date && (
                      <div className="archive-date">
                        {new Date(date).toLocaleDateString(
                          "mr-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </div>
                    )}

                    <Link
                      href={`/news/${item.id}`}
                      className="read-more"
                    >
                      बातमी वाचा →
                    </Link>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}
