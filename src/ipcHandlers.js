import { ipcRenderer } from 'electron'

import store from '@/store'

ipcRenderer.on('shutdown', async () => {
  store.dispatch('shutdown')
  ipcRenderer.send('shutdown-finished')
})
