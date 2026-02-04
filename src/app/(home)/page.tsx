import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero Section */}
      <section className="px-4 py-6">
        <div className="relative w-full min-h-[500px] rounded-[40px] overflow-hidden hero-bg flex items-center px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-7xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-bold text-white leading-[1.1]">
                Kanari
                <br />
                Network.
              </h1>
              <p className="text-zinc-400 font-medium tracking-widest text-sm md:text-base uppercase">
                Documentation Portal
              </p>
            </div>
            <div className="flex flex-col items-end text-right space-y-6">
              <p className="text-zinc-300 text-sm md:text-base max-w-sm leading-relaxed">
                Explore the secure blockchain platform for file metadata storage
                and verification. Powered by Move VM for unparalleled security
                and decentralization.
              </p>
              <div className="flex flex-wrap justify-end gap-4">
                <Link
                  href="/docs"
                  className="px-6 py-3 rounded-full bg-white text-black font-semibold flex items-center gap-2 hover:bg-zinc-200 transition-colors"
                >
                  Start Reading <MoveRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/docs/api/api-reference"
                  className="px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  API Reference
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
            Powering the Future of On-Chain Metadata
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Kanari Network provides a trustless infrastructure for developers to
            manage file ownership, timestamping, and immutable references with
            ease.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 md:px-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] rounded-[30px] overflow-hidden shadow-2xl mt-12 bg-zinc-100 dark:bg-zinc-900">
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop"
                alt="Blockchain Technology"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="aspect-[4/5] rounded-[30px] overflow-hidden shadow-2xl bg-zinc-100 dark:bg-zinc-900">
              <img
                src="https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=2093&auto=format&fit=crop"
                alt="Security and Code"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                (01) CORE TECHNOLOGY
              </p>
              <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white leading-[1.1]">
                Secure. Scalable. Verifiable.
              </h2>
            </div>
            <div className="space-y-4 text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
              <p>
                We leverage the Move Virtual Machine (Move VM) to ensure that
                every byte of metadata is handled with the highest level of
                security and predictability.
              </p>
              <p>
                Our documentation covers everything from basic integration to
                advanced smart contract development, helping you build the next
                generation of decentralized applications.
              </p>
            </div>
            <Link
              href="/docs/introduction/getting-started"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:opacity-80 transition-opacity"
            >
              Get Started <MoveRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
