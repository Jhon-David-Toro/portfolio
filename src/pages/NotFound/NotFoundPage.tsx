// Rendered both for unmatched routes and for a project slug that doesn't
// exist yet — the app shell always owns the surrounding <main>, so this
// stays a plain section rather than another landmark.
export function NotFoundPage() {
  return (
    <section aria-labelledby="not-found-heading">
      <h1 id="not-found-heading">Page not found</h1>
    </section>
  )
}
