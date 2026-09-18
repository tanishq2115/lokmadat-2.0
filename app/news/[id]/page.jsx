import Link from "next/link";
import { createClient } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function EPaperPage() {
  const supabase = createClient();

  const { data: editions, error } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .eq("epaper_layout", "direct-newspaper")
    .order("published_at", { ascending: false });

  if (error) {
    return (
      <main className="page">
        <Link href="/" className="back-link">
          ← मुख्यपृष्ठ
        </Link>
        <h1>ई-पेपर</h1>
        <p>ई-पेपर लोड करताना समस्या आली.</p>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-header">
        <Link href="/" className="back-link">
          ← मुख्यपृष्ठ
        </Link>

        <h1>ई-पेपर</h1>
        <p>लोकमदतच्या प्रकाशित ई-पेपर आवृत्त्या</p>
      </div>

      {!editions || editions.length === 0 ? (
        <div className="empty-state">
          <h2>ई-पेपर उपलब्ध नाही</h2>
          <p>
            सध्या कोणतीही ई-पेपर आवृत्ती प्रकाशित केलेली नाही.
          </p>
        </div>
      ) : (
        <div className="epaper-list">
          {editions.map((edition) => {
            const title =
              edition.headline ||
              edition.title ||
              "लोकमदत ई-पेपर";

            const image =
              edition.main_image_url ||
              edition.image_url ||
              edition.cover_image ||
              edition.image;

            return (
              <article
                className="epaper-card"
                key={edition.id}
              >
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className="epaper-cover"
                  />
                )}

                <div className="epaper-card-content">
                  <h2>{title}</h2>

                  {edition.location && (
                    <p>📍 {edition.location}</p>
                  )}

                  {edition.published_at && (
                    <p>
                      📅{" "}
                      {new Date(
                        edition.published_at
                      ).toLocaleDateString("mr-IN")}
                    </p>
                  )}

                  <Link
                    href={`/news/${edition.id}`}
                    className="read-button"
                  >
                    ई-पेपर वाचा →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
