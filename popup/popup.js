const form = document.querySelector('#form')
const masterKeyInput = document.querySelector('#master-key')
const binIdInput = document.querySelector('#bin-id')
const syncCheckbox = document.querySelector('#sync')

const loadSettings = async () => {
  const item = await browser.storage.local.get('committify') || {} // eslint-disable-line no-undef
  return item.committify || {}
}

// Settings
const loadFormData = async () => {
  const { masterKey, binId, sync } = await loadSettings()

  masterKeyInput.value = masterKey || ''
  binIdInput.value = binId || ''
  syncCheckbox.checked = sync || false
}

const saveFormData = async ({ masterKey, binId, sync }) => {
  const settings = await loadSettings()
  const payload = { committify: { ...settings, masterKey, binId, sync } }
  await browser.storage.local.set(payload) // eslint-disable-line no-undef
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const masterKey = masterKeyInput.value
  const binId = binIdInput.value
  const sync = syncCheckbox.checked || false

  await saveFormData({ masterKey, binId, sync })
})

// Sync
const lastSyncedMessage = document.querySelector('#last-synced-message')
const syncButton = document.querySelector('#sync-button')

const parseDate = (date) => {
  try {
    return new Date(date)
  } catch (_) {
    return null
  }
}

const loadLastSynced = async () => {
  const { lastSync } = await loadSettings()

  if (!lastSync) {
    return null
  }

  return parseDate(lastSync)
}

const buildLastSyncedMessage = (date) => {
  if (!date) {
    return 'never'
  }

  return date.toLocaleString()
}

const updateLastSyncedMessage = async () => {
  const lastSync = await loadLastSynced()

  lastSyncedMessage.textContent = buildLastSyncedMessage(lastSync)
}

let isSyncing = false

// Main
async function main () {
  await loadFormData()
  await updateLastSyncedMessage()

  syncButton.addEventListener('click', async () => {
    if (isSyncing) {
      return
    }

    isSyncing = true

    // eslint-disable-next-line no-undef
    await browser.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      try {
        // eslint-disable-next-line no-undef
        await browser.tabs.sendMessage(tabs[0].id, { action: 'sync' })
        updateLastSyncedMessage()
      } catch (_) {
        console.error('Error syncing')
      }
    })

    isSyncing = false
  })
}

main()
