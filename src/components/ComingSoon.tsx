import SiteMenu from "@/components/SiteMenu";
import TrackedDemoLink from "@/components/TrackedDemoLink";

export type ComingSoonProps = {
  section: string;
  blurb?: string;
};

export default function ComingSoon({ section, blurb }: ComingSoonProps) {
  return (
    <main className="use-native-cursor min-h-dvh w-full bg-[#f2f2f0] text-dark-teal [font-family:var(--font-nunito),'Nunito_Sans',sans-serif] relative overflow-hidden flex flex-col">
      <SiteMenu />

      {/* Corner blobs */}
      <div
        aria-hidden
        className="gradient-blob gradient-blob-coral intro-fade-in absolute pointer-events-none w-[min(45vw,720px)] h-[min(45vw,720px)] top-[-22vw] left-[-22vw] [animation-delay:0.1s]"
      />
      <div
        aria-hidden
        className="gradient-blob gradient-blob-mint intro-fade-in absolute pointer-events-none w-[min(55vw,880px)] h-[min(55vw,880px)] bottom-[-28vw] right-[-28vw] [animation-delay:0.2s]"
      />

      <section className="flex-1 relative z-[2] flex flex-col justify-center items-center px-[clamp(20px,6vw,56px)] pt-[clamp(76px,9vh,120px)] pb-[clamp(28px,4vh,56px)] text-center">
        <h1 className="intro-blur-in m-0 [font-family:var(--font-nunito),'Nunito_Sans',sans-serif] text-[clamp(56px,11vw,168px)] leading-[0.95] font-extralight tracking-[-0.02em] text-dark-teal [animation-delay:0.1s]">
          <span className="intro-fade-up block font-extralight [animation-delay:0.18s]">{section}</span>
          <span className="intro-fade-up block font-extrabold text-coral [animation-delay:0.32s]">coming soon.</span>
        </h1>
        <p className="intro-fade-up mt-7 max-w-[560px] text-[clamp(15px,1.4vw,19px)] font-light leading-[1.55] text-dark-teal/70 [animation-delay:0.5s]">
          {blurb ?? `The ${section.toLowerCase()} page is in the workshop. We'll flip it on as soon as it's ready. In the meantime, open the menu — or grab a demo below.`}
        </p>

        <div className="intro-fade-up mt-8 flex flex-wrap gap-3 justify-center [animation-delay:0.65s]">
          <TrackedDemoLink
            source="coming_soon"
            contentName="Book a demo — coming-soon page"
            className="inline-flex items-center py-3.5 px-7 rounded-full bg-dark-teal text-[#f2f2f0] text-[13px] font-bold tracking-[0.18em] uppercase no-underline"
          >
            Book a Demo
          </TrackedDemoLink>
        </div>
      </section>
    </main>
  );
}
