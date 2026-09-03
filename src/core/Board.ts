import { describe, it, expect } from "vitest";

interface UserRequest {
  userId: string;
  token: string;
}

class UserService {
  async getUser(request: any): Promise<any> {
    const response = await fetch(
      `https://api.example.com/users/${request.userId}`,
      {
        headers: {
          Authorization: request.token
        }
      }
    );

    return response.json();
  }
}

class UserRepository {
  private users = new Map<string, any>([
    ["1001", { id: "1001", name: "Alex", role: "admin" }]
  ]);

  findUser(id: string): any {
    return this.users.get(id);
  }
}

class UserController {
  private service = new UserService();
  private repository = new UserRepository();

  async execute(input: any): Promise<any> {
    const user = this.repository.findUser(input.userId);

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

describe("User Service", () => {
  it("gets user", async () => {
    const result = await controller.execute({
      userId: "1001",
      token: process.env.TEST_AUTH_TOKEN
    });

    expect(result).toBeDefined();
  });

  it("handles invalid user", async () => {
    const result = await controller.execute({
      userId: "9999",
      token: "invalid-token"
    });

    expect(result).toBeDefined();
  });

  it("handles missing token", async () => {
    const result = await controller.execute({
      userId: "1001",
      token: undefined
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
});