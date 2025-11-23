# 📜 Scripts de Desarrollo - BurbujaApp

Documentación completa de todos los scripts PowerShell para desarrollo.

## 🎯 Script Maestro: `setup-full-dev.ps1`

**El comando único para iniciar todo el ambiente.**

### Uso

```powershell
npm run setup:dev [opciones]
```

### Opciones

| Opción | Función | Ejemplo |
|--------|---------|---------|
| `-SkipInstall` | No instala dependencias | `npm run setup:dev -SkipInstall` |
| `-SkipMock` | No inicia json-server | `npm run setup:dev -SkipMock` |
| `-AndroidOnly` | Solo emulador Android | `npm run setup:dev -AndroidOnly` |
| `-ClearCache` | Limpia caché de Metro y Expo | `npm run setup:dev -ClearCache` |

### Pasos que ejecuta

1. ✅ **Verificar Node.js & npm** (requisito obligatorio)
2. ✅ **Validar configuración** (app.json, package.json, db.json)
3. ✅ **Limpiar caché** (opcional con `-ClearCache`)
4. ✅ **Instalar dependencias** (opcional con `-SkipInstall`)
5. ✅ **Detectar puerto disponible** para json-server
6. ✅ **Iniciar json-server** en background
7. ✅ **Iniciar Expo** para desarrollo

### Ejemplos

```powershell
# Setup inicial completo (primera vez)
npm run setup:dev

# Setup rápido (sin reinstalar deps)
npm run setup:dev -SkipInstall

# Solo código, sin mock
npm run setup:dev -SkipInstall -SkipMock

# Limpiar cache
npm run setup:dev -SkipInstall -ClearCache

# Solo Android
npm run setup:dev -SkipInstall -AndroidOnly
```

---

## 🎛️ Control de Servicios: `dev-services.ps1`

**Para controlar json-server y Expo independientemente.**

### Uso

```powershell
npm run dev:[comando]:[target]
```

### Comandos

#### JSON-Server (Mock API)

```powershell
npm run dev:api:start        # Iniciar json-server
npm run dev:api:stop         # Detener json-server
npm run dev:api:restart      # Reiniciar json-server
npm run dev:api:status       # Ver estado de json-server
```

#### Expo

```powershell
npm run dev               # Ver estado de TODO
npm run dev:stop          # Detener TODO
npm run dev:restart       # Reiniciar TODO
npm run dev:status        # Ver estado de TODO
```

### Ejemplos prácticos

```powershell
# Verificar si json-server está corriendo
npm run dev:api:status

# Reiniciar json-server después de editar db.json
npm run dev:api:restart

# Ver estado de todo
npm run dev:status

# Detener todo
npm run dev:stop
```

---

## 🔍 Verificar Entorno: `check-environment.ps1`

**Diagnostica el entorno de desarrollo.**

### Uso

```powershell
npm run check-env
```

### Verifica

- ✅ Node.js instalado
- ✅ npm instalado  
- ✅ EAS CLI (opcional)
- ✅ Configuración de Expo
- ✅ Dependencias críticas
- ✅ Archivos de configuración

### Salida

```
🔧 Verificando entorno de BurbujaApp...

✅ Node.js v18.17.0
✅ npm 9.6.7
⚠️  EAS CLI no instalado (opcional)

📱 Configuración de la app:
   Nombre: BurbujaApp
   Slug: burbujaapp
   Versión: 1.0.0

📦 Dependencias críticas:
   ✅ Expo SDK: ~53.0.20
   ✅ React Native: 0.79.5

🚀 COMANDOS DE DESARROLLO:
   1️⃣  Setup completo
       npm run setup:dev
   
   2️⃣  Iniciar servicios
       npm run dev
   
   [... más comandos ...]
```

---

## 🧹 Limpiar y Reiniciar: `clean-start.ps1`

**Limpia cache y reinicia Expo.**

### Uso

```powershell
npm run clean-start
```

### Qué hace

1. Detiene procesos de Expo activos
2. Limpia caché de Metro
3. Limpia caché de Expo
4. Reinicia Expo con opciones limpias

