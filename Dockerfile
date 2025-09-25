# Imagen base: Node con versión específica y tamaño reducido
FROM node:18-alpine

# Instalar dumb-init para manejo de señales
RUN apk add --no-cache dumb-init

# Definir el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de forma optimizada para producción
RUN npm ci --only=production && npm cache clean --force

# Copiar todo el código fuente con permisos correctos
COPY --chown=node:node . .

# Cambiar a usuario con permisos limitados
USER node

# Definir variable de entorno para producción
ENV NODE_ENV=production
ENV PORT=3000

# Exponer el puerto en el que corre la app
EXPOSE 3000

# Usar dumb-init para manejo de señales y ejecutar la aplicación correcta
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
