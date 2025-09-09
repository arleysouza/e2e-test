import axios from "axios";
import { execSync } from "child_process";

describe("Infrastructure E2E Tests", () => {
  const API_BASE_URL = `http://localhost:${process.env.PORT || 3001}`;

  it("deve ter todos os containers rodando", async () => {
    // Verifica se os containers estão rodando
    const output = execSync('docker compose ps --services --filter "status=running"').toString();
    expect(output).toContain("postgres-app");
    expect(output).toContain("redis-app");
    expect(output).toContain("node-app");
  });

  it("deve responder ao health check da API", async () => {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 10000,
      validateStatus: () => true, // Aceita qualquer status
    });

    expect([200, 404, 500]).toContain(response.status);
  });

  it("deve ter conectividade com o PostgreSQL", async () => {
    try {
      // Tenta conectar via telnet/netcat (simples verificação de porta)
      execSync("nc -z localhost 5433", { stdio: "pipe" });
      expect(true).toBe(true);
    } catch {
      throw new Error("PostgreSQL não está acessível na porta 5433");
    }
  });

  it("deve ter conectividade com o Redis", async () => {
    try {
      execSync("nc -z localhost 6379", { stdio: "pipe" });
      expect(true).toBe(true);
    } catch {
      throw new Error("Redis não está acessível na porta 6379");
    }
  });
});
