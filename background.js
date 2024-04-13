function notifyChange (changeInfo) {
  // eslint-disable-next-line no-undef
  browser.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    // eslint-disable-next-line no-undef
    await browser.tabs.sendMessage(tabs[0].id, { action: 'page_change', data: { changeInfo } })
  })
}

// eslint-disable-next-line no-undef
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    notifyChange(changeInfo)
  }
})
