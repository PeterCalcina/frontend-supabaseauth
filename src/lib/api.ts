import { QueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  inventory: {
    list: '/api/inventory',
    create: '/api/inventory',
    update: (id: string) => `/api/inventory/${id}`,
    delete: (id: string) => `/api/inventory/${id}`,
  },
  movements: {
    list: '/api/movements',
    create: '/api/movements',
  },
  expirations: {
    list: '/api/expirations',
  },
  reports: {
    summary: '/api/reports/summary',
  },
} as const;

// Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  cost: number;
  last_entry: string;
  created_at: string;
  updated_at: string;
}

export interface Movement {
  id: string;
  type: 'entry' | 'exit' | 'expiration' | 'sale';
  product_id: string;
  quantity: number;
  date: string;
  notes?: string;
  created_at: string;
}

export interface Expiration {
  id: string;
  product_id: string;
  expiration_date: string;
  quantity: number;
  created_at: string;
}

export interface ReportSummary {
  total_sold: number;
  current_inventory_value: number;
  movements_by_type: Record<string, number>;
}

// API Services
export const productService = {
  async list() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  async update(id: string, product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const movementService = {
  async list() {
    const { data, error } = await supabase
      .from('movements')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data as Movement[];
  },

  async create(movement: Omit<Movement, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('movements')
      .insert([movement])
      .select()
      .single();

    if (error) throw error;
    return data as Movement;
  },
};

export const expirationService = {
  async list() {
    const { data, error } = await supabase
      .from('expirations')
      .select('*')
      .order('expiration_date', { ascending: true });

    if (error) throw error;
    return data as Expiration[];
  },
};

export const reportService = {
  async getSummary() {
    const { data, error } = await supabase
      .rpc('get_report_summary');

    if (error) throw error;
    return data as ReportSummary;
  },
}; 