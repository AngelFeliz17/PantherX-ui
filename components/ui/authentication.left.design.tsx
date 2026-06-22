import Image from "next/image";
import Feature from "@/lib/hooks/feature";

  const title = "Buy & Sell Campus Life"
  const subtitle = "The trusted marketplace for University of Northern Iowa students."
  const features =[
    { title: "Safe & Secure", description: "Verified student accounts" },
    { title: "Fast & Easy", description: "Buy and sell in minutes" },
    { title: "Best Value", description: "Great deals from students" }
]

export default function AuthLeftPanel() {
  return (
    <div className="relative hidden lg:block">
      <Image
        src="/images/campanile.jpg"
        alt="University of Northern Iowa"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <span className="text-2xl font-bold">P</span>
          </div>
          <span className="text-3xl font-bold">PantherX</span>
        </div>
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">{title}</h1>
          <p className="mt-5 text-lg text-white/90">{subtitle}</p>
        </div>
        <div className="space-y-6">
          {features.map((f) => (
            <Feature key={f.title} title={f.title} description={f.description} />
          ))}
        </div>
      </div>
    </div>
  );
}