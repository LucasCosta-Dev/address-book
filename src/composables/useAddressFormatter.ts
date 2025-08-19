export interface Address {
    street: string;
    number: string;
    complement?: string;
}

export function useAddressFormatter() {
    const formatAddress = (addr: Address | null | undefined): string => {
        if (!addr) return '';
        const { street, number, complement } = addr;
        return `${street}, ${number}${complement ? ' - ' + complement : ''}`;
    };

    return { formatAddress };
}
