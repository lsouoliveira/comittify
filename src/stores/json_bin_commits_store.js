import { CommitsStore } from './commits_store.js'

export class JSONBinCommitsStore extends CommitsStore {
  BASE_URL = 'https://api.jsonbin.io/v3/b'

  constructor ({ masterKey, binId }) {
    super()
    this.masterKey = masterKey
    this.binId = binId

    if (!this.masterKey || !this.binId) {
      throw new Error('Master key and bin ID are required.')
    }
  }

  async addCommit (commit) {
    const commits = await this.getCommits()
    commits[commit.id] = commit

    const payload = {
      commits
    }

    await fetch(`${this.BASE_URL}/${this.binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': this.masterKey
      },
      body: JSON.stringify(payload)
    })
  }

  async getCommits () {
    const response = await fetch(`${this.BASE_URL}/${this.binId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': this.masterKey
      }
    })

    if (!response.ok) {
      throw new Error('API request error.')
    }

    const data = await response.json()

    return data.record.commits || {}
  }

  async getCommitById (id) {
    const commits = await this.getCommits()
    return commits[id]
  }

  async saveCommits (commits) {
    const payload = {
      commits
    }

    await fetch(`${this.BASE_URL}/${this.binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': this.masterKey
      },
      body: JSON.stringify(payload)
    })
  }
}
