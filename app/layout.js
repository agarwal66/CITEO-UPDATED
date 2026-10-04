import "./globals.css";
import Script from "next/script";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Tracker from "@/components/Tracker";

const GA = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(site),
  title: "Citeo | Full-stack software development agency",
  description: "Citeo builds SaaS products, MVPs, web applications and AI integrations for startups and growing businesses.",
  openGraph: { title: "Citeo | Full-stack software development agency", description: "SaaS, MVPs, web apps and AI integrations, from idea to production.", type: "website" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {GA && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA}');`}</Script>
          </>
        )}
        {PIXEL && (
          <Script id="pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}</Script>
        )}
        <Tracker />
        <Navbar />
        <main>{children}</main>
        <footer className="footer">
          <div className="wrap footer-grid">
            <div>
              <strong className="logo">Citeo<span className="dot">.</span></strong>
              <p className="muted">Full-stack development for ambitious businesses.</p>
            </div>
            <nav aria-label="Footer">
              <Link href="/#services">Services</Link>
              <Link href="/#work">Work</Link>
              <Link href="/#process">Process</Link>
              <Link href="/contact">Contact</Link>
            </nav>
            <nav aria-label="Legal">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms</Link>
              <span className="muted">hello@yourdomain.com</span>
            </nav>
          </div>
          <div className="wrap small">© 2026 Citeo. All rights reserved.</div>
        </footer>
      </body>
    </html>
  );
}
