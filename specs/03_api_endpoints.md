```markdown
# 03. Contrato de API (REST)

Base URL: `/api/v1`

## Autenticación
- **POST /auth/login**: Retorna JWT.
- **POST /auth/register**: Crea usuario.

## Productos (Público)

### GET /products
Listado con filtros.
- **Query Params:** `page`, `size`, `category`, `search`, `min_price`, `max_price`.
- **Response:** Paginated Response.

### GET /products/{id}
Detalle de producto incluyendo todas sus variantes disponibles.
- **Response Model:**
```json
{
  "id": 1,
  "name": "Filamento PLA Grilon",
  "brand": "Grilon",
  "variants": [
    {
      "id": 101,
      "sku": "PLA-ROJO-1KG",
      "price": 14500.00,
      "stock": 10,
      "attributes": { "color": "Rojo", "peso": "1kg" }
    }
  ]
}