import { describe, it, expect } from 'vitest'
import { getAddressSchema } from '../../../src/schemas/addressSchema'


const t = (key: string) => key

describe('getAddressSchema', () => {
    it('deve passar quando todos os campos obrigatórios estiverem corretos', () => {
        const data = {
            zip: '12345-678',
            street: 'Rua A',
            number: '10',
            neighborhood: 'Centro',
            city: 'Cidade',
            state: 'SP',
            complement: 'Bloco A'
        }

        const schema = getAddressSchema(t)
        expect(() => schema.parse(data)).not.toThrow()
    })

    it('deve falhar quando algum campo obrigatório estiver vazio', () => {
        const data = {
            zip: '',
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            complement: ''
        }

        const schema = getAddressSchema(t)
        const result = schema.safeParse(data)
        const fieldIssues = result.success ? [] : result.error.issues


        expect(fieldIssues?.length).toBe(7)
    })

    it('deve validar o formato do CEP com hífen obrigatório', () => {
        const data = {
            zip: '12345-678',
            street: 'Rua A',
            number: '10',
            neighborhood: 'Centro',
            city: 'Cidade',
            state: 'SP',
            complement: ''
        }

        const schema = getAddressSchema(t)
        expect(() => schema.parse(data)).not.toThrow()
    })

    it('deve permitir complement vazio', () => {
        const data = {
            zip: '12345-678',
            street: 'Rua A',
            number: '10',
            neighborhood: 'Centro',
            city: 'Cidade',
            state: 'SP',
            complement: ''
        }

        const schema = getAddressSchema(t)
        expect(() => schema.parse(data)).not.toThrow()
    })
})
