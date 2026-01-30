# 02. Esquema de Base de Datos (PostgreSQL)

## Estrategia de Datos
Usamos PostgreSQL. Para manejar la diversidad de atributos en productos 3D (ej: impresoras tienen volumen de impresión, filamentos tienen color/material), usamos una columna **JSONB** en la tabla de variantes.

## Diagrama Entidad-Relación (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS {
        bigint id PK
        string email UK
        string password_hash
        string role "ADMIN, CUSTOMER"
        boolean is_active
        timestamp created_at
    }

    CATEGORIES ||--o{ PRODUCTS : contains
    CATEGORIES {
        int id PK
        string name
        string slug UK
        int parent_id FK "Nullable, self-reference"
    }

    PRODUCTS ||--o{ PRODUCT_VARIANTS : has
    PRODUCTS {
        bigint id PK
        string name
        string description
        int category_id FK
        string brand
        string main_image_url
        boolean is_active
        timestamp created_at
    }

    PRODUCT_VARIANTS ||--o{ ORDER_ITEMS : included_in
    PRODUCT_VARIANTS {
        bigint id PK
        bigint product_id FK
        string sku UK
        decimal price
        int stock_quantity
        int version "Para Optimistic Locking"
        jsonb attributes "Ej: {color: 'rojo', material: 'PLA', diametro: '1.75'}"
    }

    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS {
        bigint id PK
        bigint user_id FK
        decimal total_amount
        string status "PENDING, PAID, PREPARING, SHIPPED, DELIVERED, CANCELED"
        string payment_method "MERCADOPAGO, TRANSFER, CASH"
        string shipping_address
        string tracking_number
        timestamp created_at
    }

    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint variant_id FK
        int quantity
        decimal unit_price "Snapshot del precio al comprar"
    }