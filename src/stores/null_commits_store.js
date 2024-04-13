import { CommitsStore } from './commits_store.js'

export class NullCommitsStore extends CommitsStore {
  async addCommit (commit) {
  }

  async getCommits () {
    return {}
  }

  async getCommitById (id) {
    return null
  }

  async saveCommits (commits) {
  }
}
