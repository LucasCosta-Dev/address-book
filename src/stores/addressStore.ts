import { defineStore } from 'pinia'
import type { AddressForm, Address } from '@/types/form'

export const useAddressStore = defineStore('address', {
    state: () => ({
        addresses: [] as Address[]
    }),

    actions: {
        isDuplicate(addr: AddressForm) {
            return this.addresses.length > 0 && this.addresses.some(a =>
                a.zip === addr.zip &&
                a.street.toLowerCase() === addr.street.toLowerCase() &&
                a.number === addr.number &&
                a.city.toLowerCase() === addr.city.toLowerCase() &&
                a.state.toLowerCase() === addr.state.toLowerCase()
            )
        },

        addAddress(addr: AddressForm) {
            if (this.isDuplicate(addr)) return false

            const lastId = this.addresses.length ? Math.max(...this.addresses.map(a => a.id)) : 0
            this.addresses.push({ id: lastId + 1, ...addr })
            return true
        },

        removeAddress(id: number) {
            this.addresses = this.addresses.filter(a => a.id !== id)
        },

        updateAddress(id: number, updated: AddressForm) {
            const index = this.addresses.findIndex(a => a.id === id)
            if (index !== -1) {
                this.addresses[index] = { id, ...updated }
            }
        },

        exportCSV() {
            const header = "Street,Number,Complement,City,State,Zip\n"
            const rows = this.addresses
                .map(a => `"${a.street}","${a.number}","${a.complement}","${a.city}","${a.state}","${a.zip}"`)
                .join("\n")

            const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = "addresses.csv"
            link.click()
        }
    }
})
