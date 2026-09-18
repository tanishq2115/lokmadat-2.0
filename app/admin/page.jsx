"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase";

export default function AdminPage() {
  const supabase = createClient();

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("article");

  const [articleHeadline, setArticleHeadline] = useState("");
  const [articleLocation, setArticleLocation] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleFiles, setArticleFiles] = useState([]);

  const [paperHeadline, setPaperHeadline] = useState("");
  const [paperLocation, setPaperLocation] = useState("");
  const [paperCategory, setPaperCategory] = useState("");
  const [paperFiles, setPaperFiles] = useState([]);

  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    if (!currentSession) {
      window.location.href = "/login";
      return;
    }

    setSession(currentSession);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", currentSession.user.id)
      .single();

    if (!profileData) {
      setMessage("आपल्या प्रोफाइलची माहिती सापडली नाही.");
    } else {
      setProfile(profileData);
    }

    setLoading(false);
  }

  function makeId() {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  async function uploadFiles(files, newsId) {
    const uploaded = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const path =
        `${session.user.id}/${newsId}/${Date.now()}-${i}.${extension}`;

      const { error } = await supabase.storage
        .from("news-images")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("news-images")
        .getPublicUrl(path);

      uploaded.push(data.publicUrl);
    }

    return uploaded;
  }

  async function publishArticle(event) {
    event.preventDefault();

    if (!articleHeadline.trim()) {
      setMessage("मुख्य मथळा आवश्यक आहे.");
      return;
    }

    if (!articleContent.trim()) {
      setMessage("बातमीचा मजकूर आवश्यक आहे.");
      return;
    }

    setPublishing(true);
    setMessage("");

    try {
      const newsId = makeId();

      const imageUrls =
        articleFiles.length > 0
          ? await uploadFiles(articleFiles, newsId)
          : [];

      const { error } = await supabase.from("news").insert({
        id: newsId,
        headline: articleHeadline.trim(),
        location: articleLocation.trim() || null,
        content: articleContent.trim(),
        reporter_id: session.user.id,
        main_image_url: imageUrls[0] || null,
        epaper_layout: "auto",
        status: "published",
        published_at: new Date().toISOString(),
        seo_title: articleHeadline.trim(),
        seo_description: articleContent.trim().slice(0, 160),
      });

      if (error) {
        throw error;
      }

      for (let i = 1; i < imageUrls.length; i++) {
        const { error: photoError } = await supabase
          .from("news_photos")
          .insert({
            news_id: newsId,
            image_url: imageUrls[i],
          });

        if (photoError) {
          throw photoError;
        }
      }

      setArticleHeadline("");
      setArticleLocation("");
      setArticleContent("");
      setArticleFiles([]);

      setMessage("✅ बातमी यशस्वीपणे प्रकाशित झाली.");
    } catch (error) {
      setMessage(
        "❌ बातमी प्रकाशित करता आली नाही: " + error.message
      );
    } finally {
      setPublishing(false);
    }
  }

  async function publishEpaper(event) {
    event.preventDefault();

    if (!paperHeadline.trim()) {
      setMessage("ई-पेपरचे शीर्षक आवश्यक आहे.");
      return;
    }

    if (paperFiles.length === 0) {
      setMessage("किमान एक ई-पेपर पेज निवडा.");
      return;
    }

    setPublishing(true);
    setMessage("");

    try {
      const newsId = makeId();
      const imageUrls = await uploadFiles(paperFiles, newsId);

      const { error } = await supabase.from("news").insert({
        id: newsId,
        headline: paperHeadline.trim(),
        location: paperLocation.trim() || null,
        categories: paperCategory.trim() || null,
        main_image_url: imageUrls[0],
        epaper_layout: "direct-newspaper",
        status: "published",
        published_at: new Date().toISOString(),
        reporter_id: session.user.id,
      });

      if (error) {
        throw error;
      }

      for (let i = 1; i < imageUrls.length; i++) {
        const { error: photoError } = await supabase
          .from("news_photos")
          .insert({
            news_id: newsId,
            image_url: imageUrls[i],
          });

        if (photoError) {
          throw photoError;
        }
      }

      setPaperHeadline("");
      setPaperLocation("");
      setPaperCategory("");
      setPaperFiles([]);

      setMessage("✅ ई-पेपर यशस्वीपणे प्रकाशित झाले.");
    } catch (error) {
      setMessage(
        "❌ ई-पेपर प्रकाशित करता आले नाही: " + error.message
      );
    } finally {
      setPublishing(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-card">
          <p>न्यूजरूम लोड होत आहे...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-card admin-topbar">
        <div>
          <h1>लोकमदत न्यूजरूम</h1>

          {profile && (
            <p>
              👤 {profile.full_name || session.user.email}
            </p>
          )}
        </div>

        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="admin-card">
        <h2>प्रकाशन प्रकार</h2>

        <div className="admin-mode-buttons">
          <button
            type="button"
            className={mode === "epaper" ? "active" : ""}
            onClick={() => {
              setMode("epaper");
              setMessage("");
            }}
          >
            📰 फक्त ई-पेपर
          </button>

          <button
            type="button"
            className={mode === "article" ? "active" : ""}
            onClick={() => {
              setMode("article");
              setMessage("");
            }}
          >
            ✍️ बातमी / News Article
          </button>
        </div>
      </div>

      {message && (
        <div className="admin-card">
          <strong>{message}</strong>
        </div>
      )}

      {mode === "article" ? (
        <div className="admin-card">
          <h2>✍️ नवीन बातमी</h2>

          <form
            className="admin-form"
            onSubmit={publishArticle}
          >
            <label htmlFor="article-headline">
              मुख्य मथळा *
            </label>

            <input
              id="article-headline"
              value={articleHeadline}
              onChange={(e) =>
                setArticleHeadline(e.target.value)
              }
              placeholder="बातमीचा मुख्य मथळा"
              required
            />

            <label htmlFor="article-location">
              ठिकाण
            </label>

            <input
              id="article-location"
              value={articleLocation}
              onChange={(e) =>
                setArticleLocation(e.target.value)
              }
              placeholder="उदा. मुंबई"
            />

            <label htmlFor="article-photo">
              फोटो
            </label>

            <input
              id="article-photo"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setArticleFiles(
                  Array.from(e.target.files || [])
                )
              }
            />

            <label htmlFor="article-content">
              बातमीचा संपूर्ण मजकूर *
            </label>

            <textarea
              id="article-content"
              value={articleContent}
              onChange={(e) =>
                setArticleContent(e.target.value)
              }
              placeholder="येथे संपूर्ण बातमी लिहा..."
              required
            />

            <button
              type="submit"
              disabled={publishing}
            >
              {publishing
                ? "प्रकाशित करत आहे..."
                : "बातमी प्रकाशित करा"}
            </button>
          </form>
        </div>
      ) : (
        <div className="admin-card">
          <h2>📰 नवीन ई-पेपर</h2>

          <form
            className="admin-form"
            onSubmit={publishEpaper}
          >
            <label htmlFor="paper-headline">
              ई-पेपर शीर्षक *
            </label>

            <input
              id="paper-headline"
              value={paperHeadline}
              onChange={(e) =>
                setPaperHeadline(e.target.value)
              }
              placeholder="उदा. लोकमदत — 18 सप्टेंबर 2026"
              required
            />

            <label htmlFor="paper-location">
              ठिकाण
            </label>

            <input
              id="paper-location"
              value={paperLocation}
              onChange={(e) =>
                setPaperLocation(e.target.value)
              }
              placeholder="उदा. मुंबई"
            />

            <label htmlFor="paper-category">
              विभाग
            </label>

            <input
              id="paper-category"
              value={paperCategory}
              onChange={(e) =>
                setPaperCategory(e.target.value)
              }
              placeholder="विभाग"
            />

            <label htmlFor="paper-pages">
              ई-पेपर पेज *
            </label>

            <input
              id="paper-pages"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setPaperFiles(
                  Array.from(e.target.files || [])
                )
              }
              required
            />

            <button
              type="submit"
              disabled={publishing}
            >
              {publishing
                ? "प्रकाशित करत आहे..."
                : "ई-पेपर प्रकाशित करा"}
            </button>
          </form>
        </div>
      )}

      <div className="admin-card">
        <h2>महत्त्वाची माहिती</h2>

        <p>
          प्रकाशित केलेली बातमी किंवा ई-पेपर सार्वजनिक
          वेबसाइटवर दिसेल.
        </p>

        <p>
          ई-पेपरमधील निवडलेली सर्व पेजेस एकाच आवृत्तीमध्ये
          जोडली जातील.
        </p>
      </div>
    </main>
  );
  }
