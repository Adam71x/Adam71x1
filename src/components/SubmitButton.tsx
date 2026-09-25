'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({
  children,
  className = 'btn pri',
  name,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      name={name}
      value={value}
      disabled={pending}
      aria-busy={pending}
    >
      {children}
    </button>
  );
}
