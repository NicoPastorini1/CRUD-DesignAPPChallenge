# 🧩 Project Manager Dashboard

Una aplicación web desarrollada con **React + TypeScript + Supabase** para gestionar tareas asignadas a diseñadores, pensada para distintos tipos de usuarios con permisos personalizados.

## 🚀 Descripción

Este proyecto es un **CRUD de tareas** enfocado en la gestión de proyectos entre *Clientes*, *Project Managers* y *Diseñadores*. Cada rol tiene permisos distintos para visualizar, crear, asignar o modificar tareas.

Incluye:
- Autenticación de usuarios con Supabase.
- Roles personalizados (Cliente, Project Manager, Diseñador).
- CRUD de tareas con campos como título, descripción, diseñador asignado y archivos adjuntos.
- Subida de archivos y almacenamiento del nombre en la base de datos.
- Estilos modernos con `shadcn/ui` y `Tailwind CSS`.

## 📦 Funcionalidades

- 🔐 **Autenticación segura** vía Supabase.
- 👤 **Roles**:
  - Cliente: ve tareas.
  - Project Manager: crea, edita y elimina tareas.
  - Diseñador: visualiza tareas asignadas.
- 📝 **Formulario CRUD** para agregar tareas.
- 📁 **Carga de archivos adjuntos**.
- 🎨 **Interfaz moderna y responsiva**.

## 🛠️ Tecnologías

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) (Base de datos, Auth y Storage)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

## ⚙️ Instalación y uso

1. Cloná el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```
2. Instalá las dependencias:
```bash
npm install
```
3. Configurá tus variables de entorno:
```bash
VITE_SUPABASE_URL= ''
VITE_SUPABASE_ANON_KEY=''
```
4. Ejecutá la app:
```bash
npm run dev
```
🗂️ Estructura del proyecto
```
src/
├─ components/
│  └─ ui/                  # Componentes de interfaz (botones, inputs, etc)
├─ dashboard/
│  └─ crudform.tsx         # Formulario de gestión de tareas
├─ lib/
│  └─ supabase.ts          # Configuración de Supabase
└─ App.tsx / main.tsx      # Entrada de la app
```
📌 Estado actual<br>
✅ Proyecto funcional<br>
🔜 Próximas mejoras:<br>

Subida de archivos a Supabase Storage. <br>
Vista de tareas según el rol.<br>
Agregar, eliminar y editar proyectos.<br>


