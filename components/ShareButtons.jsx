"use client";

export default function ShareButtons({ title }) {
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "";

  async function shareToApps() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "लोकमदत",
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await copyLink();
      alert("Link copied. You can share it in any app.");
    }
  }

  async function shareToWhatsApp() {
    const text = `${title || "लोकमदत"}\n${shareUrl}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    } catch (error) {
      alert("Unable to copy link.");
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
        🔗 Copy Link
      </button>

    </div>
  );
}
