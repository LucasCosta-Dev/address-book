<template>
  <button :type="type" :class="buttonClasses" @click="$emit('click')">
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps<{
  label?: string
  color?: 'blue' | 'green' | 'red'
  type?: 'button' | 'submit' | 'reset'
}>()

const buttonClasses = computed(() => {
  const base = 'px-4 py-2 text-white rounded transition-colors duration-200'
  const colors: Record<string, string> = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    red: 'bg-red-500 hover:bg-red-600',
  }
  return [base, colors[props.color || 'blue']].join(' ')
})
</script>
