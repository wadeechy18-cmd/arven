"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side: "left" | "right" | "top";
  /** Accessible name for the drawer. */
  label: string;
  children: ReactNode;
  panelClassName?: string;
}

/**
 * Slide-in panel built on the native <dialog> element, which gives us
 * focus trapping, Escape-to-close and an inert page behind it for free.
 */
export function Drawer({ open, onClose, side, label, children, panelClassName = "" }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);

  const position =
    side === "right"
      ? "right-0 top-0 h-full w-full max-w-md animate-slide-in-right"
      : side === "left"
        ? "left-0 top-0 h-full w-[88%] max-w-sm animate-slide-in-left"
        : "left-0 top-0 w-full max-h-[90vh] animate-slide-down";

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Clicking the dimmed area outside the panel closes the drawer.
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink/40 backdrop:animate-fade-in"
    >
      {open && (
        <div className={`absolute flex flex-col bg-surface text-ink shadow-xl ${position} ${panelClassName}`}>{children}</div>
      )}
    </dialog>
  );
}
