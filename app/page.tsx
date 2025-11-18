export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="flex flex-col items-center justify-center gap-8 text-center px-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Crabigator Stats
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
            A comprehensive statistics dashboard for WaniKani users
          </p>
        </div>

        <div className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Project successfully initialized with:
          </p>
          <ul className="mt-3 space-y-2 text-left text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Next.js 16+ with App Router
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> React 19+
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Tailwind CSS 4+
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> TypeScript (Strict Mode)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Turbopack
            </li>
          </ul>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-500 max-w-md">
          Dependencies installed: Zustand, Recharts, IndexedDB, shadcn/ui utilities
        </p>
      </main>
    </div>
  );
}
