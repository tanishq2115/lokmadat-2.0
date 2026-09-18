"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase";

export default function AdminPage() {
  const supabase = createClient();

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState("epaper");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const [paperTitle, setPaperTitle] = useState("");
  const [paperLocation, setPaperLocation] = useState("");
  const [paperFiles, setPaperFiles] = useState([]);

  const [articleTitle, setArticleTitle] = useState("");
  const [articleLocation, setArticleLocation] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleFiles, setArticleFiles] = useState([]);

  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      window.location.href = "/login";
      return;
    }

    setSession(data.session);

    const { data: p } = await supabase
      .from("profiles")
      .select("id,full_name,role")
      .eq("id", data.session.user.id)
      .maybeSingle();

    if (!p) {
      await supabase.auth.signOut();
      window.location.href = "/login";
      return;
    }

    setProfile(p);
  }

  function showStatus(message) {
    setStatus(message);
    setTimeout(() => setStatus(""), 5000);
  }

  function makeId() {
    if (
      window.crypto &&
      typeof window.crypto.randomUUID === "function"
    ) {
      return window.crypto.randomUUID();
    }

    return (
