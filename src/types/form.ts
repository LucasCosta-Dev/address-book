export interface AddressForm {
    street: string
    number: string
    complement: string
    city: string
    neighborhood: string
    state: string
    zip: string
}


export interface Address extends AddressForm {
    id: number
}

type AddressKey = keyof AddressForm

export interface ListInputs {
    key: AddressKey; mask?: string | null; disabled: boolean
}


