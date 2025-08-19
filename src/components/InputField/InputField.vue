<template>
  <div class="flex flex-col w-full">
    <label v-if="label" :for="id" class="mb-1 font-medium text-gray-700">{{ label }}</label>

    <input
      v-if="mask"
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      v-mask="mask"
      @input="onInput($event)"
      :class="[
        'w-full h-12 px-3 border rounded transition',
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500',
        disabled
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-0'
          : 'focus:outline-none focus:ring-2',
      ]"
    />
    <input
      v-else
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      @input="onInput($event)"
      :class="[
        'w-full h-12 px-3 border rounded transition',
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500',
        disabled
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-0'
          : 'focus:outline-none focus:ring-2',
      ]"
    />

    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { type ZodTypeAny } from 'zod'

const props = defineProps({
  id: { type: String, default: '' },
  type: { type: String, default: 'text' },
  label: { type: String, default: '', required: true },
  placeholder: { type: String, default: '', required: true },
  modelValue: { type: [String, Number], default: '', required: true },
  schema: { type: Object as () => ZodTypeAny, default: null },
  errorProp: { type: String, default: '' },
  mask: { type: [String, null], default: '' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'update:error'])
const error = ref('')

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target?.value || ''

  emit('update:modelValue', value)
}

watch(
  () => props.errorProp,
  (val) => {
    error.value = val
  },
)

watch(
  () => props.modelValue,
  (val) => {
    if (props.schema) {
      const result = props.schema.safeParse(val)
      error.value = result.success ? '' : result.error.issues[0].message
      emit('update:error', error.value)
    }
  },
)
</script>
