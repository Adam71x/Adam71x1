'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
        <h1>حدث خطأ غير متوقع</h1>
        <p lang="en" dir="ltr">
          Something went wrong. We logged the problem.
        </p>
        <button type="button" onClick={reset}>
          حاول مرة أخرى · Try again
        </button>
      </body>
    </html>
  );
}
