import { describe, expect, it, vi } from 'vitest';
import { resendMailer } from './index';

describe('resendMailer', () => {
  it('posts the email to the Resend API', async () => {
    const fetchMock = vi.fn(async () => new Response('{"id":"1"}', { status: 200 }));
    await resendMailer('key-123', 'Rasmi <onboarding@resend.dev>', fetchMock).send({
      to: 'noura@example.com',
      subject: 'Code',
      text: 'Your code is 123456',
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers).toMatchObject({ Authorization: 'Bearer key-123' });
    expect(JSON.parse(String(init.body))).toEqual({
      from: 'Rasmi <onboarding@resend.dev>',
      to: ['noura@example.com'],
      subject: 'Code',
      text: 'Your code is 123456',
    });
  });

  it('throws when Resend rejects the email', async () => {
    const fetchMock = vi.fn(async () => new Response('bad key', { status: 401 }));
    await expect(
      resendMailer('bad', 'Rasmi <onboarding@resend.dev>', fetchMock).send({
        to: 'a@example.com',
        subject: 's',
        text: 't',
      }),
    ).rejects.toThrow('401');
  });
});
