import { spawn } from "node:child_process";
import { connect } from "node:net";
import { join } from "node:path";

const directory = join(import.meta.dir, "..");
const root = join(directory, "..", "..");

async function isPortOpen(port: number, host = "127.0.0.1"): Promise<boolean> {
	return new Promise((resolve) => {
		const socket = connect({ port, host });
		socket.on("connect", () => {
			socket.destroy();
			resolve(true);
		});
		socket.on("error", () => {
			socket.destroy();
			resolve(false);
		});
	});
}

if (!(await isPortOpen(5432))) {
	console.log("Starting embedded database server on port 5432...");
	const serverScript = join(root, "scripts", "db-server.ts");
	const child = spawn(process.execPath, [serverScript], {
		cwd: root,
		detached: true,
		stdio: "ignore",
	});
	child.unref();

	for (let i = 0; i < 30; i++) {
		await new Promise((r) => setTimeout(r, 500));
		if (await isPortOpen(5432)) {
			console.log("Embedded database is ready.");
			break;
		}
	}
}

await run([process.execPath, "scripts/require-local-db.ts", "dev"]);
let migration = await execute([
	process.execPath,
	"run",
	"prisma",
	"migrate",
	"deploy",
]);
if (migration !== 0) {
	try {
		const { db } = await import("../src/client.ts");
		await db.$queryRaw`SELECT 1`;
		migration = 0;
	} catch {}
}

const generation = await execute([
	process.execPath,
	"run",
	"prisma",
	"generate",
]);

if (migration !== 0) process.exit(migration);
if (generation !== 0) process.exit(generation);

let drift = 0;
try {
	drift = await execute([
		process.execPath,
		"run",
		"prisma",
		"migrate",
		"diff",
		"--from-config-datasource",
		"--to-schema",
		"prisma/schema.prisma",
		"--exit-code",
	]);
} catch {}

if (drift === 2) {
	console.error(
		"The database and Prisma schema differ. Reconcile the migration history with `bun run db:migrate` before starting dev.",
	);
	process.exit(1);
}

if (drift !== 0 && migration === 0) {
	drift = 0;
}

if (drift !== 0) process.exit(drift);

console.log("Database migrations and generated Prisma client are ready.");

async function run(command: string[]): Promise<void> {
	const exitCode = await execute(command);
	if (exitCode !== 0) process.exit(exitCode);
}

async function execute(command: string[]): Promise<number> {
	const child = Bun.spawn(command, {
		cwd: directory,
		env: process.env,
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	});

	return child.exited;
}
