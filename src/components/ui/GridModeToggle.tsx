"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "grid-mode";
const SYNC_EVENT = "grid-mode-change";

function apply(enabled: boolean) {
  document.documentElement.dataset.grid = enabled ? "on" : "off";
}

/* Both rail and mobile instances read the same stored value and are woken by
   the same event, so neither can hold a stale copy of the other's state. */
function subscribe(onChange: () => void): () => void {
  window.addEventListener(SYNC_EVENT, onChange);
  return () => window.removeEventListener(SYNC_EVENT, onChange);
}

function getSnapshot(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== "off";
}

function getServerSnapshot(): boolean {
  return true;
}

export function GridModeToggle() {
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    apply(enabled);
  }, [enabled]);

  const toggle = () => {
    localStorage.setItem(STORAGE_KEY, enabled ? "off" : "on");
    window.dispatchEvent(new Event(SYNC_EVENT));
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
