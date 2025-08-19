import { watch, reactive } from 'vue'
import { fetchAddressByZip } from '@/services/fetchAddressByZip'
import { applyCepMask } from '@/utils/masks'
import type { AddressForm } from '@/types/form'

export function useCepAutocomplete(form: AddressForm) {
    const disabledFields = reactive<Record<keyof AddressForm, boolean>>({
        zip: false, street: false, number: false, complement: false, neighborhood: false, city: false, state: false
    })

    watch(
        () => form.zip,
        async (newZip) => {
            form.zip = applyCepMask(newZip)
            if (form.zip.length < 9) return

            const data = await fetchAddressByZip(form.zip)
            form.street = data?.logradouro ?? ''
            form.city = data?.localidade ?? ''
            form.neighborhood = data?.bairro ?? ''
            form.state = data?.uf ?? ''

            disabledFields.street = !!data?.logradouro
            disabledFields.neighborhood = !!data?.bairro
            disabledFields.city = !!data?.localidade
            disabledFields.state = !!data?.uf
        },
        { immediate: false },
    )

    return { disabledFields }
}
