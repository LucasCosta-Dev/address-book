import { describe, it, expect } from 'vitest'
import { getAddressSchema } from '../../src/schemas/addressSchema'

const t = (key: string) => key

describe('getAddressSchema', () => {

    it('deve passar quando todos os campos obrigatórios estiverem corretos', () => {
        const data = {
            zip: '12345-678',
            street: 'Rua A',
            number: '123',
            complement: 'Apto 1',
            neighborhood: 'Bairro',
            city: 'Cidade',
            state: 'SP'
        }
        const schema = getAddressSchema(t)
        expect(() => schema.parse(data)).not.toThrow()
    })

    it('deve falhar quando algum campo obrigatório estiver vazio', () => {
        const schema = getAddressSchema(t)
        const data = {
            zip: '',
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: ''
        }
        const result = schema.safeParse(data)
        expect(result.success).toBe(false)


        const fieldIssues = result.error?.issues.filter(i => i.path[0] !== 'complement')


        expect(fieldIssues?.length).toBe(7)


        const requiredFields = ['zip', 'street', 'number', 'city', 'state']
        requiredFields.forEach(field => {
            expect(fieldIssues?.some(i => i.path[0] === field)).toBe(true)
        })
    })

    it('deve validar o formato do CEP com hífen obrigatório', () => {
        const schema = getAddressSchema(t)
        const data = {
            zip: '25489411',
            street: 'Rua A',
            number: '123',
            neighborhood: 'Bairro',
            city: 'Cidade',
            state: 'SP'
        }
        const result = schema.safeParse(data)
        expect(result.success).toBe(false)

        const zipIssue = result.error?.issues.find(i => i.path[0] === 'zip')
        expect(zipIssue?.message).toBe('validation.zip_invalid')
    })

    it('deve permitir complement vazio', () => {
        const schema = getAddressSchema(t)
        const data = {
            zip: '12345-678',
            street: 'Rua A',
            number: '123',
            complement: '',
            neighborhood: 'Bairro',
            city: 'Cidade',
            state: 'SP'
        }
        expect(() => schema.parse(data)).not.toThrow()
    })

})