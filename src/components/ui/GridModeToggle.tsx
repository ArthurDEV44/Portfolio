"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "grid-mode";
const SYNC_EVENT = "grid-mode-change";

function apply(enabled: boolean) {
  document.documentElement.dataset.grid = enabled ? "on" : "off";
}

export function GridModeToggle() {
  const [enabled, setEnabled] = useState(true);

  // Both rail and mobile instances stay in sync through a shared event.
  useEffect(() => {
    const initial = localStorage.getItem(STORAGE_KEY) !== "off";
    setEnabled(initial);
    apply(initial);

    const onSync = (event: Event) => {
      setEnabled((event as CustomEvent<boolean>).detail);
    };
    window.addEventListener(SYNC_EVENT, onSync);
    return () => window.removeEventListener(SYNC_EVENT, onSync);
  }, []);

  const toggle = () => {
    const next = !enabled;
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    apply(next);
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: next }));
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label="Toggle grid mode"
      onClick={toggle}
      className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
        enabled ? "bg-foreground" : "bg-[color:var(--surface-raised)]"
      }`}
    >
      <span
        className={`inline-block size-3.5 rounded-full bg-[color:var(--bg)] transition-transform duration-200 ${
          enabled ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
