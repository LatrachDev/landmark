export type ServiceCategory = 'A' | 'B' | 'C';

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
    A: 'A.nalyser le marché',
    B: 'b.rand design',
    C: 'c.réation de contenu',
};

export interface Service {
    id: string;
    title: string;
    description: string;
    category: ServiceCategory;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}
