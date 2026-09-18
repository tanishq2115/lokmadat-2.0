import Link from "next/link";
import Header from "../components/Header";
import { createClient } from "../lib/supabase";

export const dynamic = "force-dynamic";

function isToday(dateString) {
  if (!dateString) return false;

  const date = new Date(dateString);

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const itemDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(date);

  return today === itemDate;
}

export default async function HomePage() {
  const supabase = createClient();

  const { data: allNews } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .neq("epaper_layout", "direct-newspaper")
    .order("published_at", { ascending: false })
    .limit(30);

  const { data: epapers } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .eq("epaper_layout", "direct-newspaper")
    .order("published_at", { ascending: false })
    .limit(2);

  const todayNews = (allNews || []).filter((item) =>
    isToday(item.published_at)
  );

  return (
    <div className="home-page">
      <Header />

      <section className="hero">
        <div className="hero-inner">
          <h1>लोकमदत</h1>
          <p>महाराष्ट्रातील ताज्या आणि महत्त्वाच्या बातम्या</p>
        </div>
      </section>

      <main className="page">

        {/* TODAY'S NEWS */}

        <section>
          <div className="page-header">
            <h1>ताज्या बातम्या</h1>
            <p>आज प्रकाशित झालेल्या बातम्या</p>
          </div>

          {todayNews.length === 0 ? (
            <div className="empty-state">
              <div className="news-card-content">
                <h2>आजच्या बातम्या लवकरच...</h2>
                <p>
                  आज अद्याप कोणतीही बातमी प्रकाशित केलेली नाही.
                </p>

                <Link href="/archive" className="read-button">
                  जुन्या बातम्या पाहा →
                </Link>
              </div>
            </div>
          ) : (
            <div className="news-grid">
              {todayNews.map((item) => {
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
                  <article className="news-card" key={item.id}>
                    {image && (
                      <img
                        src={image}
                        alt={title}
                        className="news-card-image"
                      />
                    )}

                    <div className="news-card-content">
                      <h2>{title}</h2>

                      {item.location && (
                        <p>📍 {item.location}</p>
                      )}

                      {item.published_at && (
                        <p>
                          📅{" "}
                          {new Date(
                            item.published_at
                          ).toLocaleDateString("mr-IN")}
                        </p>
                      )}

                      <Link
                        href={`/news/${item.id}`}
                        className="read-button"
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

        {/* EPAPER */}

        <section style={{ marginTop: "55px" }}>
          <div className="page-header">
            <h1>ई-पेपर</h1>
            <p>लोकमदतच्या नवीनतम आवृत्त्या</p>
          </div>

          {!epapers || epapers.length === 0 ? (
            <div className="empty-state">
              <div className="news-card-content">
                <h2>ई-पेपर उपलब्ध नाही</h2>
                <p>
                  सध्या कोणतीही ई-पेपर आवृत्ती प्रकाशित केलेली नाही.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="epaper-list">
                {epapers.map((edition) => {
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

              <div style={{ marginTop: "20px" }}>
                <Link
                  href="/epaper"
                  className="read-button"
                >
                  सर्व ई-पेपर पाहा →
                </Link>
              </div>
            </>
          )}
        </section>

        {/* ARCHIVE LINK */}

        <section style={{ marginTop: "55px" }}>
          <div className="empty-state">
            <div className="news-card-content">
              <h2>सर्व बातम्या</h2>
              <p>
                लोकमदतच्या प्रकाशित सर्व बातम्या पाहण्यासाठी
                आर्काइव्हला भेट द्या.
              </p>

              <Link
                href="/archive"
                className="read-button"
              >
                बातमी संग्रह पाहा →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
