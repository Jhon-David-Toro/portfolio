import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cx } from '@/core/style/cx'
import { profile } from '@/content/profile/profile'
import { Button } from '@/design-system/Button/Button'
import { Modal } from '@/design-system/Modal/Modal'
import { SectionNote } from '@/design-system/SectionNote/SectionNote'
import { Stat } from '@/design-system/Stat/Stat'
import { StarIcon } from '@/design-system/icons/StarIcon'
import type { GithubReposModalProps, RepoListItemProps } from './GithubRepos.types'
import { useGithubActivity } from './useGithubActivity'
import styles from './GithubReposModal.module.scss'

const SKELETON_ROW_COUNT = 5

/** Renders one repository row — click it to reveal its description. */
function RepoListItem({ repo, description, isExpanded, onToggle }: RepoListItemProps) {
  const { t } = useTranslation()

  return (
    <li>
      <button type="button" className={styles.repoRow} aria-expanded={isExpanded} onClick={onToggle}>
        <span className={styles.repoName}>{repo.name}</span>
        <span className={styles.repoMeta}>
          {repo.language && <span className={styles.repoLanguage}>{repo.language}</span>}
          {repo.commitCount !== null && (
            <span className={styles.repoCommits}>
              {t('github.commits', { count: repo.commitCount })}
            </span>
          )}
          <span className={styles.repoStars}>
            <StarIcon />
            {repo.stargazersCount}
          </span>
        </span>
      </button>
      {isExpanded && <p className={styles.repoDescription}>{description}</p>}
    </li>
  )
}

/** Renders placeholder stats and rows shaped like the real content, while it loads. */
function GithubActivitySkeleton() {
  const { t } = useTranslation()

  return (
    <>
      <span className={styles.srOnly} aria-live="polite">
        {t('github.loading')}
      </span>
      <ul className={styles.stats} aria-hidden="true">
        <li className={styles.stat}>
          <span className={cx(styles.skeleton, styles.skeletonStatValue)} />
          <span className={cx(styles.skeleton, styles.skeletonStatLabel)} />
        </li>
        <li className={styles.stat}>
          <span className={cx(styles.skeleton, styles.skeletonStatValue)} />
          <span className={cx(styles.skeleton, styles.skeletonStatLabel)} />
        </li>
      </ul>
      <ul className={styles.repoList} aria-hidden="true">
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
          // Static, non-reorderable placeholder rows — index is a stable key.
          <li key={index} className={styles.skeletonRow}>
            <span className={cx(styles.skeleton, styles.skeletonRepoName)} />
            <span className={cx(styles.skeleton, styles.skeletonRepoMeta)} />
          </li>
        ))}
      </ul>
    </>
  )
}

/**
 * Renders every real, non-fork GitHub repository in a modal, fetched live
 * from GitHub's public REST API (see githubApi.ts) — opened from the
 * Launcher's "Repositorios" option. Clicking a repo reveals its description.
 */
export function GithubReposModal({ onClose }: GithubReposModalProps) {
  const { t } = useTranslation()
  const [activity, retry] = useGithubActivity()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const titleId = useId()

  function toggleExpanded(id: number) {
    setExpandedId((current) => (current === id ? null : id))
  }

  return (
    <Modal onClose={onClose} titleId={titleId} closeLabel={t('common.close')}>
      <h2 id={titleId}>{t('github.heading')}</h2>
      <SectionNote>{t('github.note')}</SectionNote>

      {activity.kind === 'loading' && <GithubActivitySkeleton />}

      {activity.kind === 'error' && (
        <div className={styles.errorState}>
          <p className={styles.errorMessage}>{t('github.error')}</p>
          <div className={styles.errorActions}>
            <Button type="button" variant="secondary" onClick={retry}>
              {t('github.retry')}
            </Button>
            <a
              className={styles.errorLink}
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('github.viewProfile')}
            </a>
          </div>
        </div>
      )}

      {activity.kind === 'success' && (
        <>
          <ul className={styles.stats}>
            <Stat value={activity.data.profile.publicRepos} label={t('github.publicRepos')} size="md" />
            <Stat value={activity.data.profile.followers} label={t('github.followers')} size="md" />
          </ul>

          <ul className={styles.repoList}>
            {activity.data.repos.map((repo) => (
              <RepoListItem
                key={repo.id}
                repo={repo}
                description={repo.description ?? t('github.noDescription')}
                isExpanded={expandedId === repo.id}
                onToggle={() => {
                  toggleExpanded(repo.id)
                }}
              />
            ))}
          </ul>

          <a className={styles.viewAllLink} href={profile.github} target="_blank" rel="noopener noreferrer">
            {t('github.viewProfile')}
          </a>
        </>
      )}
    </Modal>
  )
}
