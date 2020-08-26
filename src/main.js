import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { ipcRenderer } from 'electron'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './fontAwesome'
import '@/directives'

ipcRenderer.on('shutdown', async () => {
  store.dispatch('shutdown')
  ipcRenderer.send('shutdown-finished')
})
ipcRenderer.on('running', async () => {
  store.commit('setMessage', { message: 'Running wallet' })
})
ipcRenderer.on('downloading', async () => {
  store.commit('setMessage', { message: 'Downloading wallet' })
})
ipcRenderer.on('loaded', async () => {
  store.commit('setMessage', { message: 'loaded' })
})
ipcRenderer.on('load-url', async (event, message) => {
  store.commit('setMessage', { message: message })
})
ipcRenderer.on('else', async () => {
  store.commit('setMessage', { message: 'else' })
})
ipcRenderer.on('mal', async () => {
  store.commit('setMessage', { message: 'MAAAAAAALLLLLLL' })
})
Vue.component(VueQrcode.name, VueQrcode)
Vue.config.productionTip = false

runApp()
function runApp() {
  const vm = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app')

  window.vm = vm
}
