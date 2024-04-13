import { CommitsIndexPage } from './pages/commits_index_page.js'
import { CommitsShowPage } from './pages/commits_show_page.js'
import { PagesFactory } from './pages/pages_factory.js'
import { Regex } from './config.js'
import { Settings } from './settings.js'
import { JSONBinCommitsStore, LocalStorageCommitsStore, NullCommitsStore } from './stores'
import { Syncer } from './syncer.js'

export class Application {
  async setup () {
    await this._setupStores()
    this._setupPageFactory()
    this._setupSyncer()
    this._setupProcessQueue()
    this._setupPageObserver()
    this._setupPageChangeHandler()
    this._setupNotificationHandler()
  }

  async start () {
    await this.setup()
  }

  async route (url) {
    try {
      const page = this.pageFactory.create(url)
      page.init({ commitsStore: this.localCommitsStore })
      await page.load()
    } catch (_) {}
  }

  async _setupStores () {
    this.localCommitsStore = new LocalStorageCommitsStore()
  }

  _setupPageFactory () {
    this.pageFactory = new PagesFactory()
    this.pageFactory.register(Regex.COMMITS_INDEX_URL, CommitsIndexPage)
    this.pageFactory.register(Regex.COMMIT_URL, CommitsShowPage)
  }

  async _setupSyncer () {
    this.syncer = new Syncer(
      {
        remoteStore: await this._createRemoteStore(),
        localStore: this.localCommitsStore
      }
    )

    if (await this.syncer.canSync()) {
      this.syncer.sync()
    }
  }

  _setupProcessQueue () {
    this.queue = []

    window.requestAnimationFrame(() => this._processQueue())
  }

  _enqueue (url) {
    if (this.queue.length === 0 || this.queue[0] !== url) {
      this.queue.push(url)
    }
  }

  async _processQueue () {
    if (this.queue.length > 0) {
      const url = this.queue.shift()
      await this.route(url)
    }

    window.requestAnimationFrame(() => this._processQueue())
  }

  _setupPageChangeHandler () {
    // eslint-disable-next-line no-undef
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'page_change') {
        const url = request.data.changeInfo.url || window.location.toString()
        this._enqueue(url)
      }
    })
  }

  _setupPageObserver () {
    this.queue = []

    const observer = new MutationObserver((mutations) => {
      this._enqueue(window.location.toString())
    })

    observer.observe(document, { childList: true, subtree: true })
  }

  _setupNotificationHandler () {
    // eslint-disable-next-line no-undef
    browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
      if (request.action === 'sync') {
        await this.syncer.sync()
      }

      sendResponse({ response: {} })
    })
  }

  async _createRemoteStore () {
    try {
      return new JSONBinCommitsStore({
        masterKey: await Settings.read('masterKey'),
        binId: await Settings.read('binId')
      })
    } catch (error) {
      console.error(error)
      return new NullCommitsStore()
    }
  }
}
