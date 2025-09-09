import request from "supertest";
import dotenv from "dotenv";

// carrega as variáveis de ambiente do arquivo .env.e2e
dotenv.config({ path: ".env.e2e" });

describe("API E2E Tests", () => {
  // os containers da mesma rede se enxergam pelo nome do serviço
  const API_BASE_URL = process.env.API_BASE_URL || "";
  const userData = {
    username: `e2euser_${Date.now()}`,
    password: "123456",
  };
  let authToken: string;

  it("deve responder com rota não encontrada", async () => {
    try {
      const response = await request(API_BASE_URL).get("/users");
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Rota não encontrada");
    } catch (error) {
      console.error("Erro ao conectar na API:", error);
      throw new Error(
        "API não está respondendo. Certifique-se de que os containers estão rodando.",
      );
    }
  });

  it("deve criar usuário através da API real", async () => {
    const response = await request(API_BASE_URL).post("/users").send(userData);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBe("Usuário criado com sucesso.");
  });

  it("não deve permitir criar usuário duplicado", async () => {
    const response = await request(API_BASE_URL).post("/users").send(userData);
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toMatch(/já está cadastrado/i);
  });

  it("deve fazer login através da API real", async () => {
    const response = await request(API_BASE_URL).post("/users/login").send(userData);
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
    authToken = response.body.data.token;
  });

  it("deve acessar rota protegida através da API real", async () => {
    const response = await request(API_BASE_URL)
      .post("/users/logout")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
