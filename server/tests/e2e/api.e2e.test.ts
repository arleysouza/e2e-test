import request from "supertest";
import dotenv from "dotenv";
dotenv.config();

describe("API E2E Tests - Validações e rotas globais", () => {
  const API_BASE_URL = process.env.API_BASE_URL || "";
  const userData = {
    username: `e2euser`,
    password: "123456",
  };

  it("deve responder com rota não encontrada", async () => {
    const response = await request(API_BASE_URL).get("/rota-invalida");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Rota não encontrada");
  });

  describe("Validações de body (validateBody middleware)", () => {
    it("não deve permitir criar usuário sem username", async () => {
      const res = await request(API_BASE_URL).post("/users").send({ password: "123456" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Erro de validação dos campos");
    });

    it("não deve permitir criar usuário sem password", async () => {
      const res = await request(API_BASE_URL).post("/users").send({ username: "incompleteUser" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Erro de validação dos campos");
    });

    it("não deve permitir login sem username", async () => {
      const res = await request(API_BASE_URL).post("/users/login").send({ password: "123456" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Erro de validação dos campos");
    });

    it("não deve permitir login sem password", async () => {
      const res = await request(API_BASE_URL).post("/users/login").send({ username: "anyuser" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Erro de validação dos campos");
    });

    it("não deve permitir alteração de senha sem senha atual", async () => {
      // cria usuário
      await request(API_BASE_URL).post("/users").send(userData);

      // login para obter token
      const loginRes = await request(API_BASE_URL).post("/users/login").send(userData);
      const token = loginRes.body.data.token;

      // altera senha
      const res = await request(API_BASE_URL)
        .patch("/users/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          oldPassword: "123456", // faltando newPassword
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Erro de validação dos campos");
    });

    it("não deve permitir alteração de senha sem nova senha", async () => {
      // cria usuário
      await request(API_BASE_URL).post("/users").send(userData);

      // login para obter token
      const loginRes = await request(API_BASE_URL).post("/users/login").send(userData);
      const token = loginRes.body.data.token;

      // altera senha
      const res = await request(API_BASE_URL)
        .patch("/users/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          newPassword: "123456", // faltando oldPassword
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Erro de validação dos campos");
    });

    it("não deve permitir alteração de senha sem token", async () => {
      // cria usuário
      await request(API_BASE_URL).post("/users").send(userData);

      // altera senha
      const res = await request(API_BASE_URL).patch("/users/password").send({
        oldPassword: "123456",
        newPassword: "123456",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Token não fornecido");
    });
  });
});
