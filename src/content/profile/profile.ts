/** GitHub handle — single source of truth for the profile URL and the live GitHub API calls. */
export const GITHUB_USERNAME = 'Jhon-Toro'

/** Language-neutral profile facts used by page metadata and contact links. */
export const profile = {
  name: 'Jhon David Toro Muriel',
  email: 'toromurieljhon@gmail.com',
  github: `https://github.com/${GITHUB_USERNAME}`,
  location: 'Caldas / Antioquia, Colombia',
} as const

/** Public path to the downloadable résumé, served from /public. */
export const CV_FILE_PATH = '/jhon-toro-cv.pdf'

/**
 * Triggers a browser download of the résumé via a transient, invisible
 * anchor — the same technique used everywhere a plain `<a download>` isn't
 * an option (a terminal command, a command-palette action).
 */
export function downloadCv(): void {
  const link = document.createElement('a')
  link.href = CV_FILE_PATH
  link.download = ''
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/** Opens the GitHub profile in a new, unprivileged tab. */
export function openGithubProfile(): void {
  window.open(profile.github, '_blank', 'noopener,noreferrer')
}
