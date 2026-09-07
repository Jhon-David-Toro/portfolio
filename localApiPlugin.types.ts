/** A Vercel Edge Function's default export — what every api/*.ts handler is. */
export type ApiHandler = (request: Request) => Promise<Response>
