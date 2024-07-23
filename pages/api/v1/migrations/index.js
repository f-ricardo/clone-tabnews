import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const client = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: client,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    await client.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await client.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}
