"use client";

import { useRef } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { cn } from "@/lib/utils";

// DomaOS themed scrollbar styles
const domaScrollbarStyles = `
.os-scrollbar .os-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 6px;
}

.os-scrollbar .os-scrollbar-handle {
  background: rgba(6, 182, 212, 0.6);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.os-scrollbar .os-scrollbar-handle:hover {
  background: rgba(6, 182, 212, 0.8);
}

.os-scrollbar .os-scrollbar-handle:active {
  background: rgba(6, 182, 212, 1);
}

.os-scrollbar-horizontal {
  height: 8px;
  bottom: 0;
}

.os-scrollbar-vertical {
  width: 8px;
  right: 0;
}

.dark .os-scrollbar .os-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.dark .os-scrollbar .os-scrollbar-handle {
  background: rgba(6, 182, 212, 0.7);
}

.dark .os-scrollbar .os-scrollbar-handle:hover {
  background: rgba(6, 182, 212, 0.9);
}
`;

// Inject styles once
if (typeof window !== "undefined") {
  const styleId = "doma-scrollbar-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = domaScrollbarStyles;
    document.head.appendChild(style);
  }
}

interface DomaScrollbarsProps {
  className?: string;
  children: React.ReactNode;
  options?: any;
}

export const DomaScrollbars = ({
  className,
  children,
  options = {},
  ...props
}: DomaScrollbarsProps) => {
  const defaultOptions = {
    scrollbars: {
      theme: "os-theme-light",
      visibility: "auto",
      autoHide: "move",
      autoHideDelay: 800,
      autoHideSuspend: false,
      dragScroll: true,
      clickScroll: true,
      pointers: ["mouse", "touch", "pen"],
    },
    overflow: {
      x: "scroll",
      y: "scroll",
    },
    paddingAbsolute: false,
    showNativeOverlaidScrollbars: false,
    update: {
      elementEvents: [["img", "load"]],
      debounce: [0, 33],
      attributes: null,
      ignoreMutation: null,
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    scrollbars: {
      ...defaultOptions.scrollbars,
      ...(options?.scrollbars || {}),
    },
  };

  return (
    <OverlayScrollbarsComponent
      className={cn("doma-scrollbars", className)}
      options={mergedOptions}
      {...props}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
};

DomaScrollbars.displayName = "DomaScrollbars";

// Hook for imperative scrollbar control
export const useDomaScrollbars = () => {
  const scrollbarsRef = useRef<any>(null);

  const scrollTo = (
    coordinates: { x?: number; y?: number },
    duration?: number,
  ) => {
    if (scrollbarsRef.current) {
      const { osInstance } = scrollbarsRef.current;
      if (osInstance) {
        osInstance()
          .elements()
          .viewport.scrollTo({
            left: coordinates.x,
            top: coordinates.y,
            behavior: duration ? "smooth" : "auto",
          });
      }
    }
  };

  const scrollToTop = (duration?: number) => {
    scrollTo({ y: 0 }, duration);
  };

  const scrollToBottom = (duration?: number) => {
    if (scrollbarsRef.current) {
      const { osInstance } = scrollbarsRef.current;
      if (osInstance) {
        const viewport = osInstance().elements().viewport;
        scrollTo({ y: viewport.scrollHeight }, duration);
      }
    }
  };

  return {
    scrollbarsRef,
    scrollTo,
    scrollToTop,
    scrollToBottom,
  };
};
