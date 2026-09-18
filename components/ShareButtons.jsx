"use client";

import { useState } from "react";

export default function ShareButtons({ title }) {
  const [copied, setCopied] = useState(false);

  async function getShareUrl() {
    return window.location.href;
  }

  async function shareToApps() {
    const url = await getShareUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "लोकमदत",
          text: title || "लोकमदत",
          url,
        });
      } catch {
        // User cancelled sharing.
      }
      return;
    }

    await copyLink();
  }

  async function shareToWhatsApp() {
    const url = await getShareUrl();

    const text = `${title || "लोकमदत"}\n${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function copyLink() {
    const url = await getShareUrl();

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      window.prompt("ही लिंक कॉपी करा:", url);
    }
  }

  return (
    <div className="article-share">
      <button
        type="button"
        className="share-primary"
        onClick={shareToApps}
      >
        📤 Share to Apps
      </button>

      <button
        type="button"
        className="share-whatsapp"
        onClick={shareToWhatsApp}
      >
        🟢 Share to WhatsApp
      </button>

      <button
        type="button"
        onClick={copyLink}
      >
        {copied ? "✅ Link Copied" : "🔗 Copy Link"}
      </button>
    </div>
  );
}
