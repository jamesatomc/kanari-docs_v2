import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center px-4 py-20 bg-gradient-to-b from-transparent to-blue-50/20 dark:to-blue-950/10">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Kanari Network
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
          A secure blockchain platform for file metadata storage and
          verification powered by Move VM.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left py-12">
          <div className="p-6 rounded-2xl border border-blue-100 dark:border-blue-900 bg-white/50 dark:bg-blue-950/20 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">
              Metadata Management
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ensure file ownership tracking, timestamp verification, and
              immutable references on-chain.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-cyan-100 dark:border-cyan-900 bg-white/50 dark:bg-cyan-950/20 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-cyan-700 dark:text-cyan-400 mb-2">
              Move VM Powered
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Leveraging the Move Virtual Machine for secure and verifiable
              smart contract execution.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-blue-100 dark:border-blue-900 bg-white/50 dark:bg-blue-950/20 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">
              Web3 Ecosystem
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Seamlessly bridge file storage with decentralized metadata for a
              trustless experience.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/docs"
            className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-lg shadow-blue-500/20"
          >
            Explore Documentation
          </Link>
          <a
            href="https://github.com/kanari-network"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-semibold transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
