import { CommitsStore } from './commits_store.js'

export class LocalStorageCommitsStore extends CommitsStore {
  async addCommit (commit) {
    const commits = await this.getCommits()
    commits[commit.id] = commit

    localStorage.setItem('comittify::commits', JSON.stringify(commits))
  }

  async getCommits () {
    const data = localStorage.getItem('comittify::commits')

    return data ? JSON.parse(data) : {}
  }

  async getCommitById (id) {
    const commits = await this.getCommits()
    return commits[id]
  }

  async saveCommits (commits) {
    localStorage.setItem('comittify::commits', JSON.stringify(commits))
  }
}
