import Image from "next/image";

interface AuthRightPanelProps {
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthRightPanel({ subtitle, children }: AuthRightPanelProps) {
  return (
    <div className="flex flex-col bg-background">
      {/* MOBILE HEADER - small screens only */}
      <div className="flex items-center gap-3 p-5 md:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
          <span className="text-lg font-bold text-white">P</span>
        </div>
        <span className="text-xl font-bold">PantherX</span>
      </div>

      {/* MEDIUM HERO */}
      <div className="relative hidden md:block lg:hidden h-60">
        <Image
          src="/images/campanile.jpg"
          alt="UNI Campus"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <span className="text-xl font-bold">P</span>
            </div>
            <span className="text-2xl font-bold">PantherX</span>
          </div>
          <p className="mt-3 text-sm text-white/90">{subtitle}</p>
        </div>
      </div>

      {/* FORM */}
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}