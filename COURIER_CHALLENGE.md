# Reto Técnico — Courier API

**Duración estimada:** 3 a 5 días · **Dominio fijo:** Gestión de envíos / paquetería · **Stack:** libre

## 1. Contexto

En las sesiones anteriores construimos un `bank-api` donde aplicamos arquitectura hexagonal, el patrón **Strategy** para distintos tipos de transferencia y el patrón **Observer** a través de Kafka para desacoplar notificaciones y auditoría.

En este reto replicarás **los mismos conceptos y la misma calidad técnica** pero sobre un dominio diferente: una **API de gestión de envíos (Courier)**. No se trata de copiar código: se trata de demostrar que entendiste los patrones lo suficiente para aplicarlos en otro contexto.

## 2. Dominio del reto

Tu API administra **clientes** (`Customer`) que envían y reciben **paquetes** (`Shipment`). Cada envío se despacha bajo una de **cuatro modalidades** con reglas propias.

### Entidades principales

**Customer**
- `id` (UUID), `name`, `email` (único), `password` (hasheado), `role` (`ADMIN` | `SENDER`), `isActive`, timestamps.

**Shipment**
- `id` (UUID), `senderId`, `recipientId`, `declaredValue` (decimal), `shippingCost` (decimal, calculado por la estrategia), `type`, `status`, `metadata` (JSON), timestamps.
- `type`: `STANDARD` | `EXPRESS` | `INTERNATIONAL` | `THIRD_PARTY_CARRIER`.
- `status`: `PENDING` | `DELIVERED` | `IN_CUSTOMS` | `FAILED`.

### Reglas de negocio por modalidad (Strategy)

| Tipo | Costo (`shippingCost`) | Estado final | Validaciones específicas |
|---|---|---|---|
| `STANDARD` | 0.1 % de `declaredValue`, mínimo $5 000 | `DELIVERED` inmediato | `senderId != recipientId`; `metadata.weightKg <= 20` |
| `EXPRESS` | $15 000 fijo | `DELIVERED` inmediato | `metadata.weightKg <= 5`; `declaredValue <= 3 000 000` |
| `INTERNATIONAL` | $50 000 + 2 % de `declaredValue` | `IN_CUSTOMS` (queda pendiente de aduana) | `metadata.destinationCountry` y `metadata.customsDeclaration` obligatorios; `declaredValue <= 50 000 000` |
| `THIRD_PARTY_CARRIER` | 5 % de `declaredValue` | `DELIVERED` inmediato | `metadata.carrierName` y `metadata.externalTrackingId` obligatorios |

Reglas comunes: `declaredValue > 0`, ambos clientes deben existir y estar activos, `senderId != recipientId`.

### Eventos a publicar (Observer)

Cuando un envío termina de procesarse, el use case publica al broker un evento en el topic correspondiente al estado:

- `shipment.dispatched` → status `DELIVERED`
- `shipment.in_customs` → status `IN_CUSTOMS`
- `shipment.failed` → status `FAILED`

**Dos consumers independientes** deben suscribirse a esos topics:
- `NotificationsConsumer`: simula envío de notificación (console.log estructurado).
- `AuditConsumer`: registra la traza de auditoría (topic, offset, shipmentId, timestamp).

El payload del evento incluye como mínimo: `shipmentId`, `senderId`, `recipientId`, `declaredValue`, `shippingCost`, `type`, `status`, `timestamp`.

## 3. Endpoints mínimos

```
POST   /api/customers                crear cliente
GET    /api/customers                 listar
GET    /api/customers/:id             por id
PATCH  /api/customers/:id             actualizar (name, role)
DELETE /api/customers/:id             desactivar (soft delete)

POST   /api/shipments                 crear envío (ejecuta Strategy + publica evento)
GET    /api/shipments/:id             por id
GET    /api/shipments/customer/:id    envíos enviados o recibidos por el cliente
```

Códigos esperados: `201` en creación, `200` en lectura/actualización, `204` en delete, `400` validación, `404` no encontrado, `409` conflicto (p.ej. email duplicado).

## 4. Requisitos técnicos obligatorios

