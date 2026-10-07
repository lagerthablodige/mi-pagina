"use client";

import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string;
  eventData?: Record<string, string>;
  children: ReactNode;
};

export default function TrackedLink({ eventName, eventData, children, ...props }: Props) {
  return (
    <a {...props} onClick={() => track(eventName, eventData)}>
      {children}
    </a>
  );
}
