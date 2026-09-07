/** A single repository, mapped server-side from GitHub's GraphQL API (see api/github.ts). */
export type GithubRepo = {
  readonly id: number
  readonly name: string
  readonly htmlUrl: string
  readonly description: string | null
  readonly language: string | null
  readonly stargazersCount: number
  /** `null` when the commit-count request failed. */
  readonly commitCount: number | null
}

/** Public profile counters shown alongside the repository list. */
export type GithubProfileStats = {
  readonly publicRepos: number
  readonly followers: number
}

/** Everything the modal needs once the live GitHub data has loaded. */
export type GithubActivity = {
  readonly profile: GithubProfileStats
  readonly repos: readonly GithubRepo[]
}

/** Discriminated state of the live GitHub data fetch. */
export type GithubActivityState =
  | { readonly kind: 'loading' }
  | { readonly kind: 'error' }
  | { readonly kind: 'success'; readonly data: GithubActivity }

/** Props for the repositories modal, opened from the Launcher. */
export type GithubReposModalProps = {
  readonly onClose: () => void
}

/** Props for a single repository row — click it to reveal its description. */
export type RepoListItemProps = {
  readonly repo: GithubRepo
  /** Pre-resolved so this component doesn't need its own null-fallback branch. */
  readonly description: string
  readonly isExpanded: boolean
  readonly onToggle: () => void
}
