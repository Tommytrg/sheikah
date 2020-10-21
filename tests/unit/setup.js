// This setup file reuse code from:
// https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/tests/unit/setup.js

import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import '@/plugins/element'
import '@/fontAwesome'

const vueTestUtils = require('@vue/test-utils')

// Mock window properties not handled by jsdom
Object.defineProperty(window, 'localStorage', {
  value: (function() {
    let store = {}
    return {
      getItem: function(key) {
        return store[key] || null
      },
      setItem: function(key, value) {
        store[key] = value.toString()
      },
      clear: function() {
        store = {}
      },
    }
  })(),
})

// Make console.warn throw, so that Jest tests fail
const warn = console.error
console.error = function(message) {
  warn.apply(console, arguments)
  // NOTE: You can whitelist some `console.warn` messages here
  //       by returning if the `message` value is acceptable.
  throw message instanceof Error ? message : new Error(message)
}

// Global helpers
global.mount = vueTestUtils.mount

global.shallowMount = vueTestUtils.shallowMount

global.nextTick = Vue.nextTick

// A helper for creating Vue component mocks
global.createComponentMocks = ({ store, router, style, mocks, stubs }) => {
  // Use a local version of Vue, to avoid polluting the global
  // Vue and thereby affecting other tests.
  const localVue = vueTestUtils.createLocalVue()
  const returnOptions = { localVue }

  // https://vue-test-utils.vuejs.org/api/options.html#stubs
  returnOptions.stubs = stubs || {}
  // https://vue-test-utils.vuejs.org/api/options.html#mocks
  returnOptions.mocks = mocks || {}
  const mockedDirective = {
    inserted(el, binding) {
      el.getElementsByTagName('input')
        ? el.getElementsByTagName('input')[0].focus()
        : el.focus()
    },
    update(el, binding) {
      if (binding.arg === true) {
        if (el.getElementsByTagName('input')) {
          el.getElementsByTagName('input')[0].focus()
        } else {
          el.focus()
        }
      }
    },
  }
  localVue.directive('focus', mockedDirective)

  if (store) {
    localVue.use(Vuex)
    returnOptions.store = new Vuex.Store({
      modules: Object.keys(store)
        .map(moduleName => {
          const storeModule = store[moduleName]
          return {
            [moduleName]: {
              state: storeModule.state || {},
              getters: storeModule.getters || {},
              actions: storeModule.actions || {},
              mutations: storeModule.mutations || {},
              // namespaced by default is false
              namespaced:
                typeof storeModule.namespaced === 'undefined'
                  ? false
                  : storeModule.namespaced,
            },
          }
        })
        .reduce((moduleA, moduleB) => Object.assign({}, moduleA, moduleB), {}),
    })
  }

  // If using `router: true`, we'll automatically stub out
  // components from Vue Router.
  if (router) {
    localVue.use(Router)
    returnOptions.router = new Router({ routes: [] })

    if (typeof router === 'object') {
      Object.entries(router).forEach(entry => { returnOptions.router[entry[0]] = entry[1] })
    }
  }

  // If a `style` object is provided, mock some styles.
  if (style) {
    returnOptions.mocks.$style = style
  }

  return returnOptions
}
