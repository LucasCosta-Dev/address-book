import type { ResponseAddressByZip } from "@/types/fetchAddressByZip"


export const fetchAddressByZip = async (zip: string): Promise<ResponseAddressByZip | null> => {
    const sanitizedZip = zip.replace(/\D/g, '')
    if (sanitizedZip.length !== 8) return null

    try {
        const response = await fetch(`https://viacep.com.br/ws/${sanitizedZip}/json/`)
        const data: ResponseAddressByZip = await response.json()
        return data.erro ? null : data
    } catch (error) {
        console.error('Erro ao buscar endereço:', error)
        return null
    }
}
