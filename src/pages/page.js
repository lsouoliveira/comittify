export class Page {
  async load () {
    throw new Error('Not implemented')
  }

  init ({ commitsStore }) {
    this._commitsStore = commitsStore
  }

  get commitsStore () {
    return this._commitsStore
  }
}
