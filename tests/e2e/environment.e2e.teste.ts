import { execSync } from "child_process";

describe("Environment E2E Tests", () => {
  it("deve ter as variáveis de ambiente corretas nos containers", async () => {
    // Verifica variáveis no container node
    const nodeEnv = execSync("docker compose exec node-app printenv | grep DB_HOST")
      .toString()
      .trim();

    expect(nodeEnv).toContain("DB_HOST=");
  });

  it("deve ter as portas expostas corretamente", async () => {
    const ports = execSync(
      'docker compose ps --format json | jq -r ".[] | .Publishers[] | .PublishedPort"',
    )
      .toString()
      .trim()
      .split("\n");

    expect(ports).toContain("3001");
    expect(ports).toContain("5433");
    expect(ports).toContain("6379");
  });
});
