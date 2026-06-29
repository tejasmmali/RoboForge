import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          borderRadius: 40,
        }}
      >
        <svg
          width="112"
          height="112"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 7.5V9.5"
            stroke="#FAFAF8"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <rect
            x="9.5"
            y="11"
            width="13"
            height="12"
            rx="3.5"
            stroke="#FAFAF8"
            strokeWidth="1.75"
          />
          <circle cx="13" cy="16.5" r="1.25" fill="#FAFAF8" />
          <circle cx="19" cy="16.5" r="1.25" fill="#FAFAF8" />
          <path
            d="M13 20h6"
            stroke="#FAFAF8"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M7.5 16.5H9.5M22.5 16.5H24.5"
            stroke="#FAFAF8"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="16" cy="7" r="1" fill="#2563EB" />
        </svg>
      </div>
    ),
    size,
  );
}
