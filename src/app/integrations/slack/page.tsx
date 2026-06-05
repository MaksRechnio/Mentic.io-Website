import type { Metadata } from "next";
import Image from "next/image";
import SiteMenu from "@/components/SiteMenu";
import TrackedDemoLink from "@/components/TrackedDemoLink";

const SITE_URL = "https://www.mentic.io";
const PAGE_TITLE = "Slack Integration";
const PAGE_DESCRIPTION =
  "Connect Mentic to Slack to launch and manage your ad campaigns, ask questions about their performance, and make adjustments without leaving your workspace.";

const SLACK_INSTALL_URL =
  "https://slack.com/oauth/v2/authorize?client_id=11004361126608.11126664671504&scope=files:read,app_mentions:read,assistant:write,chat:write,im:history,im:write&user_scope=";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/integrations/slack" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/integrations/slack`,
    title: `${PAGE_TITLE} | Mentic`,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    title: `${PAGE_TITLE} | Mentic`,
    description: PAGE_DESCRIPTION,
  },
};

const slackJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Integrations", item: `${SITE_URL}/integrations` },
        { "@type": "ListItem", position: 3, name: "Slack Integration", item: `${SITE_URL}/integrations/slack` },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/integrations/slack#app`,
      name: "Mentic for Slack",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Slack",
      description: PAGE_DESCRIPTION,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

/* Official Slack mark (brand pinwheel) */
function SlackMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 122.8 122.8" className={className} aria-hidden>
      <path
        d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zM32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
        fill="#e01e5a"
      />
      <path
        d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zM45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
        fill="#36c5f0"
      />
      <path
        d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zM90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
        fill="#2eb67d"
      />
      <path
        d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zM77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
        fill="#ecb22e"
      />
    </svg>
  );
}

/* Official "Add to Slack" embeddable button */
function AddToSlackButton() {
  return (
    <a href={SLACK_INSTALL_URL} className="inline-flex">
      <img
        alt="Add to Slack"
        height={40}
        width={139}
        src="https://platform.slack-edge.com/img/add_to_slack.png"
        srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
      />
    </a>
  );
}

const FEATURES = [
  {
    title: "Launch campaigns from chat",
    body: "Tell the agent what you want to run: audience, budget, goal. It builds and launches the campaign across your ad accounts. No dashboard required.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
  {
    title: "Manage everything in one thread",
    body: "Pause, resume, rename or rebudget campaigns with a message. The agent confirms every action so your whole team sees what changed and when.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    title: "Ask about performance",
    body: "Spend, impressions, conversions, CPA, ROAS. Ask in plain English and get instant answers, summaries and trends pulled straight from your live campaigns.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 3 3 5-6" />
      </svg>
    ),
  },
  {
    title: "Make adjustments instantly",
    body: "When the agent spots an optimisation, like shifting budget, swapping a creative or retiring a fatigued ad set, it proposes the change in Slack. Approve it with one tap.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    title: "Add Mentic to Slack",
    body: "Click the button below and pick the workspace your team already lives in.",
  },
  {
    title: "Authorize your workspace",
    body: "Review the permissions and approve. Mentic only requests the scopes it needs to chat and share reports.",
  },
  {
    title: "Start talking to your agent",
    body: "DM the Mentic app or mention it in a channel. Launch a campaign, ask how yesterday went, or approve its next optimisation.",
  },
];

