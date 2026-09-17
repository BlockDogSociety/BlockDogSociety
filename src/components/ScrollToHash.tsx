"use client";

import { useEffect } from "react";

// Jumps to the given element once on mount. Used instead of a URL hash so
// the address stays clean and the browser doesn't fight the scroll.
export function ScrollToHash({ id }: { id: string }) {
  useEffect(() => {
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, [id]);

  return null;
}
