import { Page } from './page'
import { Regex } from '../config'
import { createDefaultButton } from '../utils'

export class CommitsShowPage extends Page {
  async load () {
    if (this._loaded()) {
      return
    }

    await this._inflate()
  }

  async _inflate () {
    const commitId = window.location.toString().match(Regex.COMMIT_URL)[1]
    const browserButton = document.querySelector('#browse-at-time-link')
    const browserButtonParent = browserButton.parentElement
    const readButton = createDefaultButton()
    const container = document.createElement('div')
    const commitData = await this.commitsStore.getCommitById(commitId)

    readButton.id = 'committify__read-button'
    container.setAttribute('class', 'd-flex flex-self-start gap-2')

    if (commitData && commitData.read) {
      readButton.innerHTML = 'Unread'
    } else {
      readButton.innerHTML = 'Read'
    }

    readButton.addEventListener('click', async () => {
      let commitData = await this.commitsStore.getCommitById(commitId)

      if (commitData) {
        commitData.read = !commitData.read
        commitData.updated_at = new Date().toISOString()
      } else {
        commitData = {
          id: commitId,
          read: true,
          updated_at: new Date().toISOString()
        }
      }

      await this.commitsStore.addCommit(commitData)

      if (commitData.read) {
        readButton.innerHTML = 'Unread'
      } else {
        readButton.innerHTML = 'Read'
      }
    })

    browserButtonParent.appendChild(container)
    container.appendChild(readButton)
    container.appendChild(browserButton)
  }

  _loaded () {
    return document.querySelector('#committify__read-button') !== null
  }
}
