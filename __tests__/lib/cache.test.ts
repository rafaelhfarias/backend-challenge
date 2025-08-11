import { CacheService, cacheService, CACHE_KEYS } from '@/lib/cache'

jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    on: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    exists: jest.fn(),
    isOpen: false
  }))
}))

describe('CacheService', () => {
  let cache: CacheService

  beforeEach(() => {
    jest.clearAllMocks()
    cache = CacheService.getInstance()
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = CacheService.getInstance()
      const instance2 = CacheService.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('Key Generation', () => {
    it('should generate consistent keys', () => {
      const params1 = { page: 1, search: 'test', sport: 1 }
      const params2 = { sport: 1, search: 'test', page: 1 }
      
      const key1 = cache.generateKey('test', params1)
      const key2 = cache.generateKey('test', params2)
      
      expect(key1).toBe(key2)
    })

    it('should generate different keys for different params', () => {
      const params1 = { page: 1, search: 'test' }
      const params2 = { page: 2, search: 'test' }
      
      const key1 = cache.generateKey('test', params1)
      const key2 = cache.generateKey('test', params2)
      
      expect(key1).not.toBe(key2)
    })
  })

  describe('Cache Keys Constants', () => {
    it('should have correct key names', () => {
      expect(CACHE_KEYS.ATHLETES).toBe('athletes')
      expect(CACHE_KEYS.ATHLETE_STATS).toBe('athlete_stats')
      expect(CACHE_KEYS.FILTERS).toBe('filters')
      expect(CACHE_KEYS.SEARCH).toBe('search')
    })
  })
})
