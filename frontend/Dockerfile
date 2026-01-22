FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
# Para desenvolvimento/teste simples com 'vite preview' ou serve
# Em prod real usaria nginx, mas aqui vamos simplificar para manter o 'npm run preview' ou similar
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5173"]
