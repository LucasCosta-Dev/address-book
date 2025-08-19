import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import InputField from '../../src/components/inputField/InputField.vue'
import { z } from 'zod'


vi.mock('v-mask', () => ({}))

describe('InputField.vue', () => {
    it('renderiza o label corretamente', () => {
        const wrapper = mount(InputField, {
            props: {
                id: 'name',
                label: 'Nome',
                placeholder: 'Digite seu nome',
                modelValue: '',
            },
            global: {
                directives: {
                    mask: vi.fn(),
                },
            },
        })

        expect(wrapper.find('label').text()).toBe('Nome')
    })

    it('emite update:modelValue quando o usuário digita', async () => {
        const wrapper = mount(InputField, {
            props: {
                id: 'name',
                label: 'Nome',
                placeholder: 'Digite seu nome',
                modelValue: '',
            },
            global: {
                directives: {
                    mask: vi.fn(),
                },
            },
        })

        const input = wrapper.find('input')
        await input.setValue('Lucas')

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['Lucas'])
    })

    it('mostra mensagem de erro quando errorProp é passado', async () => {
        const wrapper = mount(InputField, {
            props: {
                id: 'name',
                label: 'Nome',
                placeholder: 'Digite seu nome',
                modelValue: '',
            },
            global: {
                directives: {
                    mask: vi.fn(),
                },
            },
        })

        await wrapper.setProps({ errorProp: 'Campo obrigatório' })
        await wrapper.vm.$nextTick()

        expect(wrapper.find('p.text-red-500').text()).toBe('Campo obrigatório')

    })

    it('valida valor com schema do Zod e emite update:error', async () => {
        const schema = z.string().min(5, 'Mínimo 5 caracteres')

        const wrapper = mount(InputField, {
            props: {
                id: 'username',
                label: 'Usuário',
                placeholder: '',
                modelValue: '',
                schema,
            },
            global: {
                directives: {
                    mask: vi.fn(),
                },
            },
        })


        await wrapper.setProps({ modelValue: 'abc' })
        await wrapper.vm.$nextTick()

        expect(wrapper.find('p.text-red-500').text()).toBe('Mínimo 5 caracteres')
        expect(wrapper.emitted()['update:error'][0]).toEqual(['Mínimo 5 caracteres'])
    })

    it('aplica estilos de disabled corretamente', () => {
        const wrapper = mount(InputField, {
            props: {
                id: 'disabled-input',
                label: 'Desativado',
                placeholder: 'Nada aqui',
                modelValue: '',
                disabled: true,
            },
            global: {
                directives: {
                    mask: vi.fn(),
                },
            },
        })

        const input = wrapper.find('input')
        expect(input.attributes('disabled')).toBeDefined()
    })
})
