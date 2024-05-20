import ExportXprv from '@/components/ExportXprv.vue'
import Card from '@/components/card/Card.vue'
import PasswordValidation from '@/components/PasswordValidation.vue'

import { describe, expect, test, vi } from 'vitest'

import { ElButton, ElInput, ElSwitch } from 'element-plus'

describe('ExportXprv', () => {
  const exportMasterKeyMock = vi.fn()
  const clearErrorMock = vi.fn()
  const validatePasswordMock = vi.fn()
  const mockStore = createMockStore({
    wallet: {
      state: {
        unit: 'nanoWit',
        xprv: 'x',
        validatedPassword: 'validatedPassword',
        errors: {
          createValidPassword: {
            message: 'createValidPassword',
          },
        },
      },
    },
    stubs: {
      'el-button': ElButton,
      'el-input': ElInput,
      'el-switch': ElSwitch,
      focus: true,
      Card: Card,
      PasswordValidation: PasswordValidation,
    },
  })

  const wrapper = mount(ExportXprv, {
    ...mockStore,
  })

  test('shows an error when the password is not validated', async () => {
    wrapper.find('[data-test="password"]').setValue('password')
    wrapper.find('[data-test="repeated-password"]').setValue('passwo')

    await wrapper.find('[data-test="export-btn"]').trigger('click')

    expect(wrapper.find('[data-test="password-error-alert"]').text()).toBe(
      `createValidPassword`,
    )
  })

  test('calls the validate password and export masterkey actions', async () => {
    wrapper.find('[data-test="password"]').setValue('password')
    wrapper.find('[data-test="repeated-password"]').setValue('password')

    await wrapper.find('[data-test="export-btn"]').trigger('click')

    expect(validatePasswordMock).toHaveBeenCalled()
    expect(exportMasterKeyMock).toHaveBeenCalled()
  })
})
