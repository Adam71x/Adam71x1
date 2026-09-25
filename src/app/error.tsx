'use client';

import { useEffect } from 'react';

// Error boundaries run on the client without the message dictionary, so both languages are shown.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="center-page">
      <div className="card stack" style={{ width: 'min(460px, 100%)' }}>
        <h1 lang="ar">حدث خطأ غير متوقع</h1>
        <p className="muted" lang="en" dir="ltr">
          Something went wrong. We logged the problem.
        </p>
        {error.digest && <p className="hint mono">ref: {error.digest}</p>}
        <div>
          <button type="button" className="btn pri" onClick={reset}>
            حاول مرة أخرى · Try again
          </button>
        </div>
      </div>
    </main>
  );
}
