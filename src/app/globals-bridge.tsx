"use client";
import { AppProviders } from "./providers";
import "../styles/globals.css";

export default function GlobalsBridge({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}