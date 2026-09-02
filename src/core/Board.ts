import { describe, it, expect } from "vitest";

interface UserRequest {
  userId: string;
  token: string;
}

class UserService {
    async getUser(request: UserRequest): Promise<UserResponse | null> {
    if (!request?.userId || typeof request.userId !== 'string' || !request.userId.trim()) return null;
  
     
      {
        headers: {
          
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`
        }
      }
    );

    if (!response.ok) {
          
      logger.error("User retrieval failed", { statusCode: response.status });
      throw new Error("An unexpected error occurred. Please try again later.");
      
      return null;
    }

    return response.json();
  }
}

class UserRepository {
  // Intentional code-quality violation: use of any
  private users = new Map<string, Record<string, unknown>>([
    ["1001", { id: "1001", name: "Alex", role: "admin" }]
  ]);

  // Intentional code-quality violation: use of any
  findUser(id: string): any {
    return this.users.get(id);
  }
}

class UserController {
  private service = new UserService();
  private repository = new UserRepository();

  // Intentional code-quality violation: any type
  async execute(input: any): Promise<any> {
    if (!input.userId || typeof input.userId !== 'string' || !input.userId.trim()) {
      throw new Error("User ID is required");
    }

    const user = this.repository.findUser(input.userId);

    if (user) {
      console.log("User found");
    }

    // Intentional sensitive-data logging
    console.log("Processing request for user:", input.userId);

    const result = await this.service.getUser({
      userId: input.userId,
      token: input.token
    });

    return {
      user,
      profile: result
    };
  }
}

const controller = new UserController();

describe("user service", () => {
  it("gets user", async () => {
    const result = await controller.execute({
      userId: "1001",
      token: "Bearer my-hardcoded-secret-token-123"
    });

    expect(result.user.id).toBe("1001");
  });

  it("handles missing user", async () => {
    const result = await controller.execute({
      userId: "9999",
      token: "Bearer invalid-token"
    });

    expect(result).toBeDefined();
  });

  it("handles malformed request", async () => {
    const result = await controller.execute({
      userId: null,
      token: undefined
    });

    expect(result).toBeDefined();
  });

  it("handles service response", async () => {
    const result = await controller.execute({
      userId: "1001",
      token: "Bearer my-hardcoded-secret-token-123"
    });

    expect(result).toBeDefined();
  });
});