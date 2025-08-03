## Contribución

### Instalación para Desarrollo
1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm start`

### Estructura de Commits
Usar Conventional Commits:
- `feat:` nueva funcionalidad
- `fix:` corrección de bugs
- `docs:` cambios en documentación
- `style:` cambios de formato/estilo
- `refactor:` refactoring de código
- `test:` agregar o modificar tests
- `chore:` tareas de mantenimiento

### Estándares de Código
- Usar TypeScript para type safety
- Seguir las reglas de ESLint
- Componentes funcionales con hooks
- Naming conventions: PascalCase para componentes, camelCase para variables
- Comentarios en español para documentación

### Testing
- Escribir tests para componentes críticos
- Mantener cobertura de al menos 80%
- Ejecutar tests antes de hacer commit: `npm test`

### Pull Requests
1. Crear branch desde `develop`
2. Seguir el naming: `feature/nombre-funcionalidad` o `fix/nombre-bug`
3. Asegurar que pasen todos los tests
4. Solicitar review antes de merge
