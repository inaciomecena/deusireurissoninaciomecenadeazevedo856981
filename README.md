# Seletivo Fullstack - Gerenciador de Artistas e Álbuns

Projeto desenvolvido como solução para o teste técnico, implementando uma arquitetura fullstack com Java (Spring Boot) no backend e React com TypeScript no frontend, orquestrados via Docker Compose.

## Tecnologias Utilizadas

### Backend
- **Java 21** + **Spring Boot 3.2+**
- **Spring Security** + **JWT** (Autenticação Stateless)
- **Spring Data JPA** (PostgreSQL)
- **Flyway** (Migração de banco de dados)
- **MinIO** (S3 Compatible Storage para imagens)
- **Spring WebSocket** (Notificações em tempo real)
- **Bucket4j** (Rate Limiting)
- **Spring Actuator** (Health/Liveness/Readiness Checks)
- **OpenAPI/Swagger** (Documentação da API)

### Frontend
- **React** + **TypeScript** (Vite)
- **Tailwind CSS** (Estilização)
- **React Router** (Roteamento com Lazy Loading)
- **RxJS (BehaviorSubject)** (Gerenciamento de estado / Facade Pattern)
- **Axios** (Cliente HTTP com Interceptors)

### Infraestrutura
- **Docker** & **Docker Compose**
- **PostgreSQL 15**
- **MinIO**

---

## Arquitetura

A solução segue uma arquitetura em camadas clássica no backend e componentizada no frontend.

### Fluxo de Dados
1. O **Frontend** consome a API REST protegida via JWT.
2. O **Backend** processa as regras de negócio, acessa o **Banco de Dados** para metadados e o **MinIO** para arquivos (capas).
3. URLs pré-assinadas (Presigned URLs) são geradas para que o frontend carregue imagens diretamente do MinIO de forma segura e temporária.
4. Notificações de novos álbuns são enviadas via **WebSocket** para clientes conectados.

### Destaques da Implementação
- **Sincronização de Regionais**: Implementada com complexidade O(n) utilizando Maps para comparação eficiente entre dados remotos e locais.
- **Rate Limit**: Filtro customizado limitando 10 requisições/minuto por usuário.
- **Facade Pattern (Front)**: Centraliza a lógica de estado e autenticação, desacoplando componentes da API direta.

---

## Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados.

### Passos

1. **Configuração Inicial (Importante!)**:
   Antes de iniciar a aplicação, configure as variáveis de ambiente para garantir o funcionamento correto das imagens (MinIO).
   
   - **Backend**: No arquivo `.env` na raiz do projeto, ajuste o host público:
     ```env
     MINIO_PUBLIC_HOST=127.0.0.1
     ```
   
   - **Frontend**: No arquivo `frontend/.env`, defina a URL do MinIO:
     ```env
     VITE_MINIO_URL=http://127.0.0.1:9000
     ```

2. **Execução Automática (Windows)**:
   Na raiz do projeto, execute o script de inicialização:
   ```bash
   iniciar_aplicacao.bat
   ```
   *Este script irá parar containers antigos, reconstruir as imagens e iniciar todo o ambiente.*

3. **Alternativa Manual**:
   Se preferir, execute via Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Aguarde todos os containers subirem.

### Configuração de Rede (MinIO e Imagens)
*(Detalhes adicionais caso precise alterar para acesso via rede local...)*
Para garantir o carregamento correto das imagens (evitando bloqueios de CORS/ORB) ou para acessar via rede local:

1. **Backend**: No arquivo `.env` na raiz do projeto, defina o host público do MinIO:
   ```env
   MINIO_PUBLIC_HOST=127.0.0.1  # Use 127.0.0.1 para local ou seu IP de rede (ex: 192.168.x.x)
   ```

2. **Frontend**: No arquivo `frontend/.env`, defina a URL base do MinIO:
   ```env
   VITE_MINIO_URL=http://127.0.0.1:9000 # Deve corresponder ao host configurado acima
   ```

> **Nota**: Após alterar estes arquivos, reinicie os containers (`docker-compose up -d`) para aplicar as mudanças.

### Acessos
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API Swagger**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **MinIO Console**: [http://localhost:9001](http://localhost:9001) (User/Pass: `minioadmin`)

### Credenciais de Teste (Geradas automaticamente)
- **Usuário**: `admin`
- **Senha**: `123456`

---

## Funcionalidades Implementadas

### Backend
- [x] CRUD Artistas e Álbuns
- [x] Upload de capas para MinIO
- [x] Autenticação JWT (Login + Refresh)
- [x] Rate Limiting (10 req/min)
- [x] Sincronização de Regionais (Integração externa)
- [x] Documentação Swagger
- [x] WebSocket (Notificação de novos álbuns)

### Frontend
- [x] Login e Proteção de Rotas
- [x] Listagem de Artistas (Paginação, Busca, Ordenação)
- [x] Detalhes do Artista (Lista de Álbuns com Capas)
- [x] Cadastro/Edição de Artista e Álbuns
- [x] Upload de imagens
- [x] Feedback visual e responsividade

---

## Decisões de Projeto

1. **JWT com Refresh Token**: Implementado para garantir segurança com tokens de curta duração (5 min) e renovação transparente para o usuário.
2. **MinIO & Presigned URLs**: Para não sobrecarregar a API servindo binários, a API apenas gera links temporários seguros. O navegador baixa a imagem direto do Object Storage.
3. **Sincronização O(n)**: Para lidar com grandes volumes de dados na sincronização de regionais, evitou-se loops aninhados (O(n²)) usando HashMaps para lookup imediato.

---

**Autor**:

Deusireurisson Inácio Mecena de Azevedo

CPF: 856.981.051-20

Inscrição: 16364
