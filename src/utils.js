export function matchURL (url, regex) {
  return url.match(regex)
}

export function renderCommitReadBadge () {
  return '<span style="padding: 0 7px 0 7px; border: 1px solid rgb(9, 105, 218); border-radius: 999px; color: rgb(9, 105, 218); font-weight: 600;">Read</span>'
}

export function createDefaultButton () {
  const button = document.createElement('button')
  button.setAttribute('class', 'btn')

  return button
}
