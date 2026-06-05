"use client";

import Image from "next/image";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-coral flex flex-col items-center justify-center font-['Nunito_Sans','Helvetica_Neue',Arial,sans-serif] py-10 px-6 text-center">
      <Image
        src="/images/mentic-icon-mint.png"
        alt="Mentic"
        width={80}
        height={80}
        className="mb-8 [filter:drop-shadow(2px_2px_16px_rgba(0,0,0,0.12))]"
      />

      <h1 className="font-qurova text-[clamp(80px,15vw,160px)] font-bold text-dark-teal leading-none m-0 mb-2">
        500
      </h1>

      <p className="text-[clamp(16px,3vw,24px)] font-semibold text-off-white m-0 mb-2">
        Something went wrong.
      </p>

      <p className="text-[clamp(13px,2vw,16px)] font-light text-off-white/60 m-0 mb-10 max-w-[360px]">
        Don&apos;t worry, it&apos;s on us. Give it another shot.
      </p>

      <button
        onClick={reset}
        className="inline-block bg-dark-teal text-mint text-[clamp(14px,2vw,16px)] font-bold font-['Nunito_Sans',sans-serif] py-3.5 px-9 rounded-xl border-none cursor-pointer shadow-[2px_2px_16px_rgba(0,0,0,0.2)] [transition:transform_200ms_cubic-bezier(0.165,0.84,0.44,1),box-shadow_200ms_ease]"
      >
        Try again
      </button>

      <p className="absolute bottom-6 text-xs text-dark-teal/40 font-semibold">
        mentic.io
      </p>
    </div>
  );
}
