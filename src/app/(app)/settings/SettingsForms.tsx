'use client';

import { useActionState } from 'react';
import type { Messages } from '@/lib/i18n/messages';
import { SubmitButton } from '@/components/SubmitButton';
import { Icon } from '@/components/Icon';
import { updateProfileAction, updateWorkspaceAction, type FormState } from './actions';

function Status({ state, savedLabel }: { state: FormState; savedLabel: string }) {
  if (state.error)
    return (
      <p className="banner bad" role="alert">
        <Icon name="info" />
        <span className="grow">{state.error}</span>
      </p>
    );
  if (state.ok)
    return (
      <p className="banner ok" role="status">
        <Icon name="check" />
        <span className="grow">{savedLabel}</span>
      </p>
    );
  return null;
}

export function ProfileForm({
  t,
  common,
  name,
  email,
}: {
  t: Messages['settings'];
  common: Messages['common'];
  name: string;
  email: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(updateProfileAction, {});
  return (
    <form action={action} className="stack">
      <div className="g2">
        <div className="fld">
          <label htmlFor="name">{t.name}</label>
          <input
            id="name"
            name="name"
            className="in"
            autoComplete="name"
            defaultValue={name}
            maxLength={80}
          />
        </div>
        <div className="fld">
          <label htmlFor="email">{t.email}</label>
          <input id="email" className="in mono" value={email} readOnly />
          <span className="hint">{t.emailHint}</span>
        </div>
      </div>
      <Status state={state} savedLabel={common.saved} />
      <div>
        <SubmitButton>{common.save}</SubmitButton>
      </div>
    </form>
  );
}

export function WorkspaceForm({
  t,
  common,
  workspaceName,
  slug,
}: {
  t: Messages['settings'];
  common: Messages['common'];
  workspaceName: string;
  slug: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(updateWorkspaceAction, {});
  return (
    <form action={action} className="stack">
      <div className="g2">
        <div className="fld">
          <label htmlFor="workspaceName">{t.workspaceName}</label>
          <input
            id="workspaceName"
            name="workspaceName"
            className="in"
            required
            minLength={2}
            maxLength={80}
            defaultValue={workspaceName}
          />
        </div>
        <div className="fld">
          <label htmlFor="slug">{t.slug}</label>
          <div className="affix" dir="ltr">
            <input
              id="slug"
              name="slug"
              className="in mono"
              required
              autoCapitalize="none"
              spellCheck={false}
              defaultValue={slug}
            />
            <span>.rasmi.sa</span>
          </div>
        </div>
      </div>
      <Status state={state} savedLabel={common.saved} />
      <div>
        <SubmitButton>{common.save}</SubmitButton>
      </div>
    </form>
  );
}
