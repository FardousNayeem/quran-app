export default function LoadingSurahPage() {
  return (
    <section
      className="min-h-[calc(100vh-var(--top-nav-size))] bg-[var(--primary-bg)]"
      style={
        {
          "--reader-padding-x": "36px",
        } as React.CSSProperties
      }
    >
      <div className="px-[var(--reader-padding-x)] py-5">
        <div className="mx-auto mb-8 space-y-3 text-center">
          <div className="mx-auto h-7 w-56 animate-pulse rounded bg-[var(--secondary-bg)]" />
          <div className="mx-auto h-4 w-36 animate-pulse rounded bg-[var(--secondary-bg)]" />
        </div>
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="border-b border-[var(--border-color)] px-[var(--reader-padding-x)] py-8"
        >
          <div className="mb-6 h-5 w-10 animate-pulse rounded bg-[var(--secondary-bg)]" />
          <div className="mb-8 ml-auto h-10 w-[42%] animate-pulse rounded bg-[var(--secondary-bg)]" />
          <div className="mb-3 h-4 w-40 animate-pulse rounded bg-[var(--secondary-bg)]" />
          <div className="h-6 w-[62%] animate-pulse rounded bg-[var(--secondary-bg)]" />
        </div>
      ))}
    </section>
  );
}