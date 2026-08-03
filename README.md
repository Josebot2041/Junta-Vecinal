# Junta Vecinal

Monorepo para el proyecto **Junta Vecinal**.

## Estructura del Proyecto

```
junta-vecinal/
├── frontend/          # Next.js + TypeScript + Tailwind CSS
├── backend/           # Node.js + Express + PostgreSQL
├── package.json       # Root – npm workspaces
└── .gitignore
```

## Requisitos Previos

- **Node.js** >= 18
- **npm** >= 9
- **PostgreSQL** >= 14

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm run install:all
```

### 2. Configurar la base de datos

1. Crea una base de datos en PostgreSQL:

```sql
CREATE DATABASE junta_vecinal;
```

2. Copia el archivo de entorno y configura tus credenciales:

```bash
cp backend/.env.example backend/.env
```

3. Edita `backend/.env` con tus datos de conexión.

### 3. Ejecutar en desarrollo

```bash
# Ambos servicios en paralelo
npm run dev

# Solo frontend (http://localhost:3000)
npm run dev:frontend

# Solo backend (http://localhost:5000)
npm run dev:backend
```

## API Endpoints

| Método | Ruta          | Descripción                        |
|--------|---------------|------------------------------------|
| GET    | `/api`        | Información de la API              |
| GET    | `/api/health` | Health check + estado de la BD     |

## Tecnologías

| Capa       | Stack                                  |
|------------|----------------------------------------|
| Frontend   | Next.js, TypeScript, Tailwind CSS      |
| Backend    | Node.js, Express                       |
| Base de datos | PostgreSQL (via `pg`)               |
