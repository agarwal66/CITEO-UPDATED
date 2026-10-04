"use client";
import Link from "next/link";
import { track } from "@/lib/track";

// Link jo click par ad event bhi bhejta hai
export default function CtaLink({ event = "cta_click", label, children, ...props }) {
  return <Link {...props} onClick={() => track(event, { label })}>{children}</Link>;
}
