<template>
  <header>
    <nav class="bg-blue-500 text-white">
      <div class="container mx-auto flex justify-between items-center p-4">
        <div class="hidden md:flex gap-4">
          <router-link to="/addresses" class="hover:underline">{{
            $t('menu.catalog')
          }}</router-link>
          <router-link to="/addresses/create" class="hover:underline">{{
            $t('menu.add')
          }}</router-link>
        </div>

        <div class="hidden md:flex gap-2">
          <button @click="changeLanguage('pt')" class="px-2 py-1 bg-white text-blue-500 rounded">
            PT
          </button>
          <button @click="changeLanguage('en')" class="px-2 py-1 bg-white text-blue-500 rounded">
            EN
          </button>
        </div>

        <div class="md:hidden flex items-center">
          <button @click="isOpen = !isOpen" class="focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!isOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="isOpen" class="md:hidden bg-blue-500 px-4 pb-4 flex flex-col gap-2">
        <router-link to="/addresses" class="hover:underline">{{ $t('menu.catalog') }}</router-link>
        <router-link to="/addresses/create" class="hover:underline">{{
          $t('menu.add')
        }}</router-link>

        <div class="flex gap-2 mt-2">
          <button @click="changeLanguage('pt')" class="px-2 py-1 bg-white text-blue-500 rounded">
            PT
          </button>
          <button @click="changeLanguage('en')" class="px-2 py-1 bg-white text-blue-500 rounded">
            EN
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const isOpen = ref(false)
const { locale } = useI18n()

const changeLanguage = (lang: string) => {
  locale.value = lang
  isOpen.value = false
}
</script>
