# Rúbrica de Evaluación — Courier API

**Total:** 100 puntos · **Aprobación:** ≥ 70 puntos

Cada ítem es verificable leyendo el código o ejecutando la aplicación. Cuando un ítem esté parcialmente cumplido, otorga la fracción proporcional (p.ej. 3 de 4 estrategias correctas en B → 9 de 12).

---

## A. Arquitectura Hexagonal — 15 pts

| Pts | Criterio |
|---|---|
| 5 | Cada módulo (`customers`, `shipments`, `shared/events`, `notifications`) tiene subcarpetas `domain/`, `application/`, `infrastructure/` bien delimitadas. |
| 5 | El código de `domain/` **no importa** clases del ORM, del cliente del broker, ni de HTTP/framework. Grep rápido en `domain/` por los nombres del ORM/broker lo confirma. |
| 3 | Los ports (interfaces o clases abstractas) están en `domain/ports` y sus implementaciones en `infrastructure/`. |
| 2 | No hay `new` de repositorios, estrategias o publishers dentro de los use cases — todo entra por inyección de dependencias. |

## B. Strategy Pattern — 20 pts

| Pts | Criterio |
|---|---|
| 4 | Existe un `ShippingStrategyPort` (interfaz o clase abstracta) con al menos `validate()`, `calculateCost()` y `execute()`. |
| 12 | Las 4 estrategias (`STANDARD`, `EXPRESS`, `INTERNATIONAL`, `THIRD_PARTY_CARRIER`) están implementadas con las reglas exactas del reto (3 pts cada una — costo correcto, estado final correcto, validaciones específicas). |
| 2 | El `CreateShipmentUseCase` selecciona la estrategia **sin `switch`/cadena `if` por tipo**: usa `Map`, registro o factory. |
| 2 | Agregar una 5ª estrategia (p.ej. `DRONE_DELIVERY`) **no** requeriría modificar el use case (verifica mentalmente el OCP). |

## C. Observer Pattern con broker — 20 pts

| Pts | Criterio |
|---|---|
| 4 | `EventPublisher` definido como port; el adapter concreto del broker elegido vive en `infrastructure/`. |
| 5 | El use case publica al menos 3 topics (`shipment.dispatched`, `shipment.in_customs`, `shipment.failed` o nombres equivalentes coherentes con el estado). |
| 6 | Existen **dos consumers independientes** (`NotificationsConsumer` y `AuditConsumer`) suscritos a los mismos topics y con responsabilidades distintas. |
| 3 | Producer y consumers manejan lifecycle: conectan al arrancar, cierran limpio al apagar. |
| 2 | El payload del evento incluye `shipmentId`, estado, `timestamp` y datos de negocio clave. |

## D. Persistencia — 10 pts

| Pts | Criterio |
|---|---|
| 3 | ORM real contra BD real (nada de in-memory/mock). |
| 3 | Entidad del ORM está separada del modelo de dominio y un `Mapper` traduce ambos sentidos. |
| 2 | El repositorio implementa el port declarado en el dominio. |
| 2 | Campos obligatorios presentes: `id` UUID, timestamps, `metadata` como JSON/JSONB. |

## E. API y validaciones — 15 pts

| Pts | Criterio |
|---|---|
| 4 | Los 8 endpoints funcionan y responden los códigos HTTP adecuados (201, 200, 204, 400, 404, 409). |
| 3 | DTOs con validación declarativa (`class-validator`, Jakarta Validation, FluentValidation, etc.). |
| 3 | Excepciones de dominio custom (`ShipmentNotFoundException`, `InvalidShipmentException`, `EmailAlreadyExistsException`) mapeadas a códigos HTTP. |
| 5 | **Swagger / OpenAPI** disponible en `/api/docs` con schemas de request y response documentados. |

## F. Contenedores y ejecución — 10 pts

| Pts | Criterio |
|---|---|
| 4 | `docker-compose up` levanta BD y broker sin intervención manual. |
| 3 | Variables sensibles en `.env` (no hardcodeadas en el código). |
| 3 | README con pasos claros: requisitos, `docker-compose up`, cómo correr la app, URL de Swagger, URL de la UI del broker. |

