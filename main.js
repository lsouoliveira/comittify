(() => {
  class CommitsStore {
    addCommit (commit) {
      const commits = this.getCommits()
      commits[commit.id] = commit

      localStorage.setItem('commits', JSON.stringify(commits))
    }

    getCommits () {
      const commits = localStorage.getItem('commits')

      return commits ? JSON.parse(commits) : {}
    }

    getCommitById (id) {
      return this.getCommits()[id]
    }
  }

  const Regex = {
    COMMITS_INDEX_URL: /.*\.?github\.com\/.*\/commits\/.*\/?/,
    COMMIT_URL: /.*\.?github\.com\/.*\/commit\/(.*)\/?/
  }

  const commitsStore = new CommitsStore()

  function matchURL (url, regex) {
    return url.match(regex)
  }

  function parseItem (item) {
    const container = item.querySelector("[data-testid='listview-item-title-container']")
    const link = container.querySelector('a')
    const id = link.href.toString().match(Regex.COMMIT_URL)[1]
    const badgesContainer = item.querySelector("[data-testid='listview-item-metadata-item']")

    return {
      id,
      badgesContainer
    }
  }

  function getCommits () {
    const items = document.querySelectorAll("[data-testid='commit-row-item']")

    return Array.from(items).map((item) => {
      try {
        return parseItem(item)
      } catch (error) {
        console.error('Error parsing item', error)

        return null
      }
    }).filter((item) => item)
  }

  function renderCommitReadBadge () {
    return '<span style="padding: 0 7px 0 7px; border: 1px solid rgb(9, 105, 218); border-radius: 999px; color: rgb(9, 105, 218); font-weight: 600;">Read</span>'
  }

  function createDefaultButton () {
    const button = document.createElement('button')
    button.setAttribute('class', 'btn')

    return button
  }

  function updateCommitsView (commits) {
    commits.forEach((commit) => {
      const commitData = commitsStore.getCommitById(commit.id)

      if (commitData) {
        const { read } = commitData

        if (read) {
          commit.badgesContainer.innerHTML += renderCommitReadBadge()
        }
      }
    })
  }

  function loadCommitsIndex () {
    updateCommitsView(getCommits())
  }

  function loadCommitPage () {
    const commitId = window.location.toString().match(Regex.COMMIT_URL)[1]
    const browserButton = document.querySelector('#browse-at-time-link')
    const browserButtonParent = browserButton.parentElement
    const readButton = createDefaultButton()
    const container = document.createElement('div')
    const commitData = commitsStore.getCommitById(commitId)

    container.setAttribute('class', 'd-flex flex-self-start gap-2')

    if (commitData && commitData.read) {
      readButton.innerHTML = 'Unread'
    } else {
      readButton.innerHTML = 'Read'
    }

    readButton.addEventListener('click', () => {
      let commitData = commitsStore.getCommitById(commitId)

      if (commitData) {
        commitData.read = !commitData.read
      } else {
        commitData = {
          id: commitId,
          read: true
        }
      }

      commitsStore.addCommit(commitData)

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

  function load () {
    const currentURL = window.location.toString()

    if (matchURL(currentURL, Regex.COMMITS_INDEX_URL)) {
      loadCommitsIndex()
    } else if (matchURL(currentURL, Regex.COMMIT_URL)) {
      loadCommitPage()
    }
  }

  load()
})()
