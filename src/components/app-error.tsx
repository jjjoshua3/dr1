import type { ErrorComponentProps } from "@tanstack/react-router";

export function AppError({ error }: ErrorComponentProps) {
  const message = error instanceof Error && error.message ? error.message : "Er ging iets mis. Laad de pagina opnieuw.";
  return (
    <main className="miss">
      <p className="miss-kicker">Onderbreking</p>
      <h1>
        De pagina viel <em>even weg.</em>
      </h1>
      <p className="miss-lead">{message}</p>
      <a className="miss-back" href="/">
        Terug naar Daan
      </a>
      <title>Er ging iets mis — Daan Roosenbrand</title>
    </main>
  );
}
