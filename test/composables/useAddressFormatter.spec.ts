import { describe, it, expect } from 'vitest'
import { useAddressFormatter } from '@/composables/useAddressFormatter'

describe('useAddressFormatter', () => {
    const { formatAddress } = useAddressFormatter()

    it('deve formatar endereço com complemento', () => {
        const addr = { street: 'Rua Teste', number: '100', complement: 'Apto 10' }
        expect(formatAddress(addr)).toBe('Rua Teste, 100 - Apto 10')
    })

    it('deve formatar endereço sem complemento', () => {
        const addr = { street: 'Rua Teste', number: '100' }
        expect(formatAddress(addr)).toBe('Rua Teste, 100')
    })

    it('deve retornar string vazia para null', () => {
        expect(formatAddress(null)).toBe('')
    })

    it('deve retornar string vazia para undefined', () => {
        expect(formatAddress(undefined)).toBe('')
    })
})
