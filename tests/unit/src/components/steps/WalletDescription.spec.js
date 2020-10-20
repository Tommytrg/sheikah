import WalletDescription from '@/components/steps/WalletDescription'
import Input from 'element-ui/lib/input'

describe('WalletDescription.vue', () => {
  describe('title input', () => {
    it('should render title input', () => {
      const wrapper = mount(WalletDescription, {
        propsData: {
          selected: false,
          used: false,
        },
        ...createComponentMocks({
          store: {
            wallet: {
              state: {
                title: '',
                description: '',
              },
            },
          },
        }),
      })

      expect(
        wrapper
          .findAllComponents(Input)
          .at(0)
          .exists(),
      ).toBe(true)
    })

    it('should be text type', () => {
      const wrapper = mount(WalletDescription, {
        propsData: {
          selected: false,
          used: false,
        },
        ...createComponentMocks({
          store: {
            wallet: {
              state: {
                title: '',
                description: '',
              },
            },
          },
        }),
      })

      expect(
        wrapper
          .findAllComponents(Input)
          .at(0)
          .props().type,
      ).toBe('text')
    })

    it('should contain store value', () => {
      const wrapper = mount(WalletDescription, {
        propsData: {
          selected: false,
          used: false,
        },
        ...createComponentMocks({
          store: {
            wallet: {
              state: {
                title: 'random text',
                description: '',
              },
            },
          },
        }),
      })

      expect(
        wrapper
          .findAllComponents(Input)
          .at(0)
          .props().value,
      ).toBe('random text')
    })
    // console.log('AAA', a.props().type)

    it('should call store update', async () => {
      const setWalletDescription = jest.fn()
      const wrapper = mount(WalletDescription, {
        ...createComponentMocks({
          store: {
            wallet: {
              state: {
                title: '',
                description: '',
              },
              mutations: {
                setWalletDescription,
              },
            },
          },
        }),
      })

      const inputWrapper = wrapper.find('input')

      inputWrapper.element.value = 'asdf'
      inputWrapper.trigger('input')
      await nextTick()

      expect(setWalletDescription.mock.calls[0][1].title).toBe('asdf')
      expect(setWalletDescription.mock.calls).toHaveLength(1)
    })
  })

  describe('description input', () => {
    it('should render description input', () => {
      const wrapper = mount(WalletDescription, {
        propsData: {
          selected: false,
          used: false,
        },
        ...createComponentMocks({
          store: {
            wallet: {
              state: {
                title: '',
                description: '',
              },
            },
          },
        }),
      })

      expect(
        wrapper
          .findAllComponents(Input)
          .at(1)
          .exists(),
      ).toBe(true)
    })

    it('should be text type', () => {
      const wrapper = mount(WalletDescription, {
        propsData: {
          selected: false,
          used: false,
        },
        ...createComponentMocks({
          store: {
            wallet: {
              state: {
                title: '',
                description: '',
              },
            },
          },
        }),
      })

      expect(
        wrapper
          .findAllComponents(Input)
          .at(1)
          .props().type,
      ).toBe('textarea')
    })

    it('should contain store value', () => {
      const wrapper = mount(WalletDescription, {
        ...createComponentMocks({
          store: {
            wallet: {
              state: {
                title: '',
                description: 'random description',
              },
            },
          },
        }),
      })

      expect(
        wrapper
          .findAllComponents(Input)
          .at(1)
          .props().value,
      ).toBe('random description')
    })

    it('should call store update', async () => {
      const setWalletDescription = jest.fn()
      const wrapper = mount(WalletDescription, {
        ...createComponentMocks({
          store: {
            wallet: {
              state: {
                title: '',
                description: '',
              },
              mutations: {
                setWalletDescription,
              },
            },
          },
        }),
      })

      const textareaWrapper = wrapper.find('textarea')

      textareaWrapper.element.value = 'new description'
      textareaWrapper.trigger('input')
      await nextTick()

      expect(setWalletDescription.mock.calls[0][1].description).toBe(
        'new description',
      )
      expect(setWalletDescription.mock.calls).toHaveLength(1)
    })
  })

  describe('redirect correctly', () => {
    it('should go to seed validation route on click previous step', async () => {
      const router = {
        push: jest.fn(),
      }
      const wrapper = mount(WalletDescription, {
        ...createComponentMocks({
          store: {
            wallet: {
              state: {
                title: '',
                description: '',
              },
            },
          },
          router: router,
        }),
      })

      await wrapper.find('[data-test="previous-step"]').trigger('click')

      expect(router.push.mock.calls[0][0]).toBe("/ftu/seed-validation")
    })

    it('should go to encrypt password route on click next step', async () => {
        const router = {
          push: jest.fn(),
        }

        const wrapper = mount(WalletDescription, {
          ...createComponentMocks({
            store: {
              wallet: {
                state: {
                  title: '',
                  description: '',
                },
              },
            },
            router: router,
          }),
        })

        await wrapper.find('[data-test="next-step"]').trigger('click')

        expect(router.push.mock.calls[0][0]).toBe("/ftu/encryption-pass")
    })
})
})
