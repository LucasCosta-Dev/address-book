import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reactive, nextTick } from 'vue'
import type { AddressForm } from '@/types/form'
import { useCepAutocomplete } from '@/composables/useCepAutocomplete'

const mockedFetchAddressByZip = vi.fn()

vi.mock('@/services/fetchAddressByZip', () => {
    return {
        fetchAddressByZip: vi.fn()
    }
})

vi.mock('@/utils/masks', () => ({
    applyCepMask: (zip: string) => zip.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2')
}))

describe('useCepAutocomplete', () => {
    let form: AddressForm

    beforeEach(() => {
        form = reactive({
            zip: '',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: ''
        })

        vi.clearAllMocks()
    })

    it('não deve chamar fetch se CEP estiver incompleto', async () => {
        const { disabledFields } = useCepAutocomplete(form)

        form.zip = '1234'
        await nextTick()

        expect(mockedFetchAddressByZip).not.toHaveBeenCalled()
        expect(form.zip).toBe('1234')
        expect(disabledFields.street).toBe(false)
    })

    it('deve limpar campos e manter habilitados se fetch retornar vazio', async () => {
        mockedFetchAddressByZip.mockResolvedValue({})

        const { disabledFields } = useCepAutocomplete(form)

        form.zip = '87654321'
        await nextTick()
        await new Promise(process.nextTick)

        expect(form.street).toBe('')
        expect(form.neighborhood).toBe('')
        expect(form.city).toBe('')
        expect(form.state).toBe('')

        expect(disabledFields.street).toBe(false)
        expect(disabledFields.neighborhood).toBe(false)
        expect(disabledFields.city).toBe(false)
        expect(disabledFields.state).toBe(false)
    })
})