### Arquitectura
- **Hexagonal** por módulo: cada módulo (`customers`, `shipments`, `shared/events`, `notifications`) con carpetas `domain/`, `application/`, `infrastructure/`.
- El dominio **no** puede importar clases del ORM, del cliente del broker, ni de HTTP.
- Los contratos (ports/interfaces) viven en `domain/ports`; sus implementaciones en `infrastructure/`.

### Patrones
- **Strategy**: un `ShippingStrategyPort` con `validate()`, `calculateCost()` y `execute()`. Una clase por cada tipo (4 en total). El use case **no** debe contener un `switch`/`if` que instancie estrategias; usa un `Map` / registro / factory para seleccionarla.
- **Observer**: port `EventPublisher` + adapter del broker que elijas (Kafka, RabbitMQ, Redis Streams, NATS). Dos consumers suscritos a los mismos topics demostrando el desacople.

### Persistencia
- ORM real contra BD real (PostgreSQL, MySQL o MongoDB). Nada de in-memory.
- **Mapper pattern**: la entidad del ORM es **distinta** del modelo de dominio. Un `Mapper` convierte en ambos sentidos.
- `metadata` se guarda como JSON/JSONB.

### API
- DTOs con validación declarativa (`class-validator`, Jakarta Validation, FluentValidation, etc.).
- Excepciones de dominio custom mapeadas a códigos HTTP (`ShipmentNotFoundException` → 404, `InvalidShipmentException` → 400, `EmailAlreadyExistsException` → 409).
- **Swagger / OpenAPI publicado en `/api/docs`** con schemas de request y response. Este es el único add-on obligatorio respecto al `bank-api` de referencia.

### Contenedores
- `docker-compose.yml` que levante al menos BD y broker. La app puede correr en host.
- Variables sensibles en `.env`, no hardcodeadas.

## 5. Stack

Es **libre**. Puedes usar:
- NestJS + TypeORM (como el `bank-api`)
- Spring Boot + JPA
- .NET + EF Core
- Go + GORM
- cualquier combinación equivalente

Siempre y cuando cumplas arquitectura hexagonal, los dos patrones, persistencia real, broker real y Swagger.

## 6. Entregables

1. Repositorio Git público o compartido con el instructor.
2. `README.md` con:
   - Stack elegido y por qué.
   - Pasos exactos para levantar: `docker-compose up` → cómo correr la app → URL de Swagger → URL de la UI del broker si aplica.
   - Diagrama o descripción breve de la arquitectura y lista de patrones aplicados.
3. `docker-compose.yml` funcional.
4. Código fuente organizado según lo exigido.
5. Swagger accesible en `/api/docs`.
6. Colección Postman o archivo `.http` con ejemplos de **cada una de las 4 estrategias** y al menos un caso de error (p.ej. `EXPRESS` con peso 10 kg → 400).
7. Commits atómicos con mensajes claros.

## 7. Fuera de alcance (para no desbordar el sprint)

No se exige (no se penaliza su ausencia): autenticación JWT, tests automatizados con cobertura mínima, CI/CD, migraciones con Flyway/Liquibase, observabilidad avanzada. Si los incluyes es bonus, no requisito.

## 8. Referencias del `bank-api` que puedes consultar

- Contrato Strategy: `bank-api/src/transfers/domain/ports/transfer-strategy.port.ts`
- 4 estrategias concretas: `bank-api/src/transfers/application/strategies/`
- Selección sin switch (Map como provider): `bank-api/src/transfers/transfers.module.ts`
- Publicación de evento dentro del use case: `bank-api/src/transfers/application/use-cases/execute-transfer.use-case.ts`
- Port + adapter del Observer: `bank-api/src/shared/events/`
- Dos consumers independientes: `bank-api/src/notifications/application/handlers/`
- Mapper Entity ↔ Domain: `bank-api/src/transfers/infrastructure/persistence/transfer.mapper.ts`
- Docker Compose de referencia: `Sesion2/docker-compose.yml`

**No copies y pegues cambiando nombres.** Tradúcelo. El evaluador mirará si entendiste los patrones o solo renombraste clases.

## 9. Criterio de aprobación

Rúbrica de **100 puntos** en `EVALUATION_RUBRIC.md`. Se aprueba con **70 puntos o más**.

¡Éxitos!