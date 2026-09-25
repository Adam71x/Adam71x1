'use client';

import { useActionState } from 'react';
import { signInAction, type SignInState } from '@/lib/auth/actions';
import type { Messages } from '@/lib/i18n/messages';
import { SubmitButton } from '@/components/SubmitButton';
import { Icon } from '@/components/Icon';

export function SignInForm({ t }: { t: Messages['signIn'] }) {
  const [state, action] = useActionState<SignInState, FormData>(signInAction, {
    step: 'email',
    email: '',
  });

  return (
    <div className="auth-card">
      <h2>{state.step === 'email' ? t.title : t.codeTitle}</h2>
      {state.error && (
        <p className="banner bad" role="alert">
          <Icon name="info" />
          <span className="grow">{state.error}</span>
        </p>
      )}
      {state.step === 'email' ? (
        <form action={action} className="stack" noValidate>
          <div className="fld">
            <label htmlFor="email">{t.emailLabel}</label>
            <input
              id="email"
              name="email"
              type="email"
              className="in"
              autoComplete="email"
              inputMode="email"
              dir="ltr"
              defaultValue={state.email}
              required
              autoFocus
            />
          </div>
          <SubmitButton name="intent" value="request">
            {t.sendCode}
          </SubmitButton>
          <p className="hint">{t.noPassword}</p>
        </form>
      ) : (
        <form action={action} className="stack" noValidate>
          {state.notice && <p className="muted">{state.notice}</p>}
          <input type="hidden" name="email" value={state.email} />
          <div className="fld">
            <label htmlFor="code">{t.codeLabel}</label>
            <input
              id="code"
              name="code"
              className="in otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              required
              autoFocus
            />
          </div>
          <SubmitButton name="intent" value="verify">
            {t.signIn}
          </SubmitButton>
          <div className="row spread">
            <SubmitButton className="btn ghost sm" name="intent" value="change">
              {t.changeEmail}
            </SubmitButton>
            <SubmitButton className="btn ghost sm" name="intent" value="resend">
              {t.resend}
            </SubmitButton>
          </div>
        </form>
      )}
    </div>
  );
}
