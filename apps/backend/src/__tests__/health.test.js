process.env.SUPABASE_URL = 'https://fake-test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'fake-anon-key';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      getUser: jest.fn(),
    },
  })),
}));

const request = require('supertest');
const app = require('../app');

describe('GET /health', () => {
  it('retourne 200 avec le statut ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', service: 'luna-backend' });
  });
});
