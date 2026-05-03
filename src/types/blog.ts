export type BlogCategory = 'MARKETING' | 'BRANDING' | 'CONTENT';

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
    MARKETING: 'EN RELATION AVEC LE MARKETING',
    BRANDING: 'EN RELATION AVEC LE BRANDING',
    CONTENT: 'EN RELATION AVEC LA CRÉATION DE CONTENUE',
};

export interface Blog {
    id: string;
    title: string;
    content: string;
    category: BlogCategory;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}
