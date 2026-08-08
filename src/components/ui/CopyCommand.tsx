"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* A command the reader is meant to run, not read: the whole row is the copy
   control, so there is no separate button to aim at. The shimmer marks it as
   the one interactive block in an article otherwise made of static prose. */
export function CopyCommand({ command }: { command: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = () => {
    if (!navigator.clipboard?.writeText) return;

    navigator.clipboard.writeText(command).then(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsCopied(true);
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
        timeoutRef.current = null;
      }, 2000);
    }, console.error);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="article-command"
      aria-label={`Copier la commande : ${command}`}
    >
      <span className="article-command-text" data-text={`$ ${command}`}>
        $ {command}
      </span>
      <span className="article-command-icon" data-state={isCopied ? "b" : "a"}>
        <span className="article-command-glyph">
          <CopyIcon aria-hidden="true" size={18} />
        </span>
        <span className="article-command-glyph">
          <CheckIcon aria-hidden="true" size={18} />
        </span>
      </span>
      <span aria-live="polite" className="sr-only">
        {isCopied ? "Commande copiée" : ""}
      </span>
    </button>
  );
}
