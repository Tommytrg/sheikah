import { Router } from 'vue-router'
import { api } from '../main'
import { Store } from 'vuex'

export async function checkDisconnection(router: Router, store: Store<any>) {
  const foo = async () => {
    const currentRoute = router.currentRoute.value
    const isWalletNotFound = currentRoute.name === 'runWalletAlert'
    if (isWalletNotFound) {
      if (api.client.ws.ready) {
        const isSessionId = store.state.wallet.sessionId
        const walletInfos = store.state.wallet.walletInfos
        if (isSessionId) {
          router.back()
        } else if (walletInfos && walletInfos.length > 0) {
          router.push('/welcome-back/wallet-list')
        } else {
          router.push('/ftu/welcome')
        }

        // when the computer is blocked the client closes but it should not redirect to
        // wallet not found if the wallet is not closed
        api.client.ws.on('close', () => {
          setTimeout(() => {
            if (!api.client.ws.ready) {
              if (!isWalletNotFound) {
                router.push('/wallet-not-found')
              }
            }
          }, 1000)
        })
      } else {
        api.client.ws.on('open', async () => {
          console.log(1)
          const polling = setInterval(async () => {
            clearInterval(polling)
            await store.dispatch('getWalletInfos')
            const walletInfos = store.state.wallet.walletInfos
            const isSessionId = store.state.wallet.sessionId
            if (isSessionId) {
              router.back()
            } else if (walletInfos && walletInfos.length > 0) {
              router.push('/welcome-back/wallet-list')
            } else {
              router.push('/ftu/welcome')
            }
          }, 2000)
          console.log(2)
        })
        router.push('/wallet-not-found')
      }
    }

    if (!isWalletNotFound) {
      if (api.client.ws.ready) {
        const isSessionId = store.state.wallet.sessionId
        const walletInfos = store.state.wallet.walletInfos
        if (isSessionId) {
          router.back()
        } else if (walletInfos && walletInfos.length > 0) {
          router.push('/welcome-back/wallet-list')
        } else {
          router.push('/ftu/welcome')
        }

        // when the computer is blocked the client closes but it should not redirect to
        // wallet not found if the wallet is not closed
        api.client.ws.on('close', () => {
          setTimeout(() => {
            if (!api.client.ws.ready) {
              if (!isWalletNotFound) {
                router.push('/wallet-not-found')
              }
            }
          }, 1000)
        })
      } else {
        api.client.ws.on('open', async () => {
          const polling = setInterval(async () => {
            clearInterval(polling)
            await store.dispatch('getWalletInfos')
            const walletInfos = store.state.wallet.walletInfos
            const isSessionId = store.state.wallet.sessionId
            if (isSessionId) {
              router.back()
            } else if (walletInfos && walletInfos.length > 0) {
              router.push('/welcome-back/wallet-list')
            } else {
              router.push('/ftu/welcome')
            }
          }, 2000)
        })
        router.push('/wallet-not-found')
      }
    }
  }

  foo()
}
