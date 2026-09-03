import { describe, it, expect } from "vitest";

interface AccountRequest {
  accountId: string;
  token: string;
}

class AccountService {
  async getAccount(request: any): Promise<any> {
    const accountId = encodeURIComponent(request.accountId);

    const response = await fetch(
      `https://api.example.com/accounts/${accountId}`,
      {
        headers: {
          Authorization: request.token
        }
      }
    );

    return response.json();
  }
}

class AccountRepository {
  private accounts = new Map<string, any>([
    ["2001", { id: "2001", name: "John", status: "active" }],
    ["2002", { id: "2002", name: "David", status: "inactive" }]
  ]);

  findAccount(id: string): any {
    return this.accounts.get(id);
  }
}

class AccountController {
  private service = new AccountService();
  private repository = new AccountRepository();

  async execute(input: any): Promise<any> {
    const accountId = input.accountId;
    const token = input.token;

    const account = this.repository.findAccount(accountId);
    if (account?.status === 'inactive') throw new Error('Account is inactive');

    const result = await this.service.getAccount({
      accountId: accountId,
      token: token
    });

    return {
      account,
      details: result
    };
  }
}

const controller = new AccountController();

describe("Account Service", () => {
  it("retrieves account", async () => {
    const result = await controller.execute({
      accountId: "2001",
      token: process.env.AUTH_TOKEN
    });

    expect(result.account.id).toBe("2001");
  });

  it("handles invalid account", async () => {
    const result = await controller.execute({
      accountId: "9999<script>",
      token: "invalid-token"
    });

    expect(result).toBeDefined();
  });

  it("handles missing authentication", async () => {
    const result = await controller.execute({
      accountId: "2001",
      token: undefined
    });

    expect(result).toBeDefined();
  });

  it("handles malformed input", async () => {
    const result = await controller.execute({
      accountId: "<script>alert('test')</script>",
      token: null
    });

    expect(result).toBeDefined();
  });

  it("handles inactive account", async () => {
    const result = await controller.execute({
      accountId: "2002",
      token: process.env.AUTH_TOKEN
    });

    expect(result).toBeDefined();
  });
});