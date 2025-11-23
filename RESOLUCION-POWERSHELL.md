# Resolucion: Error de Politica de Ejecucion en PowerShell

## Problema Original

```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running 
scripts is disabled on this system.
```

## Causa

La política de ejecución de PowerShell estaba restringida, impidiendo ejecutar scripts.

## Solucion Aplicada

Se creó un **script simplificado** (`setup-dev-simple.ps1`) que:
- ✅ Es más confiable y predecible
- ✅ Evita problemas de políticas de ejecución
- ✅ Funciona directamente desde npm scripts
- ✅ Maneja todos los parámetros correctamente

## Cambios Realizados

### 1. Nuevo Script
**Archivo:** `scripts/setup-dev-simple.ps1`
- Versión limpia sin caracteres especiales
- Manejo de parámetros correcto
- Detección de puertos mejorada
- Gestión de procesos de background

### 2. Archivo Batch
**Archivo:** `setup-dev.bat` (opcional, para uso directo)
- Envolvente para ejecutar desde cmd.exe
- No requerido si usas npm scripts

### 3. Package.json Actualizado
Todos los scripts ahora usan el nuevo `setup-dev-simple.ps1`:

```json
"setup:dev": "powershell -ExecutionPolicy Bypass -File scripts/setup-dev-simple.ps1"
"setup:dev:skip-install": "powershell -ExecutionPolicy Bypass -File scripts/setup-dev-simple.ps1 -SkipInstall"
"setup:dev:clean": "powershell -ExecutionPolicy Bypass -File scripts/setup-dev-simple.ps1 -ClearCache"
```

## Como Usar Ahora

### Setup Completo
```powershell
npm run setup:dev
```

### Setup Rapido
```powershell
npm run setup:dev:skip-install
```

### Opciones
```powershell
npm run setup:dev:skip-install      # Sin reinstalar deps
npm run setup:dev:no-mock           # Sin mock API
npm run setup:dev:clean             # Limpia cache
npm run setup:dev:android           # Solo Android
```

## Prueba Exitosa

Se ejecutó exitosamente:
```
$ npm run setup:dev:skip-install

=== PASO 1: VERIFICAR ENTORNO ===
OK - Node.js: v25.2.1
OK - npm: 11.6.2

=== PASO 2: VALIDAR ARCHIVOS ===
OK - app.json
OK - package.json
OK - db.json
OK - metro.config.js

=== PASO 5: DETECTANDO PUERTO ===
OK - Puerto 3001 disponible

=== PASO 6: INICIANDO SERVICIOS ===
Iniciando json-server en puerto 3001...
OK - json-server iniciado
Iniciando Expo...
```

## Diagnostico

Verifica que todo esta bien:
```powershell
npm run check-env
```

## Proximos Pasos

1. Ejecuta el setup:
   ```powershell
   npm run setup:dev:skip-install
   ```

2. Selecciona tu plataforma en Expo:
   - `a` = Android
   - `i` = iOS
   - `w` = Web
   - `r` = Recargar
   - `q` = Salir

3. ¡A programar!

## Notas Tecnicas

- El script ahora usa `-ExecutionPolicy Bypass` en cada ejecucion
- No requiere cambios permanentes en la politica del sistema
- Compatible con Windows 10+ y PowerShell 5.1
- Totalmente automatizado

---

**Estado:** RESUELTO  
**Fecha:** Noviembre 22, 2025
