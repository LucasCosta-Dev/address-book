import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useAddressForm } from '@/composables/useAddressForm'
import type { AddressForm } from '@/types/form'


vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (msg: string) => msg,
        locale: ref('pt'),
    }),
}))


const safeParseMock = vi.fn()
vi.mock('@/schemas/addressSchema', () => ({
    getAddressSchema: () => ({
        safeParse: safeParseMock,
    }),
}))

describe('useAddressForm', () => {
    let defaultForm: AddressForm

    beforeEach(() => {
        defaultForm = {
            zip: '12345-678',
            street: 'Rua Teste',
            number: '100',
            complement: '',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
        }
        safeParseMock.mockReset()
    })

    it('deve inicializar o form e os erros', () => {
        const { form, errors } = useAddressForm(defaultForm)

        expect(form.street).toBe('Rua Teste')
        expect(errors.zip).toBe('')
    })

    it('deve validar o formulário com sucesso', () => {
        safeParseMock.mockReturnValue({ success: true })

        const { validateForm, errors } = useAddressForm(defaultForm)
        const isValid = validateForm()

        expect(isValid).toBe(true)
        expect(errors.zip).toBe('')
    })

    it('deve falhar na validação e preencher os erros', () => {
        safeParseMock.mockReturnValue({
            success: false,
            error: {
                issues: [
                    { path: ['zip'], message: 'CEP inválido' },
                    { path: ['street'], message: 'Rua obrigatória' },
                ],
            },
        })

        const { validateForm, errors } = useAddressForm(defaultForm)
        const isValid = validateForm()

        expect(isValid).toBe(false)
        expect(errors.zip).toBe('CEP inválido')
        expect(errors.street).toBe('Rua obrigatória')
    })

    it('deve resetar os erros', () => {
        safeParseMock.mockReturnValue({
            success: false,
            error: {
                issues: [{ path: ['zip'], message: 'CEP inválido' }],
            },
        })

        const { validateForm, resetErrors, errors } = useAddressForm(defaultForm)
        validateForm()

        expect(errors.zip).toBe('CEP inválido')

        resetErrors()
        expect(errors.zip).toBe('')
    })
})
