/** A single repository node as returned by GitHub's GraphQL API. */
export type GraphQLRepoNode = {
  readonly databaseId: number
  readonly name: string
  readonly url: string
  readonly description: string | null
  readonly primaryLanguage: { readonly name: string } | null
  readonly stargazerCount: number
  readonly defaultBranchRef: {
    readonly target: { readonly history: { readonly totalCount: number } }
  } | null
}

/** Raw shape of GitHub's GraphQL response for the activity query. */
export type GraphQLResponse = {
  readonly data?: {
    readonly user: {
      readonly followers: { readonly totalCount: number }
      readonly allPublicRepos: { readonly totalCount: number }
      readonly ownRepos: { readonly nodes: readonly GraphQLRepoNode[] }
    } | null
  }
}
