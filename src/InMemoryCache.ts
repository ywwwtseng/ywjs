export class InMemoryCache {
  static instance: InMemoryCache;
  private data: Record<
    string,
    {
      expiresAt?: number;
      value: unknown;
    }
  > = {};

  static getInstance() {
    if (!InMemoryCache.instance) {
      InMemoryCache.instance = new InMemoryCache();
    }
    return InMemoryCache.instance;
  }

  get<T>(key: string): T | null {
    if (!this.data[key]) {
      return null;
    }

    const expiresAt = this.data[key].expiresAt;

    if (expiresAt && expiresAt < Date.now()) {
      this.delete(key);
      return null;
    }

    return this.data[key].value as T;
  }

  set(key: string, value: unknown, ttl?: number) {
    if (ttl) {
      this.data[key] = {
        expiresAt: Date.now() + ttl!,
        value,
      };
    } else {
      this.data[key] = {
        value,
      };
    }
  }

  delete(key: string) {
    delete this.data[key];
  }

  clear() {
    this.data = {};
  }
}
