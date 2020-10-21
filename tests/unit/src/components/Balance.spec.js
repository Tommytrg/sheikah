import Balance from '@/components/Balance'
import BalanceData from '@/components/BalanceData'
import BalanceButtons from '@/components/BalanceButtons'
import Send from '@/components/Send'

describe('Balance.vue', () => {
  it('render BalanceData component', () => {
    const wrapper = shallowMount(
      Balance,
      createComponentMocks({
        store: {
          wallet: {
            state: {
              balance: {
                available: '1',
                locked: '10',
                total: '100',
              },
              currency: 'nanoWits',
            },
          },
        },
      }),
    )

    expect(wrapper.findComponent(BalanceData).exists()).toBe(true)
  })

  describe('should render send modal on click', () => {
    it('is not visible by default', () => {
      const wrapper = shallowMount(
        Balance,
        createComponentMocks({
          store: {
            wallet: {
              state: {
                balance: {
                  available: '1',
                  locked: '10',
                  total: '100',
                },
                currency: 'nanoWits',
              },
            },
          },
        }),
      )

      expect(wrapper.findComponent(Send).exists()).toBe(false)
    })

    it.skip('should be visible when property isSendVisible is true', () => {
      const wrapper = shallowMount(
        Balance,
        createComponentMocks({
          store: {
            wallet: {
              state: {
                balance: {
                  available: '1',
                  locked: '10',
                  total: '100',
                },
                currency: 'nanoWits',
              },
            },
          },
        }),
      )
      wrapper.setData({
        isSendVisible: true,
      })

      expect(wrapper.findComponent(Send).exists()).toBe(true)
    })

    it.skip('BalanceButtons event send should show the modal', () => {
      // TODO: emit event from balanceData component
      const wrapper = mount(
        Balance,
        createComponentMocks({
          stubs: {
            Send: true,
          },
          store: {
            wallet: {
              state: {
                balance: {
                  available: '1',
                  locked: '10',
                  total: '100',
                },
                currency: 'nanoWits',
              },
            },
          },
        }),
      )

      wrapper.findComponent(BalanceButtons).vm.$emit('send')

      expect(wrapper.findComponent(Send).isVisible()).toBe(true)
    })

    it('BalanceButtons event receive should do something TBD', () => {
      // TODO: handle event when addresses implemented
    })
  })
})
