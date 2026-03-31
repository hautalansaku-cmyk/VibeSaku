export interface Book {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export type BookFormData = Omit<Book, 'id' | 'created_at' | 'updated_at'>;
