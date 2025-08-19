import { z, ZodObject } from 'zod'

export const getAddressSchema = (t: (key: string) => string): ZodObject<any> => {
    return z.object({
        zip: z.string().nonempty(t('validation.zip_required')).regex(/^\d{5}-\d{3}$/, t('validation.zip_invalid')),
        street: z.string().nonempty(t('validation.street_required')),
        number: z.string().nonempty(t('validation.number_required')),
        complement: z.string().optional().default(''),
        city: z.string().nonempty(t('validation.city_required')),
        neighborhood: z.string().nonempty(t('validation.neighborhood_required')),
        state: z.string().nonempty(t('validation.state_required')),
    })
}
