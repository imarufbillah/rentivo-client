import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient, ApiError } from '@/lib/api/client';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: { id: 1, name: 'Test' } }),
  });
});

describe('ApiClient', () => {
  describe('get', () => {
    it('sends GET request with credentials', async () => {
      await apiClient.get('/api/properties');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/properties',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
    });

    it('appends query params to URL', async () => {
      await apiClient.get('/api/properties', { location: 'New York', page: 1 });

      const url = mockFetch.mock.calls[0][0];
      expect(url).toContain('location=New+York');
      expect(url).toContain('page=1');
    });

    it('filters out undefined params', async () => {
      await apiClient.get('/api/properties', { location: 'New York', minPrice: undefined });

      const url = mockFetch.mock.calls[0][0];
      expect(url).toContain('location=New+York');
      expect(url).not.toContain('minPrice');
    });

    it('returns data from response', async () => {
      const result = await apiClient.get('/api/properties');

      expect(result).toEqual({ id: 1, name: 'Test' });
    });
  });

  describe('post', () => {
    it('sends POST request with body', async () => {
      await apiClient.post('/api/properties', { title: 'Test Property' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/properties',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ title: 'Test Property' }),
        })
      );
    });
  });

  describe('patch', () => {
    it('sends PATCH request with body', async () => {
      await apiClient.patch('/api/properties/123', { price: 2000 });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/properties/123',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ price: 2000 }),
        })
      );
    });
  });

  describe('delete', () => {
    it('sends DELETE request', async () => {
      await apiClient.delete('/api/properties/123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/properties/123',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('error handling', () => {
    it('throws ApiError on non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: { code: 'RESOURCE_NOT_FOUND', message: 'Not found' } }),
      });

      await expect(apiClient.get('/api/properties/999')).rejects.toThrow(ApiError);
    });

    it('includes code and status in ApiError', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ error: { code: 'INSUFFICIENT_ROLE', message: 'Forbidden' } }),
      });

      try {
        await apiClient.get('/api/properties');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).code).toBe('INSUFFICIENT_ROLE');
        expect((error as ApiError).status).toBe(403);
      }
    });
  });
});
