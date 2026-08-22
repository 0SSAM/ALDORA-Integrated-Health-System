// MEDORA | ميدورا — Integrated Health Care System
// Copyright (c) 2026 Hossam Naeim Osman | حسام نعيم عثمان. All rights reserved.
// Proprietary and confidential. Unauthorized copying, distribution, or use of this
// software, or of any portion of it, is strictly prohibited.
// Source: https://github.com/0SSAM/MEDORA-Health-Care-Eco-System
import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { ShieldAlert } from "lucide-react";

export function SecurityOverlay() {
  const { user } = useAuth();
  const [isTampered, setIsTampered] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Fast anti-screenshot / screen recording detection
    // Using visibilitychange and blur for rapid response
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Potential screenshot or app switching
        setIsTampered(true);
      }
    };

    const handleBlur = () => {
      // Blur often triggers when system-level screenshot tools are activated
      setIsTampered(true);
    };

    const handleFocus = () => {
      // Reset after a short delay when user returns
      setTimeout(() => setIsTampered(false), 300);
    };

    // PrintScreen key detection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || (e.ctrlKey && e.key === "p")) {
        setIsTampered(true);
        e.preventDefault();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [user]);

  if (!user) return null;

  return (
    <>
      {/* Optimized Watermark: Subtle, professional, and less intrusive */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden opacity-[0.03] select-none"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='12' fill='black' text-anchor='middle' transform='rotate(-30 100 100)'%3EMEDORA | ${user.name}%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Immediate Anti-Screenshot Blur Overlay */}
      {isTampered && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-2xl transition-opacity duration-75">
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-white/90 p-8 text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <ShieldAlert className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">حماية المحتوى نشطة</h2>
              <p className="mt-2 text-sm text-slate-500 max-w-[240px]">
                يُمنع تصوير الشاشة أو تسجيل الفيديو لحماية بيانات المرضى والخصوصية المؤسسية.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
