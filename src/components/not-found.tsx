import { Link } from "@tanstack/react-router";
import { Saxophone } from "@/components/saxophone";

export function NotFound() {
  return (
    <main className="miss">
      <div className="grain" aria-hidden="true" />
      <Saxophone className="miss-sax" />
      <p className="miss-code" aria-hidden="true">
        404
      </p>
      <p className="miss-kicker">Niet op het programma</p>
      <h1>
        Deze pagina staat <em>niet</em> op het podium.
      </h1>
      <p className="miss-lead">
        Het adres klopt niet, of de pagina is weggehaald. Het concert gaat gewoon verder op de homepage.
      </p>
      <Link to="/" className="miss-back">
        Terug naar Daan
      </Link>
      <title>Pagina niet gevonden — Daan Roosenbrand</title>
    </main>
  );
}
