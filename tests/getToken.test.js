import { describe, expect, it, vi } from 'vitest';
import Cookies from 'js-cookie';
import { getToken } from '@/utils/getToken';

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('getToken', () => {
  it('returns null when the token cookie is missing', () => {
    Cookies.get.mockReturnValue(undefined);

    expect(getToken()).toBeNull();
  });

  it('flattens cookie user data with token', () => {
    Cookies.get.mockReturnValue(JSON.stringify({
      token: 'JWT test',
      user: { username: 'admin' },
    }));

    expect(getToken()).toEqual({
      username: 'admin',
      token: 'JWT test',
    });
  });
});
