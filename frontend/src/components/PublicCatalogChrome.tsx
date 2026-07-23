import type { ReactNode } from "react";
import Link from "next/link";

import { ArvexoLogo } from "@/components/ArvexoLogo";

type PublicCatalogChromeProps = {
  active: "tracks" | "tournaments";
  isAuthenticated: boolean;
  children: ReactNode;
};

export function PublicCatalogChrome({ active, isAuthenticated, children }: PublicCatalogChromeProps) {
  return (
    <div className="min-h-dvh bg-[#f6f4ee] text-[#15171c]">
      <a href="#catalog-content" className="fixed left-4 top-3 z-50 -translate-y-20 rounded-full bg-[#15171c] px-4 py-2 text-xs text-white focus:translate-y-0">
        К содержанию
      </a>
      <header className="sticky top-0 z-40 border-b border-[rgba(21,23,28,.08)] bg-white/94 backdrop-blur-md">
        <div className="mx-auto flex min-h-[68px] w-[min(1180px,calc(100%-24px))] items-center gap-2 sm:w-[min(1180px,calc(100%-32px))] sm:gap-6">
          <Link href="/" aria-label="Arvexo Arena, главная" className="mr-auto shrink-0">
            <ArvexoLogo markClassName="h-7 w-7 sm:h-8 sm:w-8" wordmarkClassName="hidden min-[440px]:inline" />
          </Link>
          <nav aria-label="Публичный каталог" className="flex items-center gap-0.5 sm:gap-1">
            {[
              ["tracks", "/tracks", "Треки"],
              ["tournaments", "/tournaments", "Турниры"],
            ].map(([id, href, label]) => (
              <Link
                key={id}
                href={href}
                aria-current={active === id ? "page" : undefined}
                className={`rounded-full px-2.5 py-2 text-[11.5px] font-medium transition-colors sm:px-3 sm:text-[12.5px] ${active === id ? "bg-[#edf4eb] text-[#2f6f31]" : "text-[#5f636b] hover:bg-[#f1f1ef] hover:text-[#15171c]"}`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link href={isAuthenticated ? "/app/dashboard" : "/login"} className="inline-flex h-10 shrink-0 items-center rounded-full bg-[#15171c] px-4 text-[12.5px] font-medium text-white transition-transform hover:-translate-y-px active:scale-[.98] sm:px-5">
            {isAuthenticated ? "Кабинет" : "Войти"}
          </Link>
        </div>
      </header>
      <main id="catalog-content">{children}</main>
      <footer className="mt-20 border-t border-[rgba(21,23,28,.1)]">
        <div className="mx-auto flex min-h-[130px] w-[min(1180px,calc(100%-32px))] flex-col justify-center gap-4 py-8 text-[12px] text-[#72767d] sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-[#15171c]"><ArvexoLogo /></Link>
          <div className="flex gap-5">
            <Link href="/tracks" className="hover:text-[#15171c]">Треки</Link>
            <Link href="/tournaments" className="hover:text-[#15171c]">Турниры</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
