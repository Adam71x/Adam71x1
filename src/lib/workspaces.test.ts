import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb, resetDb } from './db/testing';
import type { Db } from './db/types';
import { findOrCreateUser } from './users';
import {
  createWorkspaceForUser,
  getWorkspace,
  getWorkspaceForUser,
  updateWorkspace,
  validateSlug,
} from './workspaces';

let db: Db;
let close: () => Promise<void>;

beforeAll(async () => ({ db, close } = await createTestDb()));
afterAll(() => close());
beforeEach(() => resetDb(db));

describe('validateSlug', () => {
  it.each(['noura', 'noura-design', 'studio9', 'abc'])('accepts %s', (slug) => {
    expect(validateSlug(slug)).toEqual({ ok: true, slug });
  });

  it('lowercases and trims', () => {
    expect(validateSlug('  Noura ')).toEqual({ ok: true, slug: 'noura' });
  });

  it.each(['ab', '-noura', 'noura-', 'no--ura', 'نورة', 'noura.design', 'a'.repeat(31)])(
    'rejects %s',
    (slug) => {
      expect(validateSlug(slug)).toEqual({ ok: false, reason: 'format' });
    },
  );

  it('rejects reserved addresses', () => {
    expect(validateSlug('admin')).toEqual({ ok: false, reason: 'reserved' });
    expect(validateSlug('www')).toEqual({ ok: false, reason: 'reserved' });
  });
});

describe('workspaces', () => {
  it('creates a workspace with the user as owner', async () => {
    const user = await findOrCreateUser(db, 'noura@example.com', 'ar');
    const result = await createWorkspaceForUser(db, user.id, {
      name: 'Noura Studio',
      slug: 'noura',
    });
    expect(result.ok).toBe(true);
    const found = await getWorkspaceForUser(db, user.id);
    expect(found?.workspace.slug).toBe('noura');
    expect(found?.role).toBe('owner');
  });

  it('allows one workspace per account in the MVP', async () => {
    const user = await findOrCreateUser(db, 'noura@example.com', 'ar');
    await createWorkspaceForUser(db, user.id, { name: 'Noura Studio', slug: 'noura' });
    expect(await createWorkspaceForUser(db, user.id, { name: 'Second', slug: 'second' })).toEqual({
      ok: false,
      reason: 'exists',
    });
  });

  it('rejects taken, reserved and badly formed addresses', async () => {
    const a = await findOrCreateUser(db, 'a@example.com', 'ar');
    const b = await findOrCreateUser(db, 'b@example.com', 'ar');
    await createWorkspaceForUser(db, a.id, { name: 'Alice', slug: 'shared' });
    expect(await createWorkspaceForUser(db, b.id, { name: 'Bee', slug: 'shared' })).toEqual({
      ok: false,
      reason: 'slug_taken',
    });
    expect(await createWorkspaceForUser(db, b.id, { name: 'Bee', slug: 'admin' })).toEqual({
      ok: false,
      reason: 'slug_reserved',
    });
    expect(await createWorkspaceForUser(db, b.id, { name: 'Bee', slug: 'x' })).toEqual({
      ok: false,
      reason: 'slug_format',
    });
    expect(await createWorkspaceForUser(db, b.id, { name: ' ', slug: 'bee' })).toEqual({
      ok: false,
      reason: 'name',
    });
    // A failed attempt leaves no half-created workspace behind.
    expect(await getWorkspaceForUser(db, b.id)).toBeNull();
  });

  it('updates name and address for the owner', async () => {
    const user = await findOrCreateUser(db, 'noura@example.com', 'ar');
    const created = await createWorkspaceForUser(db, user.id, { name: 'Noura', slug: 'noura' });
    if (!created.ok) throw new Error('setup failed');
    const updated = await updateWorkspace(
      db,
      { userId: user.id, workspaceId: created.workspace.id },
      { name: 'Noura Design', slug: 'noura-design' },
    );
    expect(updated.ok && updated.workspace.slug).toBe('noura-design');
  });
});

describe('tenant isolation', () => {
  async function twoTenants() {
    const alice = await findOrCreateUser(db, 'alice@example.com', 'ar');
    const bob = await findOrCreateUser(db, 'bob@example.com', 'en');
    const a = await createWorkspaceForUser(db, alice.id, { name: 'Alice', slug: 'alice' });
    const b = await createWorkspaceForUser(db, bob.id, { name: 'Bob', slug: 'bob' });
    if (!a.ok || !b.ok) throw new Error('setup failed');
    return { alice, bob, aliceWs: a.workspace, bobWs: b.workspace };
  }

  it('a user only sees their own workspace', async () => {
    const { alice, bob, aliceWs, bobWs } = await twoTenants();
    expect((await getWorkspaceForUser(db, alice.id))?.workspace.id).toBe(aliceWs.id);
    expect((await getWorkspaceForUser(db, bob.id))?.workspace.id).toBe(bobWs.id);
  });

  it('a user cannot read another tenant’s workspace by id', async () => {
    const { bob, aliceWs } = await twoTenants();
    expect(await getWorkspace(db, bob.id, aliceWs.id)).toBeNull();
  });

  it('a user cannot update another tenant’s workspace', async () => {
    const { alice, bob, aliceWs } = await twoTenants();
    expect(
      await updateWorkspace(
        db,
        { userId: bob.id, workspaceId: aliceWs.id },
        { name: 'Hijacked', slug: 'hijacked' },
      ),
    ).toEqual({ ok: false, reason: 'forbidden' });
    expect((await getWorkspaceForUser(db, alice.id))?.workspace).toMatchObject({
      name: 'Alice',
      slug: 'alice',
    });
  });
});
