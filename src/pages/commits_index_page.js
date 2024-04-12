import { Page } from './page'
import { extractCommitRows } from '../parser'
import { renderCommitReadBadge } from '../utils'

export class CommitsIndexPage extends Page {
  async load () {
    const commitRows = extractCommitRows()

    await this._inflate(commitRows)
  }

  async _inflate (commitRows) {
    const commits = await this.commitsStore.getCommits()

    commitRows.forEach((commit) => {
      const commitData = commits[commit.id]

      if (commitData) {
        const { read } = commitData

        if (read) {
          commit.badgesContainer.innerHTML += renderCommitReadBadge()
        }
      }
    })
  }
}
