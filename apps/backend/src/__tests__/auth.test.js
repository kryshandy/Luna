const request = require('supertest');

const mockSignUp = jest.fn();
const mockSignInWithPassword = jest.fn();
const mockGetUser = jest.fn();

jest.mock('../config/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: (...args) => mockSignUp(...args),
      signInWithPassword: (...args) => mockSignInWithPassword(...args),
      getUser: (...args) => mockGetUser(...args),
    },
  },
}));

const app = require('../app');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/auth/ping', () => {
  it('retourne 200 avec un message de confirmation', async () => {
    const res = await request(app).get('/api/auth/ping');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Auth controller pret.' });
  });
});

describe('POST /api/auth/register', () => {
  it('retourne 201 si l inscription reussit', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: '1', email: 'test@test.com' } },
      error: null,
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Inscription reussie');
    expect(res.body.user.email).toBe('test@test.com');
  });

  it('retourne 400 si l email est invalide', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'pas-un-email', password: 'password123' });

    expect(res.status).toBe(400);
  });

  it('retourne 400 si le mot de passe est trop court', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: '123' });

    expect(res.status).toBe(400);
  });

  it('retourne 400 si Supabase echoue', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: new Error('Email deja utilise'),
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'existant@test.com', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email deja utilise');
  });
});

describe('POST /api/auth/login', () => {
  it('retourne 200 si les identifiants sont corrects', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: {
        user: { id: '1', email: 'test@test.com' },
        session: { access_token: 'token123' },
      },
      error: null,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Connexion reussie');
    expect(res.body.user.email).toBe('test@test.com');
    expect(res.body.session.access_token).toBe('token123');
  });

  it('retourne 401 si les identifiants sont invalides', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: new Error('Identifiants invalides'),
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@test.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Identifiants invalides');
  });

  it('retourne 400 si l email est invalide', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'pas-un-email', password: 'password123' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/logout', () => {
  it('retourne 200 avec un message de deconnexion', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('token');
  });
});

describe('GET /api/auth/me', () => {
  it('retourne 200 si le token est valide', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: '1', email: 'test@test.com' } },
      error: null,
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('test@test.com');
  });

  it('retourne 401 si le token est absent', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Token manquant');
  });

  it('retourne 401 si le token est invalide', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Token invalide ou expire'),
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Token invalide');
  });

  it('retourne 401 si le format Authorization est mauvais', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Token plain-text');

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Token manquant');
  });
});
