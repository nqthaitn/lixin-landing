import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase module before importing newsStorage
vi.mock('../src/supabase.js', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() =>
            Promise.resolve({
              data: [
                {
                  id: 1,
                  title_vi: 'Test Post',
                  title_en: 'Test Post EN',
                  title_zh: '测试',
                  status: 'published',
                  is_highlight: true,
                  author: 'Admin',
                  author_role: 'admin',
                  category: 'general',
                  created_at: '2026-01-01T00:00:00Z',
                },
              ],
              error: null,
            })
          ),
        })),
        order: vi.fn(() =>
          Promise.resolve({
            data: [
              {
                id: 1,
                title_vi: 'Test Post',
                title_en: 'Test Post EN',
                title_zh: '测试',
                status: 'published',
                is_highlight: true,
                author: 'Admin',
                author_role: 'admin',
                category: 'general',
                created_at: '2026-01-01T00:00:00Z',
              },
            ],
            error: null,
          })
        ),
      })),
      insert: vi.fn(() =>
        Promise.resolve({
          data: [{ id: 2, title_vi: 'New Post' }],
          error: null,
        })
      ),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

describe('newsStorage', () => {
  let newsStorage;

  beforeEach(async () => {
    vi.resetModules();
    newsStorage = await import('../src/newsStorage.js');
  });

  it('should export getNews function', () => {
    expect(typeof newsStorage.getNews).toBe('function');
  });

  it('should export saveNews function', () => {
    expect(typeof newsStorage.saveNews).toBe('function');
  });

  it('should export deleteNews function', () => {
    expect(typeof newsStorage.deleteNews).toBe('function');
  });

  it('should export getContacts function', () => {
    expect(typeof newsStorage.getContacts).toBe('function');
  });

  it('should export saveContactRequest function', () => {
    expect(typeof newsStorage.saveContactRequest).toBe('function');
  });

  it('getNews should return an array', async () => {
    const news = await newsStorage.getNews();
    expect(Array.isArray(news)).toBe(true);
  });
});