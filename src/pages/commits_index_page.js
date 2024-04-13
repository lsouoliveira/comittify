import { Page } from './page'
import { extractCommitRows } from '../parser'
import { renderCommitReadBadge } from '../utils'

export class CommitsIndexPage extends Page {
  async load () {
    if (this.__loaded()) {
      return
    }

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
          const badge = document.createElement('div')
          badge.style.display = 'flex'
          badge.style.alignItems = 'center'
          badge.classList.add('committify__read-badge')
          badge.innerHTML = renderCommitReadBadge()

          commit.badgesContainer.insertBefore(badge, commit.badgesContainer.firstChild)
        }
      }
    })
  }

  __loaded () {
    return document.querySelector('.committify__read-badge') !== null
  }
}
