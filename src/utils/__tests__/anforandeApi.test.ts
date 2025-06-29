import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sokAnforanden } from '../anforandeApi';

const sample = {
  anforanden: {
    anforande: {
      anforande_id: '1',
      dok_datum: '2024-01-01',
      talare: 'Test Talare',
      parti: 'M',
      intressent_id: '123',
      kon: 'M',
      anforandetyp: 'Huvud',
      dok_titel: 'Titel',
      rubrik: 'Rubrik',
      anforande: 'Text'
    }
  }
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('sokAnforanden', () => {
  it('returns array when API responds with single object', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sample
    }) as any;

    const res = await sokAnforanden({ p: 1 });
    expect(res).toHaveLength(1);
    expect(res[0].anforande_id).toBe('1');
  });
});

