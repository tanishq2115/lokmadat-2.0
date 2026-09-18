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
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    setSession(session);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", session.user.id)
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
      function (c) {
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
        `${session.user.id}/` +
        `${newsId}/` +
        `${Date.now()}-${i}.${extension}`;

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

      let imageUrls = [];

      if (articleFiles.length > 0) {
        imageUrls = await uploadFiles(articleFiles, newsId);
      }

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
        seo_description: articleContent
          .trim()
          .slice(0, 160),
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
        "❌ बातमी प्रकाशित करता आली नाही: " +
          error.message
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

      const imageUrls = await uploadFiles(
        paperFiles,
        newsId
      );

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
          throw photo
