import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
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
