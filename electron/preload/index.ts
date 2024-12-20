import { ipcRenderer, contextBridge } from 'electron'
import { IPC_ACTIONS } from '../ipc/ipcActions'
const {
  SET_MESSAGE,
  SHUTDOWN,
  SET_RUNNING_STATUS,
  SET_DOWNLOADED_STATUS,
  SET_DOWNLOADING_STATUS,
  SET_DOWNLOAD_PROGRESS,
  SET_LOADED_STATUS,
  SET_OS_NOT_SUPPORTED,
  SHUTDOWN_FINISHED,
  CLEAR_WALLET_FILES,
} = IPC_ACTIONS.Window

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof value === 'function') {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args)
      }
    } else {
      obj[key] = value
    }
  }
  return obj
}

// --------- Preload scripts loading ---------
function domReady(
  condition: DocumentReadyState[] = ['complete', 'interactive'],
) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child)
    }
  },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const styleContent = `
.icon {
  width: 100px;
  animation: sk-bouncedelay 5s infinite ease-in-out both;
  display: inline-block;
}

.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2d2c3a;
  z-index: 9;
}

.icon {
  animation: sk-bouncedelay 5s infinite ease-in-out both;
  border-radius: 100%;
  display: inline-block;
  height: 100px;
  margin-right: 1px;
  width: 100px;
}

@keyframes sk-bouncedelay {
  0% {
    transform: scale(1);
  }

  40% {
    transform: scale(1.5);
  }

  80% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.5);
  }
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div>
    <svg
      width="398"
      height="398"
      viewBox="0 0 398 398"
      class="icon-size icon"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M199 0.000362315C172.867 0.00044214 146.99 5.15598 122.846 15.1728C98.7018 25.1896 76.7642 39.8714 58.2854 58.3799C39.8065 76.8885 25.1483 98.8614 15.1477 123.044C5.14704 147.226 -0.000131168 173.145 2.507e-09 199.32C0.0448962 249.506 18.9894 297.827 53.0501 334.634C87.1107 371.441 133.78 394.024 183.738 397.873V322.639C133.716 315.201 95.0908 271.801 95.0908 219.694C95.0907 196.407 102.806 174.857 115.805 157.48C108.352 160.988 99.8616 162.022 92.6289 158.47C77.958 151.265 73.7633 118.192 74.709 95.2058C76.1434 95.1468 77.6172 95.1045 79.1214 95.0918C101.685 94.8259 131.128 99.3798 137.874 113.155C141.42 120.4 140.386 128.904 136.882 136.37C150.416 126.213 166.486 119.284 183.936 116.724C176.255 113.911 169.595 108.651 167.007 101.069C161.719 85.5826 182.104 59.2267 199 43.643C215.897 59.2267 236.278 85.5826 230.993 101.069C228.404 108.652 221.744 113.911 214.062 116.724C231.512 119.283 247.581 126.213 261.115 136.368C257.613 128.902 256.581 120.399 260.127 113.155C266.872 99.3788 296.315 94.8267 318.878 95.0918C320.382 95.1081 321.857 95.1489 323.291 95.2058C324.237 118.192 320.043 151.265 305.373 158.472C298.14 162.023 289.649 160.988 282.195 157.48C295.193 174.857 302.909 196.406 302.909 219.694C302.909 271.814 264.263 315.223 214.222 322.643V398C264.209 394.159 310.906 371.562 344.978 334.727C379.05 297.892 397.986 249.534 398 199.32C398 173.145 392.853 147.226 382.852 123.044C372.852 98.861 358.194 76.8882 339.715 58.3797C321.236 39.8711 299.298 25.1893 275.154 15.1725C251.01 5.15574 225.133 8.06571e-05 199 0V0.000362315Z"
        fill="#fff"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M125.608 219.699C125.608 178.918 158.286 146.189 199.002 146.189C239.717 146.189 272.395 178.918 272.395 219.699C272.395 260.479 239.717 293.209 199.002 293.209C158.286 293.209 125.608 260.479 125.608 219.699ZM208.335 175.06L243.575 210.356C248.728 215.517 248.728 223.886 243.575 229.047L208.335 264.343C203.182 269.505 194.827 269.505 189.674 264.344L154.434 229.047C149.281 223.886 149.281 215.517 154.434 210.356L189.674 175.06C194.827 169.898 203.182 169.898 208.335 175.06Z"
        fill="#fff"
      />
    </svg>
  </div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)

contextBridge.exposeInMainWorld('ipcAPI', {
  onShutdown: (fn: any) => {
    ipcRenderer.on(SHUTDOWN, (event, ...args) => fn(...args))
  },
  onMessage: (fn: any) => {
    ipcRenderer.on(SET_MESSAGE, (event, ...args) => fn(...args))
  },
  onRunningStatus: (fn: any) => {
    ipcRenderer.on(SET_RUNNING_STATUS, (event, ...args) => fn(...args))
  },
  onDownloadedStatus: (fn: any) => {
    ipcRenderer.on(SET_DOWNLOADED_STATUS, (event, ...args) => fn(...args))
  },
  onDownloadingStatus: (fn: any) => {
    ipcRenderer.on(SET_DOWNLOADING_STATUS, (event, ...args) => fn(...args))
  },
  onLoadedStatus: (fn: any) => {
    ipcRenderer.on(SET_LOADED_STATUS, (event, ...args) => fn(...args))
  },
  onDownloadProgress: (fn: any) => {
    ipcRenderer.on(SET_DOWNLOAD_PROGRESS, (event, ...args) => fn(...args))
  },
  onOSNotSupported: (fn: any) => {
    ipcRenderer.on(SET_OS_NOT_SUPPORTED, (event, ...args) => fn(...args))
  },
  sendShutdownFinished: () => {
    ipcRenderer.send(SHUTDOWN_FINISHED)
  },
  sendClearWalletFiles: () => {
    ipcRenderer.send(CLEAR_WALLET_FILES)
  },
})
