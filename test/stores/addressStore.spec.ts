import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAddressStore } from '../../src/stores/addressStore'

describe('AddressStore', () => {
    let store: ReturnType<typeof useAddressStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        store = useAddressStore()
    })

    const address = { zip: '12345-678', street: 'Rua A', number: '10', complement: '', neighborhood: 'Bairro', city: 'Cidade', state: 'ST' }


    it('deve adicionar um endereço', () => {

        store.addAddress(address)
        expect(store.addresses.length).toBe(1)
        expect(store.addresses[0]).toMatchObject(address)
        expect(store.addresses[0].id).toBe(1)
    })

    it('deve retornar false para isDuplicate quando o array estiver vazio', () => {

        expect(store.isDuplicate(address)).toBe(false)
    })

    it('deve remover um endereço', () => {

        store.addAddress(address)
        store.removeAddress(1)
        expect(store.addresses.length).toBe(0)
    })

    it('deve atualizar um endereço existente', () => {

        store.addAddress(address)

        const updated = { zip: '99999-999', street: 'Rua B', number: '20', complement: 'Apto', neighborhood: 'Bairro', city: 'Nova', state: 'NS' }
        store.updateAddress(1, updated)

        expect(store.addresses[0]).toMatchObject({ id: 1, ...updated })
    })

    it('deve exportar CSV', () => {

        store.addAddress(address)

        const clickMock = vi.fn()


        vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
            if (tag === 'a') return { href: '', download: '', click: clickMock } as any
            return document.createElement(tag)
        })

        global.URL.createObjectURL = vi.fn(() => 'blob:url-mock')

        store.exportCSV()

        expect(clickMock).toHaveBeenCalled()
    })

    it('deve diferenciar endereços diferentes', () => {
        const addr2 = { zip: '12345-678', street: 'Rua B', number: '15', complement: '', neighborhood: 'Bairro', city: 'Cidade', state: 'ST' }
        store.addAddress(address)
        const result = store.addAddress(addr2)
        expect(result).toBe(true)
        expect(store.addresses.length).toBe(2)
    })

    it('deve identificar endereço duplicado', () => {

        store.addAddress(address)
        const result = store.addAddress(address)
        expect(result).toBe(false)
        expect(store.addresses.length).toBe(1)
    })
})
