import { afterEach, describe, expect, it, vi } from 'vitest'
import { CV_FILE_PATH, downloadCv, openGithubProfile, profile } from './profile'

describe('downloadCv', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('clicks a transient anchor pointed at the résumé file and removes it', () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    downloadCv()

    expect(clickSpy).toHaveBeenCalledOnce()
    // The anchor must not linger in the DOM after triggering the download.
    expect(document.querySelector(`a[href="${CV_FILE_PATH}"]`)).toBeNull()
  })
})

describe('openGithubProfile', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('opens the profile URL in a new, unprivileged tab', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    openGithubProfile()

    expect(openSpy).toHaveBeenCalledWith(profile.github, '_blank', 'noopener,noreferrer')
  })
})
