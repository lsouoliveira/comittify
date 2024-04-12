import { Settings } from './settings'
import { SYNC_INTERVAL } from './config'

export class Syncer {
  constructor ({ localStore, remoteStore }) {
    this.localStore = localStore
    this.remoteStore = remoteStore
  }

  async sync () {
    const remoteCommits = await this.remoteStore.getCommits()
    const localCommits = await this.localStore.getCommits()
    const mergedCommits = this._mergeCommits(remoteCommits, localCommits)

    await this.remoteStore.saveCommits(mergedCommits)
    await this.localStore.saveCommits(mergedCommits)
    await Settings.save('lastSync', (new Date()).toISOString())
  }

  async canSync () {
    const syncEnabled = await Settings.read('sync')
    const lastSync = await Settings.read('lastSync')

    if (!syncEnabled) {
      return false
    }

    if (!lastSync) {
      return true
    }

    const now = Date.now()
    const diff = now - Date.parse(lastSync)

    return diff >= SYNC_INTERVAL
  }

  _mergeCommits (remoteCommits, localCommits) {
    const commitsToKeep = Object.keys(remoteCommits).reduce((acc, id) => {
      if (localCommits[id]) {
        const remoteUpdatedAt = Date.parse(remoteCommits[id].updatedAt)
        const localUpdatedAt = Date.parse(localCommits[id].updatedAt)

        if (remoteUpdatedAt > localUpdatedAt) {
          acc[id] = remoteCommits[id]
        } else {
          acc[id] = localCommits[id]
        }
      }

      return acc
    }, {})

    return { ...remoteCommits, ...localCommits, ...commitsToKeep }
  }
}
