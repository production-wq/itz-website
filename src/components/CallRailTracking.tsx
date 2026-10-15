'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    CallTrk?: { swap: (node?: HTMLElement) => void };
  }
}

function swapNumbers() {
  window.CallTrk?.swap(document.body);
}

/** The company-specific URL comes from CallRail's JavaScript installation page. */
export function CallRailTracking() {
  const pathname = usePathname();
  const scriptUrl = process.env.NEXT_PUBLIC_CALLRAIL_SCRIPT_URL ||
    'https://cdn.calltrk.com/companies/760342801/64bf2495e4aad8707964/12/swap.js';
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  useEffect(() => {
    if (!scriptUrl || isAdmin) return;
    // Client navigation can render new phone links without reloading swap.js.
    const frame = requestAnimationFrame(swapNumbers);
    return () => cancelAnimationFrame(frame);
  }, [pathname, scriptUrl, isAdmin]);

  if (!scriptUrl || isAdmin) return null;

  return (
    <Script
      id="callrail-tracking"
      src={scriptUrl}
      strategy="afterInteractive"
      onReady={swapNumbers}
    />
  );
}
