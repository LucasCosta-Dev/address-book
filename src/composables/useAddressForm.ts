import { reactive, computed, watch } from 'vue'
import { getAddressSchema } from '@/schemas/addressSchema'
import type { AddressForm } from '@/types/form'
import { useI18n } from 'vue-i18n'

export function useAddressForm(defaultForm: AddressForm) {
    const { t, locale } = useI18n()

    const form = reactive<AddressForm>({ ...defaultForm })
    const errors = reactive<Record<keyof AddressForm, string>>({
        zip: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '',
    })

    const addressSchema = computed(() => getAddressSchema(t))


    const resetErrors = () => {
        Object.keys(errors).forEach(key => errors[key as keyof AddressForm] = '')
    }

    const validateForm = (): boolean => {
        resetErrors()
        const result = addressSchema.value.safeParse(form)
        if (!result.success) {
            result.error.issues.forEach(issue => {
                errors[issue.path[0] as keyof AddressForm] = issue.message
            })
            return false
        }
        return true
    }

    watch(locale, resetErrors)

    return {
        form,
        errors,
        validateForm,
        resetErrors,
    }
}
