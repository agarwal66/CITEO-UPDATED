"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { saveAttribution } from "@/lib/track";

export default function Tracker() {
  const path = usePathname();
  const first = useRef(true);
  useEffect(() => {
    saveAttribution();
    if (first.current) { first.current = false; return; }
    // route change par page view bhejo (pehla view script khud bhejti hai)
    if (window.fbq) window.fbq("track", "PageView");
    if (window.gtag) window.gtag("event", "page_view", { page_path: path });
  }, [path]);
  return null;
}
