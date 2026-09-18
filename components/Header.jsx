import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">

        <Link href="/" className="brand">
          <img
            src="/lokmadat-logo.png"
            alt="लोकमदत"
            className="brand-logo"
          />
        </Link>

        <nav className="main-nav">
          <Link href="/">मुख्यपृष्ठ</Link>
          <Link href="/archive">सर्व बातम्या</Link>
          <Link href="/epaper">ई-पेपर</Link>
          <Link href="/admin">Admin</Link>
        </nav>

      </div>
    </header>
  );
}
