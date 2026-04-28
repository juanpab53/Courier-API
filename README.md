# Courier API

API de gestión de envíos (paquetería) construida con **NestJS** y **TypeORM**, aplicando arquitectura hexagonal y patrones de diseño.

## Stack Tecnológico

- **NestJS 11** - Framework progresivo de Node.js
- **TypeScript** - Tipado estático
- **TypeORM** - ORM para persistencia
- **PostgreSQL** - Base de datos relacional
- **Kafka** (via confluentinc/cp-kafka) - Broker de eventos
- **Swagger** - Documentación OpenAPI

### ¿Por qué este stack?

NestJS proporciona una arquitectura modular y estructurada ideal para aplicar patrones de diseño. TypeORM facilita el mapeo objeto-relacional respetando la separación entre modelo de dominio y entidad de persistencia. Kafka permite implementar el patrón Observer de forma desacoplada.

## Arquitectura

El proyecto sigue **Arquitectura Hexagonal** (Ports and Adapters) con separación clara de responsabilidades:

```
src/
├── customers/           # Módulo de Clientes
│   ├── domain/         # Modelos, puertos (interfaces), excepciones
│   ├── application/    # DTOs, casos de uso
│   └── infrastructure/ # Controladores, persistencia (TypeORM)
├── shipments/          # Módulo de Envíos
│   ├── domain/         # Modelos, puertos, excepciones
│   ├── application/     # DTOs, casos de uso, estrategias
│   └── infrastructure/ # Controladores, persistencia
└── shared/             # Código compartido
    ├── events/         # Puerto EventPublisher, KafkaEventPublisher
    └── infrastructure/ # Consumers de Kafka
```

### Patrones Aplicados

1. **Arquitectura Hexagonal** - Separación domain/application/infrastructure
2. **Strategy Pattern** - Para cálculo de costos de envío según tipo
3. **Observer Pattern** - Para eventos de envíos via Kafka
4. **Mapper Pattern** - Conversión entre entidades ORM y modelos de dominio
5. **Dependency Injection** - Inyección de puertos y casos de uso

## Estrategias de Envío (Strategy Pattern)

| Tipo | Costo | Estado Final | Validaciones |
|------|-------|--------------|--------------|
| `STANDARD` | 0.1% de declaredValue (mín $5,000) | `DELIVERED` | weightKg ≤ 20 |
| `EXPRESS` | $15,000 fijo | `DELIVERED` | weightKg ≤ 5, declaredValue ≤ 3,000,000 |
| `INTERNATIONAL` | $50,000 + 2% de declaredValue | `IN_CUSTOMS` | destinationCountry y customsDeclaration obligatorios |
| `THIRD_PARTY_CARRIER` | 5% de declaredValue | `DELIVERED` | carrierName y externalTrackingId obligatorios |

## Prerrequisitos

- Node.js ≥ 18
- Docker y Docker Compose
- npm

## Pasos para Levantar la Aplicación

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd courier-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Levantar servicios de infraestructura

```bash
docker-compose up -d
```

Esto iniciará:
- **PostgreSQL** en puerto 5432
- **Kafka** en puerto 9092 (con KRaft mode, sin Zookeeper)

### 4. Ejecutar la aplicación

```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`

### 5. Acceder a la documentación Swagger

```
http://localhost:3000/api/docs
```

### 6. (Opcional) UI de Kafka

Puedes usar herramientas como **kafka-ui** para visualizar topics y mensajes:

```bash
docker run -d --network host -e KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=localhost:9092 -e KAFKA_CLUSTERS_0_NAME=local provectuslabs/kafka-ui:latest
```

Luego accede a `http://localhost:8080`

## Variables de Entorno

Configuradas en `.env`:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=courier
KAFKA_BROKER=localhost:9092
```

## API Endpoints

### Customers
- `POST /api/customers` - Crear cliente
- `GET /api/customers` - Listar todos
- `GET /api/customers/:id` - Obtener por ID
- `PATCH /api/customers/:id` - Actualizar (name, role)
- `DELETE /api/customers/:id` - Desactivar (soft delete)

### Shipments
- `POST /api/shipments` - Crear envío (ejecuta Strategy + publica evento)
- `GET /api/shipments/:id` - Obtener por ID
- `GET /api/shipments/customer/:id` - Envíos por cliente

## Eventos Kafka

Cuando se crea un envío, se publica un evento según el estado resultante:

- `shipment.dispatched` - Para envíos con estado `DELIVERED`
- `shipment.in_customs` - Para envíos con estado `IN_CUSTOMS`
- `shipment.failed` - Para envíos con estado `FAILED`

### Consumers

1. **NotificationsConsumer** - Simula envío de notificaciones (console.log estructurado)
2. **AuditConsumer** - Registra traza de auditoría (topic, offset, shipmentId, timestamp)

## Ejemplos de Uso

Ver archivo `courier.http` para ejemplos completos de las 4 estrategias y casos de error.

## Commits

El historial de commits sigue buenas prácticas con mensajes descriptivos y atómicos.
