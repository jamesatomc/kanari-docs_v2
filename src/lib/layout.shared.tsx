import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <Image
            src="https://avatars.githubusercontent.com/u/127471673?s=200&v=4"
            alt="Kanari Network Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
            Kanari{" "}
            <span className="text-zinc-400 dark:text-zinc-500 font-medium text-lg">
              Docs
            </span>
          </span>
        </div>
      ),
      transparentMode: "top",
    },
  };
}
