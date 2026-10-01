import Link from "next/link";
export default function NotFound() {
  return (
    <section className="panel">
      <h1>This pear wandered off.</h1>
      <p>That page does not exist.</p>
      <Link className="text-link" href="/">
        Return to the overview
      </Link>
    </section>
  );
}