export default function SlackIntegrationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(slackJsonLd) }}
      />
      <main className="use-native-cursor min-h-[100dvh] w-full bg-[#f2f2f0] text-dark-teal font-sans relative overflow-hidden flex flex-col">
        <SiteMenu />

        {/* Corner blobs */}
        <div
          aria-hidden
          className="gradient-blob gradient-blob-coral intro-fade-in absolute pointer-events-none w-[min(45vw,720px)] h-[min(45vw,720px)] top-[-22vw] left-[-22vw]"
          style={{ animationDelay: "0.1s" }}
        />
        <div
          aria-hidden
          className="gradient-blob gradient-blob-mint intro-fade-in absolute pointer-events-none w-[min(55vw,880px)] h-[min(55vw,880px)] bottom-[-28vw] right-[-28vw]"
          style={{ animationDelay: "0.2s" }}
        />

        {/* ── Hero ── */}
        <section className="relative z-[2] px-[clamp(20px,6vw,56px)] pt-[clamp(96px,12vh,140px)] pb-[clamp(28px,4vw,48px)]">
          <div className="mx-auto max-w-[1100px] grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-[clamp(32px,5vw,72px)] items-center">
            {/* Copy */}
            <div className="text-center lg:text-left">
              {/* Logo lockup */}
              <div className="intro-scale-in inline-flex items-center gap-4" style={{ animationDelay: "0.05s" }}>
                <span className="inline-flex items-center justify-center w-[clamp(52px,5vw,64px)] h-[clamp(52px,5vw,64px)] rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,60,70,0.12)]">
                  <SlackMark className="w-[58%] h-[58%]" />
                </span>
                <span aria-hidden className="text-[clamp(22px,2.4vw,30px)] font-extralight text-dark-teal/40">+</span>
                <span className="inline-flex items-center justify-center w-[clamp(52px,5vw,64px)] h-[clamp(52px,5vw,64px)] rounded-2xl bg-dark-teal shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,60,70,0.18)]">
                  <Image src="/images/mentic-icon-mint.png" alt="Mentic" width={36} height={36} className="w-[56%] h-auto" />
                </span>
              </div>

              <div className="intro-fade-up mt-6 text-[11px] font-bold tracking-[0.24em] text-coral uppercase" style={{ animationDelay: "0.12s" }}>
                Integration
              </div>
              <h1 className="intro-fade-up m-0 mt-2 text-[clamp(40px,5.4vw,72px)] leading-[1.02] font-extralight tracking-[-0.02em] text-dark-teal" style={{ animationDelay: "0.18s" }}>
                Slack <span className="font-extrabold">+</span> <span className="font-extrabold text-coral">Mentic</span>.
              </h1>
              <p className="intro-fade-up mt-5 mx-auto lg:mx-0 max-w-[520px] text-[clamp(15px,1.3vw,18px)] font-light leading-[1.6] text-dark-teal/70" style={{ animationDelay: "0.28s" }}>
                Manage and launch your campaigns, ask questions about their
                performance, and make adjustments, all without leaving Slack.
                Your autonomous advertising agent, one mention away.
              </p>

              <div className="intro-fade-up mt-8 flex flex-wrap gap-4 items-center justify-center lg:justify-start" style={{ animationDelay: "0.4s" }}>
                <AddToSlackButton />
                <TrackedDemoLink
                  source="slack_integration"
                  contentName="Book a demo, Slack integration page"
                  className="inline-flex items-center h-10 px-5 rounded-full border-[1.5px] border-dark-teal/25 text-dark-teal text-[12px] font-bold tracking-[0.16em] uppercase no-underline transition-[background,border-color,transform] duration-[250ms] ease-premium hover:bg-dark-teal/5 hover:border-dark-teal/40 hover:-translate-y-px"
                >
                  Book a Demo
                </TrackedDemoLink>
              </div>
            </div>

            {/* Slack conversation mockup */}
            <div className="intro-scale-in hidden sm:block" style={{ animationDelay: "0.35s" }} aria-hidden>
              <div className="rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_44px_rgba(0,60,70,0.12),0_48px_90px_-24px_rgba(0,60,70,0.2)] border border-dark-teal/[0.06] overflow-hidden">
                {/* Window bar */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-dark-teal/[0.08]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-3 inline-flex items-center gap-1.5 text-[12px] font-bold text-dark-teal/60">
                    <SlackMark className="w-3.5 h-3.5" /> #growth-team
                  </span>
                </div>

                <div className="p-5 flex flex-col gap-4">
                  {/* User message */}
                  <div className="flex gap-3">
                    <span className="shrink-0 w-9 h-9 rounded-lg bg-[#ffe5e5] flex items-center justify-center text-[13px] font-extrabold text-coral">J</span>
                    <div>
                      <div className="text-[13px] leading-none"><strong>Jamie</strong> <span className="text-[11px] text-dark-teal/45 font-medium">10:42 AM</span></div>
                      <p className="m-0 mt-1.5 text-[13.5px] leading-[1.5] text-near-black/80">
                        <span className="text-[#1264a3] bg-[#1d9bd11a] rounded px-1 py-0.5 font-medium">@Mentic</span> how did the spring sale campaign perform yesterday?
                      </p>
                    </div>
                  </div>

                  {/* Agent reply */}
                  <div className="flex gap-3">
                    <span className="shrink-0 w-9 h-9 rounded-lg bg-dark-teal flex items-center justify-center">
                      <Image src="/images/mentic-icon-mint.png" alt="" width={18} height={18} className="w-[18px] h-auto" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] leading-none"><strong>Mentic</strong> <span className="text-[9px] font-bold tracking-wide uppercase bg-dark-teal/[0.08] text-dark-teal/55 rounded px-1 py-0.5 ml-0.5">App</span> <span className="text-[11px] text-dark-teal/45 font-medium">10:42 AM</span></div>
                      <p className="m-0 mt-1.5 text-[13.5px] leading-[1.5] text-near-black/80">
                        Spring Sale spent <strong>$412</strong> yesterday and drove <strong>38 purchases</strong> at a <strong>$10.84 CPA</strong>, 18% below target. ROAS is at <strong>4.2</strong>, trending up.
                      </p>
                      <p className="m-0 mt-2 text-[13.5px] leading-[1.5] text-near-black/80">
                        The retargeting ad set is fatiguing. I&rsquo;d shift <strong>$60/day</strong> to the lookalike audience.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <span className="inline-flex items-center h-8 px-3.5 rounded-lg bg-mint text-dark-teal text-[12px] font-bold">Approve</span>
                        <span className="inline-flex items-center h-8 px-3.5 rounded-lg border border-dark-teal/20 text-dark-teal/70 text-[12px] font-bold">Adjust</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Slack + Mentic ── */}
        <section className="relative z-[2] px-[clamp(20px,6vw,56px)] py-[clamp(28px,4vw,56px)]">
          <div className="mx-auto max-w-[1100px] grid grid-cols-1 md:grid-cols-2 gap-[clamp(20px,3vw,40px)]">
            <div className="intro-fade-up rounded-3xl bg-white/70 border border-dark-teal/[0.06] p-[clamp(22px,2.6vw,36px)]" style={{ animationDelay: "0.45s" }}>
              <h2 className="m-0 text-[clamp(18px,1.7vw,22px)] font-bold tracking-[-0.01em]">What is Mentic?</h2>
              <p className="m-0 mt-2.5 text-[15px] font-light leading-[1.6] text-dark-teal/70">
                Mentic is an autonomous advertising agent. It researches audiences,
                builds campaigns, launches them across your ad accounts and
                optimises them daily, while you stay in control.
              </p>
            </div>
            <div className="intro-fade-up rounded-3xl bg-white/70 border border-dark-teal/[0.06] p-[clamp(22px,2.6vw,36px)]" style={{ animationDelay: "0.55s" }}>
              <h2 className="m-0 text-[clamp(18px,1.7vw,22px)] font-bold tracking-[-0.01em]">Why Slack + Mentic?</h2>
              <p className="m-0 mt-2.5 text-[15px] font-light leading-[1.6] text-dark-teal/70">
                Your team already works in Slack. Now your ad accounts do too.
                The agent reports, asks for approvals and takes instructions in
                the channels where decisions actually happen.
              </p>
            </div>
          </div>
        </section>

        {/* ── Ways to use it ── */}
        <section className="relative z-[2] px-[clamp(20px,6vw,56px)] py-[clamp(28px,4vw,56px)]">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="intro-fade-up m-0 text-center text-[clamp(28px,3.4vw,44px)] font-extralight tracking-[-0.02em]" style={{ animationDelay: "0.5s" }}>
              Ways to use <span className="font-extrabold text-coral">Mentic in Slack</span>.
            </h2>
            <div className="mt-[clamp(24px,3vw,44px)] grid grid-cols-1 sm:grid-cols-2 gap-[clamp(16px,2vw,28px)]">
              {FEATURES.map((f, i) => (
                <article
                  key={f.title}
                  className="intro-fade-up rounded-3xl bg-white border border-dark-teal/[0.06] p-[clamp(22px,2.6vw,34px)] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_14px_36px_rgba(0,60,70,0.07)]"
                  style={{ animationDelay: `${0.6 + i * 0.08}s` }}
                >
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-mint/30 text-dark-teal [&_svg]:w-[22px] [&_svg]:h-[22px]">
                    {f.icon}
                  </span>
                  <h3 className="m-0 mt-4 text-[clamp(17px,1.6vw,21px)] font-bold tracking-[-0.01em]">{f.title}</h3>
                  <p className="m-0 mt-2 text-[14.5px] font-light leading-[1.6] text-dark-teal/70">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── How to connect ── */}
        <section className="relative z-[2] px-[clamp(20px,6vw,56px)] py-[clamp(28px,4vw,56px)]">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="m-0 text-center text-[clamp(28px,3.4vw,44px)] font-extralight tracking-[-0.02em]">
              Connected in <span className="font-extrabold text-coral">three steps</span>.
            </h2>
            <ol className="list-none m-0 mt-[clamp(24px,3vw,44px)] p-0 grid grid-cols-1 md:grid-cols-3 gap-[clamp(16px,2vw,28px)]">
              {STEPS.map((s, i) => (
                <li key={s.title} className="rounded-3xl bg-white/70 border border-dark-teal/[0.06] p-[clamp(22px,2.6vw,34px)]">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-coral text-white text-[15px] font-extrabold">{i + 1}</span>
                  <h3 className="m-0 mt-4 text-[clamp(16px,1.5vw,20px)] font-bold tracking-[-0.01em]">{s.title}</h3>
                  <p className="m-0 mt-2 text-[14.5px] font-light leading-[1.6] text-dark-teal/70">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="relative z-[2] px-[clamp(20px,6vw,56px)] pt-[clamp(20px,3vw,40px)] pb-[clamp(48px,7vw,96px)]">
          <div className="mx-auto max-w-[1100px] rounded-[28px] bg-dark-teal text-[#f2f2f0] px-[clamp(24px,4vw,64px)] py-[clamp(36px,5vw,72px)] text-center shadow-[0_24px_70px_-18px_rgba(0,60,70,0.45)] relative overflow-hidden">
            <div aria-hidden className="absolute pointer-events-none w-[420px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,242,211,0.28)_0%,transparent_70%)] top-[-180px] right-[-120px]" />
            <div aria-hidden className="absolute pointer-events-none w-[380px] h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,107,92,0.3)_0%,transparent_70%)] bottom-[-180px] left-[-120px]" />
            <h2 className="m-0 relative text-[clamp(26px,3.2vw,42px)] font-extralight tracking-[-0.02em]">
              Bring your ad accounts <span className="font-extrabold text-mint">into Slack</span>.
            </h2>
            <p className="m-0 mt-3 relative mx-auto max-w-[480px] text-[15px] font-light leading-[1.6] text-[#f2f2f0]/75">
              Free with every Mentic plan. Install in under a minute and
              uninstall any time from your Slack workspace settings.
            </p>
            <div className="mt-7 relative flex justify-center">
              <AddToSlackButton />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
