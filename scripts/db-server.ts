import { join } from "node:path";

const serverPath = join(
	import.meta.dir,
	"../node_modules/.bun/@electric-sql+pglite-socket@0.1.3+bab42e0ab9dcd67a/node_modules/@electric-sql/pglite-socket/dist/scripts/server.js",
);

const child = Bun.spawn(
	[process.execPath, serverPath, "-d", "./.pgdata", "-p", "5432", "-m", "20"],
	{
		cwd: join(import.meta.dir, ".."),
		stdio: ["inherit", "inherit", "inherit"],
	},
);

await child.exited;
