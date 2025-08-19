<template>
  <div class="container mx-auto p-4 sm:py-8 md:py-16">
    <h2 class="sm:text-2xl md:text-3xl font-bold mb-4">{{ $t('title') }}</h2>

    <form @submit.prevent="submitForm" class="space-y-4 rounded">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <InputField
          v-for="input in inputs"
          :key="input.key"
          v-model="form[input.key]"
          :id="input.key"
          :mask="input.mask"
          :schema="addressSchema.shape[input.key]"
          :label="$t(input.key)"
          :placeholder="$t(input.key)"
          :error-prop="errors[input.key]"
          :disabled="disabledFields[input.key]"
        />
      </div>

      <p v-if="error" class="text-red-500">{{ t('address_exists') }}</p>

      <BaseButton
        type="submit"
        color="blue"
        :label="isEdit ? $t('update_address') : $t('add_address')"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import InputField from '@/components/InputField/InputField.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { useAddressStore } from '@/stores/addressStore'
import { useAddressForm } from '@/composables/useAddressForm'
import { useCepAutocomplete } from '@/composables/useCepAutocomplete'
import { useRoute, useRouter } from 'vue-router'
import { getAddressSchema } from '@/schemas/addressSchema'
import type { AddressForm, ListInputs } from '@/types/form'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const defaultForm: AddressForm = {
  zip: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
}

const store = useAddressStore()
const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const isEdit = route.name === 'address-edit'
const error = ref(false)
let addressSchema = getAddressSchema(t)
const { form, errors, validateForm } = useAddressForm(defaultForm)
const { disabledFields } = useCepAutocomplete(form)

const inputs: ListInputs[] = [
  { key: 'zip', mask: '#####-###', disabled: false },
  { key: 'street', disabled: false },
  { key: 'number', mask: '#######', disabled: false },
  { key: 'complement', disabled: false },
  { key: 'neighborhood', disabled: false },
  { key: 'city', disabled: false },
  { key: 'state', mask: 'AA', disabled: false },
]

onMounted(() => {
  if (isEdit) {
    const data = store.addresses.find((a) => a.id === id)
    if (!data) return router.push('/addresses')
    Object.keys(form).forEach(
      (key) => (form[key as keyof AddressForm] = data[key as keyof AddressForm] ?? ''),
    )
  }
})

const submitForm = async () => {
  if (!validateForm()) return

  if (isEdit) {
    store.updateAddress(id, { ...form })
    router.push('/addresses')
    return
  }

  const success = store.addAddress({ ...form })

  error.value = !success

  if (success) router.push('/addresses')
}
</script>
