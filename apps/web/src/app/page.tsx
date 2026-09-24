type HealthResponse = {
  status: string;
  database: string;
};

async function getHealth(): Promise<HealthResponse | null> {
  const baseUrl = process.env.API_INTERNAL_URL ?? "http://localhost:3001";

  try {
    const response = await fetch(`${baseUrl}/health`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as HealthResponse;
  } catch {
    return null;
  }
}

export default async function Home() {
  const health = await getHealth();

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-950">
        <p className="text-sm font-medium text-zinc-500">Instagram Study</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Web, API e banco no mesmo ambiente
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          O Next.js consulta a API NestJS, que verifica a conexão com o
          PostgreSQL.
        </p>
        <dl className="mt-8 grid gap-3 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-zinc-100 px-4 py-3 dark:bg-zinc-900">
            <dt>API</dt>
            <dd className="font-medium">{health ? "online" : "indisponível"}</dd>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-zinc-100 px-4 py-3 dark:bg-zinc-900">
            <dt>PostgreSQL</dt>
            <dd className="font-medium">
              {health?.database === "up" ? "conectado" : "sem conexão"}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
