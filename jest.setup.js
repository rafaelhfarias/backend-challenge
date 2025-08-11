import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.statusText = init.statusText || 'OK'
    this.headers = new Map(Object.entries(init.headers || {}))
  }

  json() {
    return Promise.resolve(this.body)
  }
}

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, init = {}) => new global.Response(data, init),
  },
}))

global.fetch = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})
