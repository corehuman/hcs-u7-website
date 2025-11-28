import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background/90 backdrop-blur-sm py-8 text-sm text-foreground/85">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-1">
          <p className="font-medium text-foreground">HCS-U7 © 2025</p>
          <p className="max-w-xl text-xs sm:text-sm">
            Made with ❤️ for better Human–AI interaction. Open-source cognitive
            profiling system for personalized AI.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="https://github.com" className="hover:text-primary" aria-label="GitHub HCS-U7">
            GitHub
          </Link>
          <Link href="/docs" className="hover:text-primary">
            Documentation
          </Link>
          <Link href="https://discord.com" className="hover:text-primary">
            Discord
          </Link>
          <Link href="mailto:contact@hcs-u7.org" className="hover:text-primary">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
