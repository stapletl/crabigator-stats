// WaniKani API Client

import type {
  WKResource,
  WKCollection,
  User,
  LevelProgression,
  Assignment,
  Subject,
  ReviewStatistic,
  Summary,
  ApiError,
} from "./types";

const BASE_URL = "https://api.wanikani.com/v2";
const REVISION_HEADER = "20170710";

export class WaniKaniAPIError extends Error {
  constructor(
    message: string,
    public code: number,
    public status?: number
  ) {
    super(message);
    this.name = "WaniKaniAPIError";
  }
}

export class WaniKaniAPI {
  private apiKey: string;
  private requestQueue: Array<() => Promise<void>> = [];
  private requestsInLastMinute: number[] = [];
  private isProcessingQueue = false;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async queueRequest<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      // Clean up old timestamps (older than 60 seconds)
      const now = Date.now();
      this.requestsInLastMinute = this.requestsInLastMinute.filter(
        (timestamp) => now - timestamp < 60000
      );

      // If we've hit the rate limit, wait
      if (this.requestsInLastMinute.length >= 60) {
        const oldestRequest = this.requestsInLastMinute[0];
        const waitTime = 60000 - (now - oldestRequest);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      // Process next request
      const request = this.requestQueue.shift();
      if (request) {
        this.requestsInLastMinute.push(Date.now());
        await request();
      }
    }

    this.isProcessingQueue = false;
  }

  private async makeRequest<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    return this.queueRequest(async () => {
      const url = new URL(`${BASE_URL}${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Wanikani-Revision": REVISION_HEADER,
        },
      });

      // Handle rate limiting with exponential backoff
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return this.makeRequest<T>(endpoint, params);
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new WaniKaniAPIError(
            "Invalid API key",
            401,
            response.status
          );
        }

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData: ApiError = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If we can't parse the error, use the default message
        }

        throw new WaniKaniAPIError(
          errorMessage,
          response.status,
          response.status
        );
      }

      return response.json();
    });
  }

  async getUser(): Promise<WKResource<User>> {
    return this.makeRequest<WKResource<User>>("/user");
  }

  async getLevelProgressions(
    params?: { updated_after?: string }
  ): Promise<WKCollection<LevelProgression>> {
    return this.makeRequest<WKCollection<LevelProgression>>(
      "/level_progressions",
      params as Record<string, string>
    );
  }

  async getAssignments(
    params?: { updated_after?: string; subject_ids?: string; levels?: string }
  ): Promise<WKCollection<Assignment>> {
    return this.makeRequest<WKCollection<Assignment>>(
      "/assignments",
      params as Record<string, string>
    );
  }

  async getSubjects(
    params?: { updated_after?: string; ids?: string; types?: string }
  ): Promise<WKCollection<Subject>> {
    return this.makeRequest<WKCollection<Subject>>(
      "/subjects",
      params as Record<string, string>
    );
  }

  async getReviewStatistics(
    params?: { updated_after?: string; subject_ids?: string }
  ): Promise<WKCollection<ReviewStatistic>> {
    return this.makeRequest<WKCollection<ReviewStatistic>>(
      "/review_statistics",
      params as Record<string, string>
    );
  }

  async getSummary(): Promise<WKResource<Summary>> {
    return this.makeRequest<WKResource<Summary>>("/summary");
  }

  async getAllPages<T>(
    firstPageUrl: string,
    params?: Record<string, string>
  ): Promise<WKResource<T>[]> {
    const results: WKResource<T>[] = [];
    let nextUrl: string | null = firstPageUrl;

    while (nextUrl) {
      const response: WKCollection<T> = await this.makeRequest<WKCollection<T>>(
        nextUrl.replace(BASE_URL, ""),
        nextUrl === firstPageUrl ? params : undefined
      );

      results.push(...response.data);
      nextUrl = response.pages.next_url;
    }

    return results;
  }
}

export async function validateApiKey(apiKey: string): Promise<{
  valid: boolean;
  user?: WKResource<User>;
  error?: string;
}> {
  try {
    const api = new WaniKaniAPI(apiKey);
    const user = await api.getUser();

    // Check if user has a full subscription
    if (user.data.subscription.max_level_granted < 60) {
      return {
        valid: false,
        error: "This app only supports full WaniKani subscriptions",
      };
    }

    return { valid: true, user };
  } catch (error) {
    if (error instanceof WaniKaniAPIError) {
      if (error.code === 401) {
        return { valid: false, error: "Invalid API key" };
      }
      return { valid: false, error: error.message };
    }

    return {
      valid: false,
      error: "Connection error. Check your internet.",
    };
  }
}
