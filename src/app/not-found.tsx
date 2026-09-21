import Link from "next/link";


export default function NotFound() {
  return (
    <main className="flex min-h-[75svh] items-center justify-center bg-snow px-5 py-16 text-ink">
      <div className="max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
          Page not found
        </p>

        <h1 className="mt-5 font-serif text-8xl">404</h1>

        <h2 className="mt-5 font-serif text-3xl">
          Oops... that scent isn’t here.
        </h2>

        <p className="mt-4 text-sm leading-7 text-ink/60">
          The page you’re looking for may have drifted away.
          Let’s get you back to something beautiful.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center bg-ink px-7 py-3 text-sm font-medium text-snow transition hover:bg-ink/90"
        >
          Return Home →
        </Link>
      </div>
    </main>
  );
}