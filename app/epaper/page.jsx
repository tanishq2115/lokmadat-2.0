import Link from "next/link";
import { createClient } from "../../lib/supabase";

export const dynamic = "force-dynamic";

async function getEPapers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .eq("epaper_layout", "direct-newspaper")
    .order("published_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export default async function EpaperPage() {
  const papers = await getEPapers();

  return (
    <main className="epaper-page">

      <div className="epaper-container">

        <div className="epaper-top">
          <Link href="/">
            ← मुख्यपृष्ठ
          </Link>
        </div>

        <header className="epaper-heading">
          <small>E-PAPER</small>
          <h1>लोकमदत ई-पेपर</h1>
          <p>
            प्रकाशित झालेले सर्व ई-पेपर अंक
          </p>
        </header>

        {papers.length === 0 ? (
          <div className="empty-state">
            सध्या कोणताही ई-पेपर उपलब्ध नाही.
          </div>
        ) : (
          <div className="epaper-list">

            {papers.map((paper) => {

              const image =
                paper.main_image_url ||
                paper.image_url ||
                null;

              const date =
                paper.published_at ||
                paper.created_at;

              return (
                <article
                  className="epaper-card"
                  key={paper.id}
                >

                  {image && (
                    <img
                      src={image}
                      alt={paper.headline || "लोकमदत ई-पेपर"}
                    />
                  )}

                  <div className="epaper-card-content">

                    <h2>
                      {paper.headline ||
                        "लोकमदत ई-पेपर"}
                    </h2>

                    {paper.location && (
                      <p>
                        📍 {paper.location}
                      </p>
                    )}

                    {date && (
                      <small>
                        {new Date(date).toLocaleDateString(
                          "mr-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </small>
                    )}

                    <Link
                      href={`/news/${paper.id}`}
                      className="epaper-open"
                    >
                      ई-पेपर उघडा →
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
