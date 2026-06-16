import Link from "next/link";

export default function Footer() {
    return (   <footer className="relative mt-20">
  {/* Wave */}
  <div className="absolute top-0 left-0 w-full -translate-y-[99%] overflow-hidden leading-none">
    <svg
      viewBox="0 0 1440 320"
      className="block h-[120px] w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id="footerGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop
            offset="0%"
            stopColor="#7c3aed"
          />
          <stop
            offset="100%"
            stopColor="#6d28d9"
          />
        </linearGradient>
      </defs>

      <path
        fill="url(#footerGradient)"
        d="
          M0,192
          C180,120,360,120,540,176
          C720,232,900,288,1080,240
          C1260,192,1350,96,1440,80
          L1440,320
          L0,320
          Z
        "
      />
    </svg>
  </div>

  {/* Footer */}
  <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white">
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-col gap-12 md:flex-row md:justify-between">
        {/* Brand */}
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <span className="text-lg font-bold">
                P
              </span>
            </div>

            <h3 className="text-3xl font-bold">
              PantherX
            </h3>
          </div>

          <p className="mt-5 text-violet-100">
            The trusted marketplace built
            exclusively for University of Northern
            Iowa students. Buy, sell, and trade
            safely with your campus community.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-16">
          <div>
            <h4 className="font-semibold">
              Navigation
            </h4>

            <div className="mt-4 flex flex-col gap-3 text-violet-100">
              <Link
                href="/login"
                className="hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="hover:text-white"
              >
                Sign Up
              </Link>

              <Link
                href="/listings"
                className="hover:text-white"
              >
                Listings
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">
              Categories
            </h4>

            <div className="mt-4 flex flex-col gap-3 text-violet-100">
              <p>Textbooks</p>
              <p>Electronics</p>
              <p>Furniture</p>
              <p>Subleases</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-white/15 pt-8 text-center text-violet-100">
        © {new Date().getFullYear()} PantherX.
        Made for UNI students.
      </div>
    </div>
  </div>
</footer>

)}