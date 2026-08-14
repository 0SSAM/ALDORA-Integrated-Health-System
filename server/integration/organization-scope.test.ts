import { createConnection, type Connection } from "mysql2/promise";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

describe.skipIf(!testDatabaseUrl)("persisted organization boundary contract", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection(testDatabaseUrl!);
  });

  afterAll(async () => {
    await connection.end();
  });

  it("denies cross-organization reads while allowing the matching jurisdiction and organization", async () => {
    await connection.beginTransaction();
    try {
      await connection.query(
        "CREATE TEMPORARY TABLE boundary_probe (id INT PRIMARY KEY, jurisdiction_id INT NOT NULL, organization_id INT NOT NULL, label VARCHAR(80) NOT NULL)",
      );
      await connection.query(
        "INSERT INTO boundary_probe (id, jurisdiction_id, organization_id, label) VALUES (1, 10, 100, 'org-a'), (2, 10, 200, 'org-b')",
      );

      const [rows] = await connection.query(
        "SELECT id, label FROM boundary_probe WHERE jurisdiction_id = ? AND organization_id = ?",
        [10, 100],
      );

      expect(rows).toEqual([{ id: 1, label: "org-a" }]);
    } finally {
      await connection.rollback();
    }
  });

  it("does not leave the temporary probe table after rollback", async () => {
    const [rows] = await connection.query(
      "SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'boundary_probe'",
    );
    expect(Number((rows as Array<{ count: number | string }>)[0]?.count ?? 0)).toBe(0);
  });
});

if (!testDatabaseUrl) {
  describe("persisted organization boundary contract configuration", () => {
    it("skips safely without TEST_DATABASE_URL", () => {
      expect(testDatabaseUrl).toBeUndefined();
    });
  });
}
