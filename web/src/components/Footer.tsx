import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon.png" alt="Woob Studios" width={24} height={24} />
            <span className="text-sm font-semibold">Woob Studios</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/games" className="text-xs text-muted hover:text-foreground transition-colors">Games</Link>
            <Link href="/ugc" className="text-xs text-muted hover:text-foreground transition-colors">UGC</Link>
            <Link href="/groups" className="text-xs text-muted hover:text-foreground transition-colors">Groups</Link>
          </div>

          <p className="text-[11px] text-muted/60">
            &copy; {new Date().getFullYear()} Woob Studios
          </p>
        </div>
      </div>
    </footer>
  );
}
