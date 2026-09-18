import Link from "next/link";
import Header from "../../components/Header";
import { createClient } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const supabase = createClient();

  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .neq("epaper_layout", "direct-newspaper")
    .order("published_at", { ascending: false });

  return (
    <>
      <Header />

      <main className="page">
        <div className="page-header">
          <Link href="/" className="back-link">
            ← मुख्यपृष्ठ
          </Link>

          <h1>सर्व बातम्या</h1>
          <p>लोकमदतच्या प्रकाशित बातम्यांचा संग्रह</p>
        </div>

        {error ? (
          <div className="empty-state">
            <h2>बातम्या लोड करता आल्या नाहीत</h2>
            <p>कृपया पुन्हा प्रयत्न करा.</p>
          </div>
        ) : !news || news.length === 0 ? (
          <div className="empty-state">
            <h2>बातम्या उपलब्ध नाहीत</h2>
          </div>
        ) : (
          <div className="news-grid">
            {news.map((item) => {
              const title =
                item.headline ||
                item.title ||
                "लोकमदत बातमी";

              const image =
                item.main_image_url ||
                item.image_url ||
                item.cover_image ||
                item.image;

              return (
                <Link
                  href={`/news/${item.id}`}
                  className="news-card"
                  key={item.id}
                >
                  {image && (
                    <img
                      src={image}
                      alt={title}
                      className="news-card-image"
                    />
                  )}

                  <div className="news-card-content">
                    <h2>{title}</h2>

                    <div className="news-meta">
                      {item.location && (
                        <span>📍 {item.location}</span>
                      )}

                      {item.published_at && (
                        <span>
                          {" • "}
                          {new Date(
                            item.published_at
                          ).toLocaleDateString("mr-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
