import { Regex } from './config'

export function parseCommitRow (item) {
  const container = item.querySelector("[data-testid='listview-item-title-container']")
  const link = container.querySelector('a')
  const id = link.href.toString().match(Regex.COMMIT_URL)[1]
  const badgesContainer = item.querySelector("[data-testid='listview-item-metadata']")

  return {
    id,
    badgesContainer
  }
}

export function extractCommitRows () {
  const items = document.querySelectorAll("[data-testid='commit-row-item']")

  return Array.from(items).map((item) => {
    try {
      return parseCommitRow(item)
    } catch (error) {
      console.error('Error parsing item', error)

      return null
    }
  }).filter((item) => item)
}
