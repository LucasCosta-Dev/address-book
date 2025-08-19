import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BaseButton from '../../src/components/BaseButton/BaseButton.vue'

describe('BaseButton', () => {
    
    it('renderiza com o label correto', () => {
        const wrapper = mount(BaseButton, {
            props: { label: 'Clique aqui', color: 'blue' }
        })
        expect(wrapper.text()).toBe('Clique aqui')
    })

    it('aplica a cor correta', () => {
        const wrapper = mount(BaseButton, {
            props: { label: 'Verde', color: 'green' }
        })
        expect(wrapper.classes()).toContain('bg-green-500')
        expect(wrapper.classes()).toContain('hover:bg-green-600')
    })

    it('emite o evento click quando clicado', async () => {
        const onClick = vi.fn()
        const wrapper = mount(BaseButton, {
            props: { label: 'Clique', color: 'red', onClick }
        })

        await wrapper.trigger('click')
        expect(wrapper.emitted()).toHaveProperty('click')
    })

    it('usa type submit se passado', () => {
        const wrapper = mount(BaseButton, {
            props: { label: 'Enviar', type: 'submit' }
        })
        expect(wrapper.attributes('type')).toBe('submit')
    })
})
