import { describe, expect, it } from "vitest";
import mysql from "mysql2/promise";

describe("TEST_DATABASE_URL secret", () => {
  it("connects to the isolated test database and closes cleanly", async () => {
    const url = process.env.TEST_DATABASE_URL;
    if (!url || !/^(mysql|mysql2|mariadb):\/\//.test(url)) {
      return;
    }

    const connection = await mysql.createConnection(url);
    try {
      const [rows] = await connection.query("SELECT 1 AS ok");
      expect((rows as Array<{ ok: number }>)[0]?.ok).toBe(1);
    } finally {
      await connection.end();
    }
  });
});
