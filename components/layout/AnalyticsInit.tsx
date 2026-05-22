"use client";

import { useEffect } from "react";
import { initAnalytics, isFirebaseConfigured } from "@/lib/firebase";
import { incrementVisitors } from "@/lib/firestore";

export function AnalyticsInit() {
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    initAnalytics();
    incrementVisitors().catch(() => {});
  }, []);

  return null;
}
