import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import AddressList from '../../../src/views/address/AddressList.vue'
import AddressForm from '../../../src/views/address/AddressForm.vue'
import { i18n } from '../../../src/plugins/i18n'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { useAddressStore } from '../../../src/stores/addressStore'


const mockAddress = {
    id: 1,
    zip: '12345-678',
    street: 'Rua das Flores',
    number: '42',
    complement: 'Apto 101',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
}

const mockInputs = [
    { id: 'zip', mask: '#####-###', disabled: false },
    { id: 'street', mask: undefined, disabled: false },
    { id: 'number', mask: '#######', disabled: false },
    { id: 'complement', mask: undefined, disabled: false },
    { id: 'neighborhood', mask: undefined, disabled: false },
    { id: 'city', mask: undefined, disabled: false },
    { id: 'state', mask: 'AA', disabled: false },
]

const pinia = createTestingPinia({
    initialState: {
        address: {
            addresses: [mockAddress],
        },
    },
})


describe('AddressForm.vue', () => {

    let wrapper: any

    beforeEach(async () => {

        const testRouter = createRouter({
            history: createWebHistory(),
            routes: [
                { path: '/addresses/:id', name: 'address-edit', component: AddressForm },
                { path: '/addresses', name: 'address', component: AddressList },
            ],
        })

        testRouter.push({ name: 'address-edit', params: { id: mockAddress.id } })
        await testRouter.isReady()

        wrapper = mount(AddressForm, {
            global: {
                plugins: [i18n, pinia, testRouter],
                directives: {
                    mask: () => { },
                },
            },
        })

        await flushPromises()
    })

    it('renderiza título traduzido', async () => {

        expect(wrapper.find('h2').text()).toBe(i18n.global.t('title'))
    })

    it('renderiza todos os 7 inputs com props corretas', () => {

        const inputFields = wrapper.findAllComponents({ name: 'InputField' })
        expect(inputFields).toHaveLength(mockInputs.length)

        mockInputs.forEach((expected, index) => {
            const input = inputFields[index]
            expect(input.props('id')).toBe(expected.id)
            expect(input.props('disabled')).toBe(expected.disabled)

            if (expected.mask !== undefined) {
                expect(input.props('mask')).toBe(expected.mask)
            }
        })
    })

    it('preenche os campos com dados simulados em modo edição', async () => {

        const router = createRouter({
            history: createWebHistory(),
            routes: [
                { path: '/addresses/edit/:id', name: 'address-edit', component: AddressForm },
            ],
        })

        router.push({ name: 'address-edit', params: { id: mockAddress.id } })
        await router.isReady()


        await flushPromises()

        const inputs = wrapper.findAllComponents({ name: 'InputField' })
        inputs.forEach((input) => {
            const id = input.props('id')
            expect(input.props('modelValue')).toBe(mockAddress[id])
        })
    })

    it('chama a action do store ao submeter o formulário', async () => {
        const store = useAddressStore()

        const form = wrapper.find('form')
        await form.trigger('submit.prevent')

        await flushPromises()

        expect(store.updateAddress).toHaveBeenCalledWith(
            mockAddress.id,
            {
                zip: mockAddress.zip,
                street: mockAddress.street,
                number: mockAddress.number,
                complement: mockAddress.complement,
                neighborhood: mockAddress.neighborhood,
                city: mockAddress.city,
                state: mockAddress.state,
            }
        )
    })

    it('dispara evento de submit nativo ao enviar o formulário', async () => {
        const form = wrapper.find('form')
        const submitSpy = vi.fn()
        form.element.addEventListener('submit', submitSpy)

        await form.trigger('submit.prevent')

        expect(submitSpy).toHaveBeenCalled()
    })
})


