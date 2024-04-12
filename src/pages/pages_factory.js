import { matchURL } from './../utils.js'

export class PagesFactory {
  constructor () {
    this.pages = []
  }

  register (urlPattern, pageClass) {
    this.pages.push({ urlPattern, pageClass })
  }

  create (url) {
    const page = this.pages.find(({ urlPattern }) => matchURL(url, urlPattern))

    if (!page) {
      throw new Error('Page not found')
    }

    return new page.pageClass() // eslint-disable-line new-cap
  }
}
