'use client';

import { useActionState } from 'react';
import type { Messages } from '@/lib/i18n/messages';
import { SubmitButton } from '@/components/SubmitButton';
import { Icon } from '@/components/Icon';
import { createWorkspaceAction, type OnboardingState } from './actions';

export function OnboardingForm({
  t,
  initial,
}: {
  t: Messages['onboarding'];
  initial: OnboardingState['values'];
}) {
  const [state, action] = useActionState<OnboardingState, FormData>(createWorkspaceAction, {
    values: initial,
  });
  return (
    <form action={action} className="stack">
      {state.error && (
        <p className="banner bad" role="alert">
          <Icon name="info" />
          <span className="grow">{state.error}</span>
        </p>
      )}
      <div className="fld">
        <label htmlFor="name">{t.yourName}</label>
        <input
          id="name"
          name="name"
          className="in"
          autoComplete="name"
          defaultValue={state.values.name}
        />
      </div>
      <div className="fld">
        <label htmlFor="workspaceName">{t.workspaceName}</label>
        <input
          id="workspaceName"
          name="workspaceName"
          className="in"
          required
          minLength={2}
          maxLength={80}
          defaultValue={state.values.workspaceName}
        />
        <span className="hint">{t.workspaceNameHint}</span>
      </div>
      <div className="fld">
        <label htmlFor="slug">{t.slug}</label>
        <div className="affix" dir="ltr">
          <span>https://</span>
          <input
            id="slug"
            name="slug"
            className="in mono"
            required
            autoCapitalize="none"
            spellCheck={false}
            defaultValue={state.values.slug}
          />
          <span>.rasmi.sa</span>
        </div>
        <span className="hint">{t.slugHint}</span>
      </div>
      <SubmitButton>{t.submit}</SubmitButton>
    </form>
  );
}
