import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of Mentic, the autonomous AI advertising agent: accounts, subscriptions, connected ad accounts, acceptable use, and liability.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service | Mentic",
    description:
      "The terms that govern your use of Mentic, the autonomous AI advertising agent.",
    url: "https://www.mentic.io/terms",
    type: "article",
  },
};

const EFFECTIVE_DATE = "June 10, 2026";
const CONTACT_EMAIL = "support@mentic.io";
const BUSINESS_ADDRESS = "2261 Market Street STE 67152, San Francisco, CA 94114, USA";
const LEGAL_ENTITY = "Mentic Inc.";

const SITE_URL = "https://www.mentic.io";

const termsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Terms of Service", item: `${SITE_URL}/terms` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/terms#webpage`,
      url: `${SITE_URL}/terms`,
      name: "Terms of Service | Mentic",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      datePublished: "2026-06-10",
      dateModified: "2026-06-10",
      inLanguage: "en-US",
    },
  ],
};

export default function TermsOfServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd) }}
      />
    <main className="use-native-cursor min-h-dvh w-full bg-off-white font-sans text-near-black px-[clamp(16px,5vw,48px)] py-[clamp(24px,6vw,64px)]">
      <div className="mx-auto max-w-[760px]">
        <header className="mb-[clamp(32px,6vw,56px)] flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Back to Mentic home"
            className="inline-flex items-center gap-2 rounded-full border border-dark-teal/15 bg-white/60 px-3 py-2 text-sm font-semibold text-dark-teal no-underline transition-[background-color,transform] duration-200 ease-premium hover:-translate-x-0.5 hover:bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to home</span>
          </Link>
          <div className="inline-flex items-center gap-2.5">
            <Image src="/images/mentic-icon-teal.png" alt="" width={36} height={36} priority />
            <span className="font-qurova text-[28px] leading-none text-dark-teal">mentic</span>
          </div>
        </header>

        <article className="rounded-3xl border border-dark-teal/[0.06] bg-white p-[clamp(28px,6vw,64px)] shadow-[0_1px_0_rgba(0,60,70,0.04),0_24px_60px_-32px_rgba(0,60,70,0.18)] [&_section]:mt-9 [&_section:first-of-type]:mt-0 [&_h2]:mb-3 [&_h2]:text-[clamp(20px,2.4vw,24px)] [&_h2]:font-bold [&_h2]:tracking-[-0.01em] [&_h2]:text-dark-teal [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-dark-teal [&_p]:mb-3 [&_p]:text-[15.5px] [&_p]:leading-[1.65] [&_p]:text-near-black [&_ul]:mt-2 [&_ul]:mb-4 [&_ul]:pl-[22px] [&_ul]:text-[15.5px] [&_ul]:leading-[1.65] [&_ul]:text-near-black [&_ol]:mt-2 [&_ol]:mb-4 [&_ol]:pl-[22px] [&_ol]:text-[15.5px] [&_ol]:leading-[1.65] [&_ol]:text-near-black [&_li]:mb-1.5 [&_li]:marker:text-coral [&_a]:text-dark-teal [&_a]:underline [&_a]:decoration-coral/45 [&_a]:underline-offset-[3px] [&_a]:transition-colors [&_a]:duration-200 [&_a]:ease-premium [&_a:hover]:text-coral [&_a:hover]:decoration-coral">
          <p className="font-bold uppercase tracking-[0.14em]">Legal</p>
          <h1 className="mb-3 text-[clamp(36px,6vw,56px)] font-light leading-[1.05] tracking-[-0.01em] text-dark-teal">
            Terms of <span className="font-bold">Service</span>
          </h1>
          <p>
            Effective date: <strong className="font-semibold">{EFFECTIVE_DATE}</strong>
          </p>

          <div className="mb-10 grid grid-cols-1 gap-x-6 gap-y-3 rounded-[14px] border border-dark-teal/[0.08] bg-off-white px-6 py-5 text-sm leading-normal sm:grid-cols-[max-content_1fr]">
            <div className="flex flex-col gap-[2px]">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-dark-teal/55">Company</span>
              <span>{LEGAL_ENTITY}</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-dark-teal/55">Business address</span>
              <span>{BUSINESS_ADDRESS}</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-dark-teal/55">Contact</span>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-dark-teal/55">Website</span>
              <a href="https://mentic.io">https://mentic.io</a>
            </div>
          </div>

          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Mentic, the autonomous AI advertising agent. These
              Terms of Service (&ldquo;Terms&rdquo;) form a binding agreement
              between you (&ldquo;you&rdquo; or &ldquo;User&rdquo;) and{" "}
              {LEGAL_ENTITY}, a Delaware company (&ldquo;Mentic,&rdquo;
              &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
              regarding your use of mentic.io, the Mentic application, and
              related services (collectively, the &ldquo;Service&rdquo;).
            </p>
            <p>
              By creating an account or using the Service, you agree to these
              Terms. If you do not agree, please do not use the Service. We may
              update these Terms from time to time; the latest version will
              always be available at this page, and material changes will be
              announced by email or in-app message. Your continued use of the
              Service after changes take effect constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>2. Accounts</h2>
            <h3>a. Eligibility</h3>
            <p>
              You must be at least 18 years old, capable of entering into a
              legal contract, and using the Service on behalf of a business or
              other professional purpose. If you use the Service on behalf of
              a company, you represent that you have authority to bind that
              company to these Terms.
            </p>
            <h3>b. Your responsibilities</h3>
            <p>
              You are responsible for keeping your account credentials secure
              and for all activity under your account. Please see our{" "}
              <Link href="/privacy">Privacy Policy</Link> for details on how we
              collect and use your information.
            </p>
            <h3>c. Suspension and termination</h3>
            <p>
              We may suspend or terminate your access, without prior notice,
              if you violate these Terms or engage in fraudulent, abusive, or
              unlawful activity. You may stop using the Service and request
              account deletion at any time by contacting{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </section>

          <section>
            <h2>3. Connected ad accounts and autonomous actions</h2>
            <p>
              Mentic works by connecting to your advertising accounts (for
              example, Meta) through their official, authorized APIs. By
              connecting an account, you confirm that you own it or are
              authorized to manage it, and you grant Mentic permission to
              access and manage it within the scope you approve.
            </p>
            <ul>
              <li>
                <strong>Autonomous actions.</strong> Depending on the settings
                and automations you enable, Mentic may create, edit, pause,
                resume, or optimize campaigns on your behalf. You remain in
                control: you set the budgets, guardrails, and level of
                autonomy, and you can disconnect at any time.
              </li>
              <li>
                <strong>Ad spend.</strong> Your advertising budget is paid by
                you directly to the advertising platform (for example, Meta).
                Mentic never holds your ad spend, and our subscription fees do
                not include ad spend. You are responsible for all spend
                incurred on your connected accounts, including spend resulting
                from automations you enable.
              </li>
              <li>
                <strong>Platform policies.</strong> You are responsible for
                complying with the policies of the advertising platforms you
                connect, including their advertising and content policies.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service to advertise illegal products or services, or to run deceptive, misleading, or fraudulent campaigns.</li>
              <li>Upload or distribute malicious software, or attempt to probe, disrupt, or gain unauthorized access to the Service.</li>
              <li>Connect ad accounts or assets you do not own or are not authorized to manage.</li>
              <li>Resell, sublicense, or provide the Service to third parties without our written permission.</li>
              <li>Reverse engineer the Service or use it to build a competing product.</li>
              <li>Use automated means to scrape the Service or collect data about other users.</li>
            </ul>
          </section>

          <section>
            <h2>5. Subscriptions and billing</h2>
            <h3>a. Plans</h3>
            <p>
              Paid subscriptions unlock the Service. Available plans, prices,
              and what each includes are listed on our{" "}
              <Link href="/pricing">pricing page</Link>. We may change prices
              or plan features with notice; changes take effect at your next
              billing cycle.
            </p>
            <h3>b. Payment and renewal</h3>
            <p>
              Subscriptions are billed in advance on a recurring basis and
              renew automatically until cancelled. Payments are processed by
              Stripe. All prices are in USD and may not include applicable
              taxes. Failure to pay may result in suspension or termination of
              your access.
            </p>
            <h3>c. Cancellation and refunds</h3>
            <p>
              You can cancel at any time. Cancelling stops future renewals;
              your access remains active until the end of the current billing
              cycle. Except where required by law, payments are final and
              non-refundable. Ad spend paid to advertising platforms is never
              refundable by Mentic.
            </p>
          </section>

          <section>
            <h2>6. Content and intellectual property</h2>
            <h3>a. Our property</h3>
            <p>
              The Service, including its software, design, text, and
              trademarks, is owned by Mentic and protected by intellectual
              property laws. We grant you a limited, non-exclusive,
              non-transferable right to use the Service for your business
              while your subscription is active.
            </p>
            <h3>b. Your content and generated output</h3>
            <p>
              You retain ownership of the materials you provide (such as brand
              assets and creatives) and, as between you and Mentic, you own
              the advertising output the Service generates for you. You grant
              us a license to use your materials solely to operate the Service
              on your behalf. You are responsible for ensuring that content
              you provide or publish does not infringe third-party rights and
              complies with applicable law and platform policies.
            </p>
          </section>

          <section>
            <h2>7. Data and security</h2>
            <p>
              We store the account and connected-platform information needed
              to operate and improve the Service, and we protect it as
              described in our <Link href="/privacy">Privacy Policy</Link>.
              We never see or store your ad platform passwords; access runs
              through each platform&rsquo;s OAuth flow and can be revoked by
              you at any time.
            </p>
          </section>

          <section>
            <h2>8. Disclaimers</h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as
              available.&rdquo; We make no express or implied warranties of
              merchantability, fitness for a particular purpose, or
              non-infringement. Advertising performance depends on many
              factors outside our control; we do not guarantee any particular
              results, return on ad spend, or campaign outcome, and
              recommendations produced by the Service are not professional or
              financial advice.
            </p>
          </section>

          <section>
            <h2>9. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, Mentic shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or for lost profits, revenue, or data, arising
              from your use of the Service. Our total liability for any claim
              relating to the Service is limited to the amount you paid us in
              the twelve months before the event giving rise to the claim.
            </p>
          </section>

          <section>
            <h2>10. Governing law</h2>
            <p>
              These Terms are governed by the laws of the State of California,
              United States, without regard to conflict of law principles.
              Any disputes arising from these Terms shall be resolved in the
              courts of San Francisco County, California.
            </p>
          </section>

          <section>
            <h2>11. Contact us</h2>
            <p>
              For questions about these Terms, please contact us:
            </p>
            <p>
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-dark-teal/55">Email</span>{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
            <p>
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-dark-teal/55">Mail</span> {LEGAL_ENTITY},{" "}
              {BUSINESS_ADDRESS}
            </p>
          </section>

          <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-dark-teal/10 pt-6 text-[13px] text-near-black/60">
            <Link href="/" className="font-semibold">
              ← Return to mentic.io
            </Link>
            <span>© {new Date().getFullYear()} {LEGAL_ENTITY}</span>
          </footer>
        </article>
      </div>
    </main>
    </>
  );
}
