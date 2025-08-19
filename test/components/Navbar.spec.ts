import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import NavBar from '../../src/components/navBar/Navbar.vue'
import { i18n } from '../../src/plugins/i18n'
import router from '../../src/router'


describe('NavBar.vue', () => {

    beforeEach(() => {
        const app = document.createElement('div')
        app.id = 'app'
        document.body.appendChild(app)
    })

    afterEach(() => {
        const app = document.getElementById('app')
        if (app) app.remove()
    })

    it('renderiza os links com tradução em PT por padrão', async () => {
        const wrapper = mount(NavBar, {
            global: {
                plugins: [i18n, router],
            },
        })

        expect(wrapper.html()).toContain('Catálogo')
        expect(wrapper.html()).toContain('Adicionar Endereço')
    })

    it('troca para EN quando clica no botão EN', async () => {
        const wrapper = mount(NavBar, {
            global: {
                plugins: [i18n, router],
            },
        })

        await wrapper.find('button:last-of-type').trigger('click')

        expect(wrapper.html()).toContain('Catalog')
        expect(wrapper.html()).toContain('Add Address')
    })

    it('abre e fecha o menu mobile quando clica no botão', async () => {
        const wrapper = mount(NavBar, {
            global: {
                plugins: [i18n, router],
            },
        })

        expect(wrapper.find('.md\\:hidden.bg-blue-500').exists()).toBe(false)

        await wrapper.find('button svg').trigger('click')
        expect(wrapper.find('.md\\:hidden.bg-blue-500').exists()).toBe(true)

        await wrapper.find('button svg').trigger('click')
        expect(wrapper.find('.md\\:hidden.bg-blue-500').exists()).toBe(false)
    })
})
