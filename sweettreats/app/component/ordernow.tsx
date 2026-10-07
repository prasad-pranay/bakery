"use client";

import React from "react";

interface BlobButtonProps {
    children: React.ReactNode;
    className: string;
    stroke?: string;
    fill?: string;
}

export default function BlobButton({
    children,
    stroke,
    fill,
    className = "",
    ...props
}: BlobButtonProps) {
    return (
        <div
            {...props}
            className={`relative py-3.5 px-7 `}
        >
            <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 260 72"
                preserveAspectRatio="none"
            >
                <path
                    d="
            M 38 12
            C 70 7, 95 5, 130 5
            C 165 5, 190 7, 222 12
            C 235 15, 242 25, 242 36
            C 242 47, 235 57, 222 60
            C 190 65, 165 67, 130 67
            C 95 67, 70 65, 38 60
            C 25 57, 18 47, 18 36
            C 18 25, 25 15, 38 12
            Z
          "
                    fill={fill ? fill : "#FFE11A"}
                    stroke={stroke ? stroke : "#341715"}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>

            <div className={`relative z-10 flex h-full w-full items-center justify-center ${className}`}>
                {children}
            </div>
        </div>
    );
}