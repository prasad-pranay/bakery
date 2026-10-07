"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

const Restricted = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-md text-center">

        {/* Icon */}
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border border-black/5 bg-black/[0.03]">
          <LockKeyhole
            size={34}
            strokeWidth={1.7}
            className="text-[var(--foreground)]"
          />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
            Access restricted
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            You can’t access this page
          </h1>

          <p className="mx-auto max-w-sm text-sm leading-6 text-black/50">
            This page is only available to authorized users. If you believe
            you should have access, please check your account permissions.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Home
          </Link>
        </div>

        {/* Small status */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-black/35">
          <span className="h-1.5 w-1.5 rounded-full bg-black/30" />
          <span>Protected area</span>
        </div>

      </div>
    </div>
  );
};

export default Restricted;

