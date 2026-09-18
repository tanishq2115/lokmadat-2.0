import Link from "next/link";
import { createClient } from "../lib/supabase";
import Header from "../components/Header";

export const dynamic = "force-dynamic";

async function getNews() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .neq("epaper_layout", "direct-newspaper")
    .order("published_at", { ascending: false })
    .limit(2);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export default async function HomePage() {
  const news = await getNews();

  return (
    <>
      <Header />

      <main className="home-page">

        <section className="hero">
          <div className="hero-inner">
            <span>महाराष्ट्रातील आपले विश्वासू वृत्तमाध्यम</span>

            <h1>लोकमदत</h1>

            <p>
              ताज्या आणि महत्त्वाच्या बातम्या थेट आपल्या मोबाईलवर.
            </p>
          </div>
        </section>

        <section className="latest-news">
          <div className="section-heading">
            <div>
              <small>NEWS</small>
              <h2>ताज्या बातम्या</h2>
            </div>

            <Link href="/archive">
              सर्व बातम्या →
            </Link>
          </div>

          {news.length === 0 ? (
            <div className="empty-state">
              आजच्या बातम्या उपलब्ध नाहीत.
            </div>
          ) : (
            <div className="news-grid">

              {news.map((item) => {
                const title =
                  item.headline ||
                  item.header ||
                  item.title ||
                  "लोकमदत बातमी";

                const image =
                  item.main_image_url ||
                  item.image_url ||
                  item.cover_image ||
                  null;

                return (
                  <article
                    className="news-card"
                    key={item.id}
                  >

                    {image && (
                      <img
                        src={image}
                        alt={title}
                      />
                    )}

                    <div className="news-card-body">

                      {item.location && (
                        <span className="news-location">
                          📍 {item.location}
                        </span>
                      )}

                      <h3>
                        <Link href={`/news/${item.id}`}>
                          {title}
                        </Link>
                      </h3>

                      <p>
                        {(
                          item.content ||
                          item.body ||
                          ""
                        ).slice(0, 150)}
                        {item.content?.length > 150 ? "..." : ""}
                      </p>

                      <Link
                        href={`/news/${item.id}`}
                        className="read-more"
                      >
                        पूर्ण बातमी वाचा →
                      </Link>

                    </div>

                  </article>
                );
              })}

            </div>
          )}
        </section>

        <section className="epaper-section">
          <div className="section-heading">
            <div>
              <small>E-PAPER</small>
              <h2>ई-पेपर</h2>
            </div>

            <Link href="/epaper">
              सर्व अंक →
            </Link>
          </div>

          <div className="epaper-placeholder">
            <h3>📰 लोकमदत ई-पेपर</h3>
            <p>
              आजचा आणि मागील अंक पाहण्यासाठी ई-पेपर विभागाला भेट द्या.
            </p>

            <Link href="/epaper">
              ई-पेपर पहा →
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
