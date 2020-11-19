import { WALLET_EVENTS } from '@/constants'

export default class NetworkStatus {
  constructor() {
    this.currentState = null
    this.isResyncButtonVisible = false
    this.isLoadingVisible = false
    this.isNodeSynced = true
    this.isNodeDisconnected = false
    this.isWalletSynced = false
    this.syncError = false
    this.progress = 0
    this.timestamp = 0
  }

  currentStatus() {
    if (this.isNodeDisconnected) {
      this.currentState = {
        label: 'NODE DISCONNECTED',
        color: 'red',
      }
      this.isLoadingVisible = false
      this.isResyncButtonVisible = false
    } else if (this.syncError) {
      this.currentState = {
        label: 'SYNC ERROR',
        color: 'red',
      }
      this.isLoadingVisible = false
      if (this.isNodeSynced) {
        this.isResyncButtonVisible = true
      } else {
        this.isResyncButtonVisible = false
      }
    } else if (this.isWalletSynced && this.isNodeSynced) {
      this.currentState = {
        label: 'SYNCED',
        color: 'green',
      }
      this.isResyncButtonVisible = true
      this.isLoadingVisible = false
    } else if (this.isNodeSynced && !this.isWalletSynced) {
      this.currentState = {
        label: `SYNCING ${this.progress.toFixed(2)} %`,
        color: 'yellow',
      }
      this.isLoadingVisible = true
      this.isResyncButtonVisible = false
    } else if (!this.isNodeSynced) {
      this.currentState = {
        label: 'WAITING FOR NODE TO SYNC',
        color: 'yellow',
      }
      this.isLoadingVisible = true
      this.isResyncButtonVisible = false
    }
  }

  processEvent(eventType, event) {
    if (eventType === WALLET_EVENTS.BLOCK) {
      this.timestamp = Date.now()
    }
    if (eventType === WALLET_EVENTS.SYNC_FINISH) {
      this.syncError = false
      this.isWalletSynced = true
      this.isNodeDisconnected = false
      this.isNodeSynced = true
    } else if (eventType === WALLET_EVENTS.SYNC_PROGRESS) {
      this.syncError = false
      this.isWalletSynced = false
      this.isNodeSynced = true
      this.isNodeDisconnected = false
      // eslint-disable-next-line
      const [_start, current, finish] = event
      this.progress = (current / finish) * 100 || 0
    } else if (eventType === WALLET_EVENTS.SYNC_START) {
      this.syncError = false
      this.isWalletSynced = false
      this.isNodeDisconnected = false
      this.isNodeSynced = true
      this.progress = 0
    }
    if (eventType === WALLET_EVENTS.NODE_STATUS_CHANGED) {
      if (event === 'Synced') {
        this.syncError = false
        this.isNodeDisconnected = false
        this.isNodeSynced = true
        this.isWalletSynced = false
      } else {
        this.syncError = false
        this.isNodeSynced = false
        this.isWalletSynced = false
        this.isNodeDisconnected = false
      }
    } else if (eventType === WALLET_EVENTS.NODE_SYNC_ERROR) {
      this.syncError = true
      this.isWalletSynced = false
    } else if (eventType === WALLET_EVENTS.NODE_DISCONNECTED) {
      this.isNodeDisconnected = true
      this.isNodeSynced = false
      this.isWalletSynced = false
    }
    this.currentStatus()
  }
}
