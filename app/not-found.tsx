import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <div
          className="mx-auto w-16 h-16 rounded-2xl grid place-items-center text-[28px] font-bold text-white"
          style={{ background: "var(--accent-gradient)" }}
        >
          ?
        </div>
        <h1 className="text-[28px] font-bold tracking-tight mt-5">Page not found</h1>
        <p className="text-[14px] text-[var(--text-2)] mt-2 max-w-[360px] mx-auto">
          That page does not exist, or the meeting it pointed to was removed.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2.5">
          <Link href="/library" className="btn btn-primary">Go to Library</Link>
          <Link href="/" className="btn btn-soft">Home</Link>
        </div>
      </div>
    </div>
  );
}
