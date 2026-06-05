import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Mentic collects, uses, stores, shares, and protects personal information — including Meta-connected data accessed via Facebook Login and the Meta Marketing API.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy | Mentic",
    description:
      "How Mentic collects, uses, stores, shares, and protects personal information.",
    url: "https://www.mentic.io/privacy",
    type: "article",
  },
};

const EFFECTIVE_DATE = "May 11, 2026";
const CONTACT_EMAIL = "support@mentic.io";
const BUSINESS_ADDRESS = "2261 Market Street STE 67152, San Francisco, CA 94114, USA";
const LEGAL_ENTITY = "Mentic Inc.";

const SITE_URL = "https://www.mentic.io";

const privacyJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${SITE_URL}/privacy` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/privacy#webpage`,
      url: `${SITE_URL}/privacy`,
      name: "Privacy Policy | Mentic",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      datePublished: "2026-02-24",
      dateModified: "2026-05-11",
      inLanguage: "en-US",
    },
  ],
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd) }}
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
            Privacy <span className="font-bold">Policy</span>
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
            <h2>1. Overview</h2>
            <p>
              This Privacy Policy describes how {LEGAL_ENTITY}, a Delaware
              company (&ldquo;Mentic,&rdquo;
              &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
              collects, uses, shares, and protects personal information when
              you visit mentic.io or use the Mentic application (collectively,
              the &ldquo;Service&rdquo;).
            </p>
            <p>
              Mentic is an autonomous advertising agent. If you choose to
              connect your Meta account (Facebook and/or Instagram), the
              Service will access certain advertising data through Meta&rsquo;s
              authorized APIs in order to deliver the features you enable.
              This policy explains what that means in practice.
            </p>
          </section>

          <section>
            <h2>2. Information we collect</h2>

            <h3>a. Account information</h3>
            <ul>
              <li>Name, email address, and authentication identifiers (for example, a Google account ID if you sign in with Google).</li>
              <li>Account settings, preferences, and workspace configuration.</li>
            </ul>

            <h3>b. Meta-connected information (only if you connect Meta)</h3>
            <p>
              When you authorize Mentic to access your Meta assets, and based
              on the permissions and assets you select, we may access:
            </p>
            <ul>
              <li>Business, ad account, Page, Pixel, and related identifiers.</li>
              <li>Campaign, ad set, and ad metadata and settings, including any targeting you configure.</li>
              <li>Performance metrics such as spend, impressions, clicks, conversions, CPA, and ROAS.</li>
              <li>Connected asset configuration required to run ads (for example, Page or Instagram linkage).</li>
            </ul>
            <p>
              We never see or store your Meta password. Access is granted
              entirely through Meta&rsquo;s OAuth authorization flow and can
              be revoked by you at any time.
            </p>

            <h3>c. Usage and technical information</h3>
            <ul>
              <li>Activity logs for actions you take in the app, with timestamps.</li>
              <li>IP address, device and browser information, and approximate location derived from IP.</li>
            </ul>

            <h3>d. Payment information</h3>
            <p>
              Payments are processed by Stripe. We receive billing metadata
              such as subscription plan, invoice records, and payment status.
              We do not receive or store full payment card numbers.
            </p>
          </section>

          <section>
            <h2>3. How we use information</h2>
            <p>We use the information described above to:</p>
            <ul>
              <li>Provide, operate, and improve the Service, including dashboards and any automations you enable.</li>
              <li>Retrieve Meta insights and configuration needed for reporting and recommendations.</li>
              <li>Create, update, pause, or resume campaigns strictly based on your instructions and settings.</li>
              <li>Authenticate users, prevent fraud and abuse, and maintain security and audit logs.</li>
              <li>Communicate with you about your account, billing, support requests, and material changes to the Service.</li>
              <li>Comply with applicable legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2>4. How we share information</h2>
            <p>
              We do not sell your personal information, and we do not share
              it for cross-context behavioral advertising. We share information
              only in the following limited circumstances:
            </p>
            <ul>
              <li><strong>Service providers.</strong> Vendors that help us run the Service, including hosting, database, monitoring, analytics, customer support, and email infrastructure providers, processing data on our behalf under contract.</li>
              <li><strong>Payment processor.</strong> Stripe processes payments and related billing data.</li>
              <li><strong>At your direction.</strong> When you explicitly request it — for example, exporting a report or connecting a third-party tool.</li>
              <li><strong>Legal and safety.</strong> When required by law, valid legal process, or to protect the rights, property, or safety of Mentic, our users, or others.</li>
              <li><strong>Business transfers.</strong> In connection with a merger, acquisition, financing, or sale of assets, subject to standard confidentiality protections.</li>
            </ul>
          </section>

          <section>
            <h2>5. Meta Platform data</h2>
            <p>
              When you connect your Meta account, we handle Meta-derived
              information in accordance with Meta&rsquo;s Platform Terms and
              Developer Policies. Specifically, we:
            </p>
            <ul>
              <li>Use Meta data only to provide the Mentic features you have enabled.</li>
              <li>Do not sell or license Meta data to any third party.</li>
              <li>Apply least-privilege access controls and maintain security logs of API actions.</li>
              <li>Delete or anonymize Meta data when you disconnect Meta, delete your account, or upon valid request, unless retention is required by law.</li>
            </ul>
          </section>

          <section>
            <h2>6. Data deletion (Meta requirement)</h2>
            <p>
              If you connected Meta and would like the associated data
              deleted:
            </p>
            <ol>
              <li>
                Email{" "}
                <a href={`mailto:${CONTACT_EMAIL}?subject=Meta%20Data%20Deletion%20Request`}>
                  {CONTACT_EMAIL}
                </a>{" "}
                with the subject line &ldquo;Meta Data Deletion Request.&rdquo;
              </li>
              <li>Include the email address associated with your Mentic account.</li>
              <li>
                We will delete or anonymize the Meta-connected data tied to
                your account, unless retention is required by law.
              </li>
            </ol>
            <p>
              You can also disconnect Meta inside Mentic, or revoke
              Mentic&rsquo;s permissions directly from your Meta account
              settings. Once revoked, Mentic can no longer access your Meta
              data through the API.
            </p>
          </section>

          <section>
            <h2>7. Cookies and similar technologies</h2>
            <p>
              We use cookies and local storage for essential functionality
              such as keeping you signed in, remembering preferences, and
              securing the Service. We may also use limited analytics to
              understand how the Service is used and to improve it. You can
              control cookies through your browser settings; disabling
              essential cookies may affect how the Service works.
            </p>
          </section>

          <section>
            <h2>8. Data security</h2>
            <p>
              We use reasonable administrative, technical, and physical
              safeguards designed to protect your information, including:
            </p>
            <ul>
              <li>Encryption in transit (TLS) and encryption at rest where applicable.</li>
              <li>Encrypted storage of tokens, credentials, and secrets.</li>
              <li>Role-based access controls, audit logging, monitoring, and an incident response process.</li>
            </ul>
            <p>
              No system is perfectly secure. You are responsible for keeping
              your account credentials confidential and notifying us
              immediately of any suspected unauthorized access.
            </p>
          </section>

          <section>
            <h2>9. Data retention</h2>
            <p>
              We keep personal information only for as long as needed to
              provide the Service, comply with our legal obligations, resolve
              disputes, and enforce our agreements. When information is no
              longer needed, we delete or anonymize it. Backups and security
              logs may persist for a limited period under our standard
              rotation schedule before being overwritten or purged.
            </p>
          </section>

          <section>
            <h2>10. Your choices and rights</h2>
            <p>You have meaningful control over your information:</p>
            <ul>
              <li><strong>Access and update.</strong> You can review and update most of your account information from your Mentic settings.</li>
              <li><strong>Disconnect Meta.</strong> You can disconnect your Meta account in Mentic at any time, or revoke permissions in Meta&rsquo;s settings.</li>
              <li><strong>Delete your account.</strong> Contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to request deletion. We will delete or anonymize your personal information, subject to legal retention requirements.</li>
              <li><strong>Marketing emails.</strong> You can opt out of non-essential marketing emails using the unsubscribe link in any such email. We will still send transactional messages necessary to operate your account.</li>
            </ul>

            <h3>For California residents</h3>
            <p>
              If you are a California resident, the California Consumer
              Privacy Act (CCPA), as amended by the California Privacy Rights
              Act (CPRA), gives you the right to:
            </p>
            <ul>
              <li>Know what personal information we collect about you and how we use and share it.</li>
              <li>Request a copy of the personal information we hold about you.</li>
              <li>Request correction of inaccurate personal information.</li>
              <li>Request deletion of your personal information.</li>
              <li>Opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information. Mentic does not sell or share personal information for cross-context behavioral advertising.</li>
              <li>Limit the use of sensitive personal information. We do not use sensitive personal information for purposes that require this right.</li>
              <li>Be free from unlawful discrimination for exercising any of these rights.</li>
            </ul>
            <p>
              To exercise any of these rights, email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We may
              need to verify your identity before fulfilling your request.
              You may also use an authorized agent to submit a request on
              your behalf, subject to verification.
            </p>
          </section>

          <section>
            <h2>11. Children&rsquo;s privacy</h2>
            <p>
              The Service is not directed to children under 13, and we do not
              knowingly collect personal information from children under 13.
              If you believe a child has provided us with personal
              information, please contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2>12. International users</h2>
            <p>
              Mentic is based in the United States. If you access the Service
              from outside the U.S., you understand that your information
              will be transferred to, stored, and processed in the United
              States and in any other country where our service providers
              operate. By using the Service, you consent to this transfer.
            </p>
          </section>

          <section>
            <h2>13. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we
              do, we will update the &ldquo;Effective date&rdquo; at the top
              of this page. If the changes are material, we will provide
              additional notice, for example by in-app message or email.
            </p>
          </section>

          <section>
            <h2>14. Contact us</h2>
            <p>
              If you have questions about this Privacy Policy or our
              privacy practices, please contact us:
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
