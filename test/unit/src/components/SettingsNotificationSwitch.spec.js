import SettingsNotificationSwitch from '@/components/SettingsNotificationSwitch.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { createMocks } from '../../utils'
import { ElSwitch } from 'element-plus'

describe('SettingsNotificationSwitch.vue', () => {
  describe('change unit', () => {
    const toggleNotificationMock = vi.fn()
    const getNotificationsMock = vi.fn()
    const mockStore = createMocks({
      storeModules: {
        wallet: {
          state: {
            notifications: {
              block: false,
            },
          },
          mutations: {
            toggleNotification: toggleNotificationMock,
          },
          actions: {
            getNotifications: getNotificationsMock,
          },
        },
      },
      stubs: {
        'el-switch': ElSwitch,
      },
    })
    test('should call the mutation to change the unit', async () => {
      const wrapper = mount(SettingsNotificationSwitch, {
        props: {
          title: 'block',
        },
        ...mockStore,
        router: true,
      })
      const switchButton = wrapper.find('.el-switch')
      await switchButton.trigger('click')
      expect(toggleNotificationMock).toHaveBeenCalled()
    })
  })
})