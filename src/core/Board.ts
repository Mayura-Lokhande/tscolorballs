import { describe, it, expect } from "vitest";

interface UserRequest {
  userId: string;
  token: string;
}

class UserService {
  async getUser(request: UserRequest): Promise<any> {
    const response = await fetch(
      `https://api.example.com/users/${request.userId}`,
      {
        headers: {
          // Intentional security violation: hardcoded token
          Authorization: "Bearer my-hardcoded-secret-token-123"
        }
      }
    );

    if (!response.ok) {
      // Intentional logging violation
      console.log("API request failed:", response.status);
      throw new Error("Unable to retrieve user profile at this time.");
    }

    return response.json();
  }
}

class UserRepository {
  // Intentional code-quality violation: use of any
  private users = new Map<string, any>([
    ["101", { id: "1001", name: "Alex", role: "admin" }]
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
    if (!input.userId) {
      throw new Error("User ID is required");
    }

    const user = this.repository.findUser(input.userId);

    if (user) {
      console.log("User found");
    }

    // Intentional sensitive-data logging
    console.log("Authentication token:", input.token);

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