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
      className="intro-scale-in relative bg-white rounded-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,60,70,0.06),0_24px_60px_-24px_rgba(0,60,70,0.14),0_0_0_1px_rgba(0,60,70,0.04)] overflow-hidden"
      style={{
        animationDelay: `${0.15 + index * 0.08}s`,
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="news-stripe grid grid-cols-[auto_1fr_auto_auto] items-center gap-[clamp(10px,2vw,20px)] w-full px-[clamp(16px,2.4vw,28px)] py-[clamp(14px,1.8vw,20px)] bg-transparent border-none text-left cursor-pointer text-dark-teal font-[inherit]"
      >
        <time
          dateTime={item.isoDate}
          className="text-[clamp(10px,1vw,12px)] font-bold tracking-[0.16em] uppercase text-dark-teal/55 whitespace-nowrap [font-variant-numeric:tabular-nums]"
        >
          {item.date}
        </time>

        <h2
          className="news-stripe-title m-0 text-[clamp(15px,1.55vw,19px)] leading-[1.25] tracking-[-0.005em] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical]"
          style={{
            WebkitLineClamp: open ? 3 : 1,
          }}
        >
          {item.titleParts.map((p, idx) => (
            <span key={idx} style={{ fontWeight: p.weight, color: p.color }}>
              {p.text}
            </span>
          ))}
        </h2>

        <span
          className="news-stripe-tag inline-flex items-center gap-1.5 py-1 px-2.5 rounded-[999px] bg-[#e3fbf2] text-dark-teal text-[10px] font-bold tracking-[0.16em] uppercase whitespace-nowrap"
        >
          <span
            aria-hidden
            className="w-[5px] h-[5px] rounded-[999px] bg-mint"
          />
          {item.tag}
        </span>

        <span
          aria-hidden
          className="w-7 h-7 inline-flex items-center justify-center rounded-[999px] bg-[rgba(0,60,70,0.06)] transition-[transform,background] duration-[220ms] ease-[ease]"
          style={{
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
          className="news-expanded-grid grid gap-[clamp(14px,2vw,24px)] items-start"
          style={{
            gridTemplateColumns: item.image ? "minmax(0, 1fr) minmax(0, 220px)" : "1fr",
          }}
        >
          <p className="m-0 text-[clamp(14px,1.05vw,16px)] font-normal leading-[1.6] text-dark-teal/78 whitespace-pre-line">
            {item.body}
          </p>

          {item.image && (
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-dark-teal shadow-[0_6px_18px_rgba(0,60,70,0.12)]">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(max-width: 720px) 100vw, 220px"
                className="object-cover"
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
