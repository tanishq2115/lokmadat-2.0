import Link from "next/link";
import Header from "../components/Header";
import { createClient } from "../lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();

  const today = new Date();
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);

  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .neq("epaper_layout", "direct-newspaper")
    .gte("published_at", start.toISOString())
    .lte("published_at", end.toISOString())
    .order("published_at", { ascending: false });

  const { data: epapers } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .eq("epaper_layout", "direct-newspaper")
    .order("published_at", { ascending: false })
    .limit(2);

  return (
    <>
      <Header />

      <main className="page">
        <section className="hero">
          <h1>लोकमदत</h1>
          <p>
            महाराष्ट्रातील ताज्या आणि महत्त्वाच्या बातम्या
          </p>
        </section>

        <section>
          <h2 className="section-title">ताज्या बातम्या</h2>

          {!news || news.length === 0 ? (
            <div className="empty-state">
              <h2>आजच्या बातम्या उपलब्ध नाहीत</h2>
              <p>लवकरच नवीन बातम्या प्रकाशित केल्या जातील.</p>
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
                    key={item.id}
                    className="news-card"
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
                        {item.location && `📍 ${item.location}`}
                        {item.published_at &&
                          ` • ${new Date(
                            item.published_at
                          ).toLocaleDateString("mr-IN")}`}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="section-title">ई-पेपर</h2>

          {!epapers || epapers.length === 0 ? (
            <div className="empty-state">
              <p>सध्या ई-पेपर उपलब्ध नाही.</p>
            </div>
          ) : (
            <div className="epaper-list">
              {epapers.map((paper) => {
                const title =
                  paper.headline ||
                  paper.title ||
                  "लोकमदत ई-पेपर";

                const image =
                  paper.main_image_url ||
                  paper.image_url ||
                  paper.cover_image ||
                  paper.image;

                return (
                  <Link
                    href={`/news/${paper.id}`}
                    key={paper.id}
                    className="epaper-card"
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

                      {paper.published_at && (
                        <p>
                          📅{" "}
                          {new Date(
                            paper.published_at
                          ).toLocaleDateString("mr-IN")}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <p style={{ marginTop: "20px" }}>
            <Link href="/epaper" className="read-button">
              सर्व ई-पेपर पाहा →
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
