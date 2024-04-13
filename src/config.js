export const Regex = {
  COMMITS_INDEX_URL: /.*\.?github\.com\/.*\/commits\/.*\/?/,
  COMMIT_URL: /.*\.?github\.com\/.*\/commit\/([a-fA-Z0-9]+).*\/?/
}

export const STORAGE_KEY = 'committify'
export const SYNC_INTERVAL = 1000 * 60 * 10 // 10 minutes
