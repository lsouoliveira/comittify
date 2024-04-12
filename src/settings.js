import { STORAGE_KEY } from './config.js'

export class Settings {
  static async read (key) {
    const settings = await this._loadSettings()
    return settings[key]
  }

  static async save (key, value) {
    const settings = await this._loadSettings()
    settings[key] = value
    await this._saveSettings(settings)
  }

  static async _loadSettings () {
    const item = await browser.storage.local.get(STORAGE_KEY) || {} // eslint-disable-line no-undef
    return item[STORAGE_KEY] || {}
  }

  static async _saveSettings (settings) {
    await browser.storage.local.set({ [STORAGE_KEY]: settings }) // eslint-disable-line no-undef
  }
}
