<template>
  <div class="container mx-auto p-4 sm:py-8 md:py-16">
    <h2 class="sm:text-2xl md:text-3xl font-bold mb-4">
      {{ $t('title') }}
    </h2>

    <div class="overflow-x-auto my-4">
      <table class="min-w-[900px] w-full border border-gray-300" v-if="store.addresses.length > 0">
        <thead class="bg-gray-200">
          <tr>
            <th class="p-3 border-b text-left whitespace-nowrap">{{ $t('address') }}</th>
            <th class="p-3 border-b text-left whitespace-nowrap">{{ $t('neighborhood') }}</th>
            <th class="p-3 border-b text-left whitespace-nowrap">{{ $t('city') }}</th>
            <th class="p-3 border-b text-left whitespace-nowrap">{{ $t('state') }}</th>
            <th class="p-3 border-b text-left whitespace-nowrap">{{ $t('zip') }}</th>
            <th class="p-3 border-b text-center whitespace-nowrap">{{ $t('actions') }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="addr in store.addresses" :key="addr.id">
            <td class="p-3 border-b whitespace-nowrap">
              {{ formatAddress(addr) }}
            </td>
            <td class="p-3 border-b whitespace-nowrap">{{ addr.neighborhood }}</td>
            <td class="p-3 border-b whitespace-nowrap">{{ addr.city }}</td>
            <td class="p-3 border-b whitespace-nowrap">{{ addr.state }}</td>
            <td class="p-3 border-b whitespace-nowrap">{{ addr.zip }}</td>
            <td class="p-3 border-b text-center whitespace-nowrap">
              <div class="flex justify-center gap-3">
                <BaseButton color="blue" @click="editAddress(addr.id)">
                  {{ $t('edit') }}
                </BaseButton>

                <BaseButton color="red" @click="removeAddress(addr.id)">
                  {{ $t('remove') }}
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="store.addresses.length === 0">
        <p class="text-center py-4">
          {{ $t('no_addresses') }}
        </p>
      </div>
    </div>

    <BaseButton color="green" @click="exportCSV" v-if="store.addresses.length > 0">
      {{ $t('export_csv') }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAddressStore } from '@/stores/addressStore'
import { useAddressFormatter } from '@/composables/useAddressFormatter'
import BaseButton from '../../components/BaseButton/BaseButton.vue'

const { formatAddress } = useAddressFormatter()
const store = useAddressStore()
const router = useRouter()

const editAddress = (id: number) =>
  router.push({ name: 'address-edit', params: { id: id.toString() } })

const removeAddress = (id: number) => store.removeAddress(id)

const exportCSV = () => {
  if (!store.addresses || store.addresses.length === 0) return
  store.exportCSV()
}
</script>