### Cuándo usar

- Cambios de configuración de Babel
- Cache corrupto
- Metro no refresca
- Comportamientos extraños

---

## 📊 Flujo de Trabajo Recomendado

### Primera vez (Setup completo)

```powershell
npm run check-env          # Verificar que todo está bien
npm run setup:dev          # Instala todo e inicia servicios
```

### Siguiente día (inicio rápido)

```powershell
npm run setup:dev -SkipInstall
```

### Editar datos del mock

```powershell
# 1. Editar db.json
# 2. Reiniciar json-server
npm run dev:api:restart

# 3. Recargar app en Expo (presiona 'r')
```

### Si algo falla

```powershell
npm run clean-start
```

### Si el puerto está ocupado

El script lo detecta automáticamente y usa puerto alternativo.

---

## 🛠️ Archivos Relacionados

### Scripts PowerShell

```
scripts/
├── setup-full-dev.ps1     ⭐ Script maestro
├── dev-services.ps1       ⭐ Control de servicios
├── check-environment.ps1  🔍 Verificar entorno
└── clean-start.ps1        🧹 Limpiar cache
```

### Configuración

```
├── app.json                # Configuración de Expo
├── package.json            # Dependencias
├── db.json                 # Datos del mock
├── metro.config.js         # Metro bundler
└── babel.config.js         # Babel
```

### Documentación

```
docs/
├── Quick-Start.md          # Guía rápida ⭐ LEER PRIMERO
├── Arquitectura-Desarrollo.md  # Detalles técnicos
├── Guia-Ambiente-Desarrollo.md # Setup manual
└── Notificaciones-SDK53.md     # Notificaciones push
```

---

## 🔄 Variables de Entorno Configuradas

El script maestro configura automáticamente:

```powershell
$env:EXPO_NO_CACHE = "1"        # Desabilita cache de Expo
$env:METRO_NO_CACHE = "1"       # Desabilita cache de Metro
$env:MOCK_API_PORT = 3001       # Puerto de json-server (o alternativo)
```

Estas variables están disponibles para la app y pueden usarse así:

```typescript
const API_PORT = process.env.MOCK_API_PORT || 3001;
const API_URL = `http://localhost:${API_PORT}`;
```

---

## ❌ Troubleshooting

### Problema: "PowerShell no reconoce npm"

**Solución:** Instala Node.js desde https://nodejs.org/

### Problema: Puerto 3001 en uso

**Solución:** El script lo detecta y usa 3002-3010 automáticamente.

### Problema: Script no ejecuta

**Causa:** Política de ejecución restringida en PowerShell

**Solución:** El script ya incluye `-ExecutionPolicy Bypass` en los comandos npm.

### Problema: json-server falla

**Solución:** 
```powershell
npm run dev:api:restart
```

### Problema: Expo no refresca cambios

**Solución:**
```powershell
npm run clean-start
```

### Problema: Dependencies no instalan

**Solución:**
```powershell
rm -r node_modules
npm install
npm run setup:dev -SkipInstall
```

---

## 📚 Enlaces Útiles

- **Expo Documentation:** https://docs.expo.dev/
- **JSON Server:** https://github.com/typicode/json-server
- **React Native:** https://reactnative.dev/
- **PowerShell Docs:** https://learn.microsoft.com/en-us/powershell/

---

## 💡 Tips Pro

1. **Abre dos PowerShell:**
   - Una para `setup:dev`
   - Otra para comandos

2. **Usa `npm run dev:api:status`** para diagnosticar

3. **Edita `db.json` directamente** para cambiar datos

4. **Presiona 'r' en Expo** para hot reload

5. **Usa `-ClearCache`** si hay problemas

---

## 🤝 Contribuciones

Para mejorar los scripts:

1. Prueba cambios localmente
2. Documentar nuevas opciones
3. Mantener compatibilidad
4. Actualizar esta documentación

---

**Última actualización:** Noviembre 2025
**Versión:** 2.0 (Unified Development Environment)
