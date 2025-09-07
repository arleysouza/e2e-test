import request from "supertest";
import app from "../helpers/testApp"; // Express app

describe("E2E - Fluxo de usuários", () => {
  const user = { username: "e2e.user", password: "123456" };

  it("deve registrar um novo usuário", async () => {
    const res = await request(app).post("/users").send(user);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.username).toBe(user.username);
  });

  it("deve fazer login com sucesso e obter token", async () => {
    const res = await request(app).post("/users/login").send(user);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();

    // salva o token para os próximos testes
    (global as any).token = res.body.data.token;
  });

  it("deve alterar a senha do usuário", async () => {
    const res = await request(app)
      .patch("/users/password")
      .set("Authorization", `Bearer ${(global as any).token}`)
      .send({
        oldPassword: "123456",
        newPassword: "654321",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe("Senha alterada com sucesso");
  });

  it("deve falhar login com senha antiga", async () => {
    const res = await request(app).post("/users/login").send(user);
    expect(res.status).toBe(401);
  });

  it("deve fazer login com a nova senha", async () => {
    const res = await request(app).post("/users/login").send({
      username: user.username,
      password: "654321",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it("deve realizar logout com sucesso", async () => {
    const login = await request(app).post("/users/login").send({
      username: user.username,
      password: "654321",
    });
    const token = login.body.data.token;

    const res = await request(app)
      .post("/users/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe("Logout realizado com sucesso");
  });
});
