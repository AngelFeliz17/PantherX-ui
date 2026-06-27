import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#12041f] via-[#1b0b33] to-[#090312]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_65%)]" />

      <div className="relative flex flex-col items-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="absolute h-36 w-36 rounded-full border border-violet-500/20" />

          <div className="absolute h-36 w-36 animate-spin rounded-full border-4 border-transparent border-t-violet-400 border-r-violet-500" />

          <div className="absolute h-28 w-28 animate-[spin_3s_linear_reverse_infinite] rounded-full border border-violet-300/20 border-b-violet-300" />

          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-violet-700/20 shadow-[0_0_40px_rgba(168,85,247,0.35)] backdrop-blur-xl">
            <Image
              src="/favicon.ico"
              alt="PantherX"
              width={56}
              height={56}
              priority
              className="rounded-xl"
            />
          </div>
        </div>

        <h1 className="mt-8 bg-gradient-to-r from-white via-violet-200 to-violet-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          PantherX
        </h1>

        <p className="mt-2 text-sm text-violet-200/80 tracking-[0.3em] uppercase">
          Student Marketplace
        </p>

        <p className="mt-10 text-base text-gray-300 animate-pulse">
          Finding great deals for you...
        </p>
      </div>
    </div>
  );
}