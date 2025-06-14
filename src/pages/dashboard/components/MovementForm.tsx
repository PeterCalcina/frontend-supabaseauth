import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Form, Input, Select, Textarea } from '@/shared/components/ui';
import { Movement } from '@/shared/types';

const movementSchema = z.object({
  type: z.enum(['entry', 'exit', 'expiration', 'sale']),
  product_id: z.string().min(1, 'El producto es requerido'),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  date: z.string().min(1, 'La fecha es requerida'),
  notes: z.string().optional(),
});

type MovementFormValues = z.infer<typeof movementSchema>;

interface MovementFormProps {
  products: Movement[];
  onSubmit: (values: MovementFormValues) => void;
}

export function MovementForm({ products, onSubmit }: MovementFormProps) {
  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      type: 'entry',
      product_id: '',
      quantity: 1,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const handleSubmit = (values: MovementFormValues) => {
    onSubmit(values);
  };

  return (
    <Form.Root {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Form.Field
          control={form.control}
          name="type"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Tipo de Movimiento</Form.Label>
              <Select.Root
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <Form.Control>
                  <Select.Trigger>
                    <Select.Value placeholder="Selecciona el tipo" />
                  </Select.Trigger>
                </Form.Control>
                  <Select.Content>
                  <Select.Item value="entry">Entrada</Select.Item>
                  <Select.Item value="exit">Salida</Select.Item>
                  <Select.Item value="expiration">Vencimiento</Select.Item>
                  <Select.Item value="sale">Venta</Select.Item>
                </Select.Content>
              </Select.Root>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="product_id"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Producto</Form.Label>
              <Select.Root
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <Form.Control>
                  <Select.Trigger>
                    <Select.Value placeholder="Selecciona el producto" />
                  </Select.Trigger>
                </Form.Control>
                <Select.Content>
                  {products.map((product) => (
                    <Select.Item key={product.id} value={product.id}>
                      {product.itemId}
                    </Select.Item>
                  ))}
                  </Select.Content>
              </Select.Root>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Cantidad</Form.Label>
              <Form.Control>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="date"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Fecha</Form.Label>
              <Form.Control>
                <Input type="date" {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="notes"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Notas</Form.Label>
              <Form.Control>
                <Textarea {...field} />
                </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Button type="submit" className="w-full">
          Registrar Movimiento
        </Button>
      </form>
    </Form.Root>
  );
} 