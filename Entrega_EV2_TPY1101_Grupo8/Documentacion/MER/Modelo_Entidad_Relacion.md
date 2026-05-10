# Modelo Entidad Relacion
Entidades principales:
- users
- profiles
- service_listings
- service_requests
- reviews
- comments
- reports
- email_verification_tokens
- password_reset_tokens

Relaciones:
- user con profile uno a uno.
- user con service_listings uno a muchos.
- service_listings con service_requests uno a muchos.
- service_requests con reviews uno a uno.
- user y service_listings relacionados con reports.
