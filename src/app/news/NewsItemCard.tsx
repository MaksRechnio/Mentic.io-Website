"use client";

import Image from "next/image";
import { useState } from "react";

type TitlePart = { text: string; weight: number; color: string };

export type NewsItemData = {
  date: string;
  isoDate: string;
  tag: string;
  titleParts: TitlePart[];
  body: string;
  image?: { src: string; alt: string };
};

export default function NewsItemCard({
  item,
  index,
  defaultOpen = false,
}: {
  item: NewsItemData;
  index: number;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `news-panel-${index}`;

  return (
    <article
      className="intro-scale-in"
      style={{
        position: "relative",
        background: "#ffffff",
        borderRadius: 20,
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,60,70,0.06), 0 24px 60px -24px rgba(0,60,70,0.14), 0 0 0 1px rgba(0,60,70,0.04)",
        animationDelay: `${0.15 + index * 0.08}s`,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="news-stripe"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto auto",
          alignItems: "center",
          gap: "clamp(10px, 2vw, 20px)",
          width: "100%",
          padding: "clamp(14px, 1.8vw, 20px) clamp(16px, 2.4vw, 28px)",
          background: "transparent",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          color: "#003c46",
          fontFamily: "inherit",
        }}
      >
        <time
          dateTime={item.isoDate}
          style={{
            fontSize: "clamp(10px, 1vw, 12px)",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(0,60,70,0.55)",
            whiteSpace: "nowrap",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {item.date}
        </time>

        <h2
          className="news-stripe-title"
          style={{
            margin: 0,
            fontSize: "clamp(15px, 1.55vw, 19px)",
            lineHeight: 1.25,
            letterSpacing: "-0.005em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: open ? 3 : 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {item.titleParts.map((p, idx) => (
            <span key={idx} style={{ fontWeight: p.weight, color: p.color }}>
              {p.text}
            </span>
          ))}
        </h2>

        <span
          className="news-stripe-tag"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 999,
            background: "#e3fbf2",
            color: "#003c46",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <span
            aria-hidden
            style={{ width: 5, height: 5, borderRadius: 999, background: "#8bf2d3" }}
          />
          {item.tag}
        </span>

        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            background: "rgba(0,60,70,0.06)",
            transition: "transform 220ms ease, background 220ms ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="#003c46"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        hidden={!open}
        style={{
          padding: open ? "0 clamp(16px, 2.4vw, 28px) clamp(18px, 2.4vw, 28px)" : 0,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: item.image ? "minmax(0, 1fr) minmax(0, 220px)" : "1fr",
            gap: "clamp(14px, 2vw, 24px)",
            alignItems: "start",
          }}
          className="news-expanded-grid"
        >
          <p
            style={{
              margin: 0,
              fontSize: "clamp(14px, 1.05vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(0,60,70,0.78)",
            }}
          >
            {item.body}
          </p>

          {item.image && (
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 5",
                borderRadius: 12,
                overflow: "hidden",
                background: "#003c46",
                boxShadow: "0 6px 18px rgba(0,60,70,0.12)",
              }}
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(max-width: 720px) 100vw, 220px"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .news-stripe:hover {
          background: rgba(0, 60, 70, 0.025);
        }
        .news-stripe:hover span[aria-hidden] {
          background: rgba(0, 60, 70, 0.1);
        }
        @media (max-width: 640px) {
          .news-stripe {
            grid-template-columns: 1fr auto !important;
            grid-template-areas:
              "date chevron"
              "title chevron"
              "tag chevron";
            row-gap: 6px !important;
          }
          .news-stripe > time {
            grid-area: date;
          }
          .news-stripe > h2 {
            grid-area: title;
          }
          .news-stripe > .news-stripe-tag {
            grid-area: tag;
            justify-self: start;
          }
          .news-stripe > span:last-child {
            grid-area: chevron;
            align-self: center;
          }
          .news-expanded-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </article>
  );
}
