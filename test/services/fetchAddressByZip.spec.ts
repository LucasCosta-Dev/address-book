
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ResponseAddressByZip } from '@/types/fetchAddressByZip'
import { fetchAddressByZip } from '../../src/services/fetchAddressByZip'


describe('fetchAddressByZip', () => {
    const mockFetch = vi.fn()

    beforeEach(() => {
        vi.stubGlobal('fetch', mockFetch)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('deve retornar null se o CEP tiver tamanho diferente de 8', async () => {
        const result = await fetchAddressByZip('123')
        expect(result).toBeNull()
    })

    it('deve retornar dados do endereço se o CEP for válido', async () => {
        const fakeResponse: ResponseAddressByZip = {
            logradouro: 'Praça da Sé',
            complemento: 'lado ímpar',
            bairro: 'Sé',
            localidade: 'São Paulo',
            uf: 'SP',
        }

        mockFetch.mockResolvedValueOnce({
            json: async () => fakeResponse
        })

        const result = await fetchAddressByZip('01001-000')
        expect(result).toEqual(fakeResponse)
    })

    it('deve retornar null se o CEP não existir (erro na API)', async () => {
        mockFetch.mockResolvedValueOnce({
            json: async () => ({ erro: true })
        })

        const result = await fetchAddressByZip('99999999')
        expect(result).toBeNull()
    })

    it('deve retornar null se houver erro na requisição', async () => {
        const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => { })

        mockFetch.mockRejectedValueOnce(new Error('Falha na rede'))

        const result = await fetchAddressByZip('01001000')
        expect(result).toBeNull()

        consoleErrorMock.mockRestore()
    })
})