## G. Calidad y entrega — 10 pts

| Pts | Criterio |
|---|---|
| 3 | Colección Postman / archivo `.http` con ejemplos de **las 4 estrategias** y al menos un caso de error. |
| 3 | Commits atómicos con mensajes claros (no un único commit "final"). |
| 2 | Sin código muerto, sin `node_modules` / `bin` / `dist` versionados, `.gitignore` correcto. |
| 2 | README con diagrama o descripción breve de la arquitectura y lista explícita de patrones aplicados. |

---

## Checklist de verificación en vivo (≈ 15 min por entrega)

Sigue este orden para auditar cada entrega:

1. **Arranque**
   - [ ] `docker-compose up -d` → BD y broker arrancan sin errores.
   - [ ] Al iniciar la app, Swagger accesible en `/api/docs`.

2. **Escenario feliz en Swagger / Postman**
   - [ ] Crear 2 customers (sender y recipient).
   - [ ] `POST /api/shipments` tipo `STANDARD` → 201, estado `DELIVERED`, `shippingCost` correcto.
   - [ ] `POST /api/shipments` tipo `EXPRESS` → 201, estado `DELIVERED`, `shippingCost` = 15 000.
   - [ ] `POST /api/shipments` tipo `INTERNATIONAL` → 201, estado `IN_CUSTOMS`, costo = 50 000 + 2 %.
   - [ ] `POST /api/shipments` tipo `THIRD_PARTY_CARRIER` → 201, estado `DELIVERED`, costo = 5 %.

3. **Escenarios de error**
   - [ ] `EXPRESS` con `metadata.weightKg = 10` → 400 con excepción custom.
   - [ ] `INTERNATIONAL` sin `metadata.destinationCountry` → 400.
   - [ ] Crear customer con email duplicado → 409.
   - [ ] `GET /api/shipments/:id` con UUID inexistente → 404.

4. **Eventos**
   - [ ] Abrir la UI del broker (Kafka-UI, RabbitMQ management, etc.): los topics `shipment.*` existen y recibieron mensajes.
   - [ ] Logs de la app: **ambos** consumers (notifications y audit) imprimieron los eventos recibidos.

5. **Auditoría de código** (grep rápido)
   - [ ] `ShippingStrategyPort` está en `domain/ports`, no en `application/` ni `infrastructure/`. Si está mal ubicado → restar pts de A.
   - [ ] El use case de shipments **no** contiene `switch (type)` ni cadenas `if (type === ...)` para instanciar estrategias. Si los tiene → restar pts de B.
   - [ ] Dentro de `domain/`, no se importan símbolos del ORM ni del cliente del broker. Si los importa → restar pts de A.
   - [ ] Ejercicio mental: agregar `DRONE_DELIVERY` debería requerir crear **una sola clase nueva** más registrarla en el módulo. Si exige modificar el use case → restar los 2 pts del OCP en B.

---

## Tabla de calificación final

| Rango | Calificación |
|---|---|
| 90 – 100 | Excelente — podría servir como nuevo proyecto de referencia. |
| 80 – 89 | Muy bien — patrones aplicados correctamente, con detalles menores. |
| 70 – 79 | Aprobado — cumple lo esencial, con áreas concretas de mejora. |
| 60 – 69 | Cerca — retroalimentar y solicitar correcciones puntuales. |
| < 60 | No aprobado — falta comprensión de al menos uno de los pilares (hexagonal, Strategy u Observer). |

---

## Señales de alarma (copy/paste del bank-api sin entender)

Si detectas alguno de estos patrones, profundiza en la entrevista con el aprendiz antes de asignar la nota final:

- Nombres, comentarios o logs que aún mencionan "transfer", "bank", "account", "cheque", etc.
- Topics con nombre `transfer.*` en lugar de `shipment.*`.
- Estrategias que copian las fórmulas del banco (0.1 % + fijo $1500, etc.) en lugar de las del reto.
- Números mágicos de la tabla del `bank-api` (3 000 000 como tope de ATM, 50 000 000 de cheque) aplicados al campo equivocado.