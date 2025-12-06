<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = \App\Models\User::role('superadmin')->first();

        $arquitetura = \App\Models\Tag::where('slug', 'arquitetura')->first();
        $frontend = \App\Models\Tag::where('slug', 'frontend')->first();
        $backend = \App\Models\Tag::where('slug', 'backend')->first();
        $performance = \App\Models\Tag::where('slug', 'performance')->first();
        $devops = \App\Models\Tag::where('slug', 'devops')->first();
        $typescript = \App\Models\Tag::where('slug', 'typescript')->first();
        $react = \App\Models\Tag::where('slug', 'react')->first();
        $distribuidos = \App\Models\Tag::where('slug', 'sistemas-distribuidos')->first();

        $posts = [
            [
                'title' => 'Design de Sistemas Distribuídos: Patterns e Anti-patterns',
                'slug' => 'design-sistemas-distribuidos-patterns-anti-patterns',
                'content' => "# Design de Sistemas Distribuídos\n\nSistemas distribuídos são complexos por natureza. Neste artigo, vamos explorar os principais patterns e anti-patterns.\n\n## Patterns Essenciais\n\n### 1. Circuit Breaker\n\nO pattern Circuit Breaker previne cascatas de falhas em sistemas distribuídos.\n\n```typescript\nclass CircuitBreaker {\n  private failures = 0;\n  private state = 'CLOSED';\n  \n  async execute(operation: () => Promise<any>) {\n    if (this.state === 'OPEN') {\n      throw new Error('Circuit breaker is open');\n    }\n    \n    try {\n      const result = await operation();\n      this.onSuccess();\n      return result;\n    } catch (error) {\n      this.onFailure();\n      throw error;\n    }\n  }\n}\n```\n\n### 2. Saga Pattern\n\nPara transações distribuídas, o Saga Pattern é essencial.\n\n## Anti-patterns\n\n- Distributed Monolith\n- Chatty Communication\n- Tight Coupling\n\n## Conclusão\n\nEntender esses patterns é fundamental para construir sistemas robustos e escaláveis.",
                'excerpt' => 'Explorando os principais patterns e anti-patterns em sistemas distribuídos modernos.',
                'status' => 'published',
                'published_at' => now()->subDays(10),
                'author_id' => $admin->id,
                'reading_time' => 8,
                'tags' => [$arquitetura->id, $distribuidos->id, $backend->id],
            ],
            [
                'title' => 'Event Sourcing: Implementação Prática com TypeScript',
                'slug' => 'event-sourcing-implementacao-pratica-typescript',
                'content' => "# Event Sourcing com TypeScript\n\nEvent Sourcing é um pattern arquitetural onde mudanças de estado são armazenadas como sequência de eventos.\n\n## Implementação Básica\n\n```typescript\ninterface Event {\n  type: string;\n  timestamp: Date;\n  data: any;\n}\n\nclass EventStore {\n  private events: Event[] = [];\n  \n  append(event: Event): void {\n    this.events.push(event);\n  }\n  \n  getEvents(aggregateId: string): Event[] {\n    return this.events.filter(e => e.data.aggregateId === aggregateId);\n  }\n  \n  replay(events: Event[]): any {\n    return events.reduce((state, event) => {\n      return this.applyEvent(state, event);\n    }, {});\n  }\n}\n```\n\n## Vantagens\n\n- Auditoria completa\n- Time travel debugging\n- Event replay\n\n## Desvantagens\n\n- Complexidade adicional\n- Eventual consistency\n- Storage overhead",
                'excerpt' => 'Como implementar Event Sourcing usando TypeScript na prática.',
                'status' => 'published',
                'published_at' => now()->subDays(8),
                'author_id' => $admin->id,
                'reading_time' => 10,
                'tags' => [$arquitetura->id, $typescript->id, $backend->id],
            ],
            [
                'title' => 'Micro-frontends: Quando Usar e Quando Evitar',
                'slug' => 'micro-frontends-quando-usar-quando-evitar',
                'content' => "# Micro-frontends\n\nMicro-frontends aplicam os conceitos de microservices ao frontend.\n\n## Quando Usar\n\n- Equipes grandes e independentes\n- Diferentes tecnologias por feature\n- Deploy independente necessário\n\n## Quando Evitar\n\n- Aplicações pequenas\n- Equipe única\n- Performance crítica\n\n## Implementação com Module Federation\n\n```typescript\n// webpack.config.js\nconst ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');\n\nmodule.exports = {\n  plugins: [\n    new ModuleFederationPlugin({\n      name: 'app1',\n      filename: 'remoteEntry.js',\n      exposes: {\n        './Component': './src/Component',\n      },\n      shared: ['react', 'react-dom'],\n    }),\n  ],\n};\n```",
                'excerpt' => 'Análise detalhada sobre quando adotar arquitetura de micro-frontends.',
                'status' => 'published',
                'published_at' => now()->subDays(6),
                'author_id' => $admin->id,
                'reading_time' => 7,
                'tags' => [$arquitetura->id, $frontend->id, $typescript->id],
            ],
            [
                'title' => 'Otimização de Performance em React: Além do useMemo',
                'slug' => 'otimizacao-performance-react-alem-usememo',
                'content' => "# Performance em React\n\nuseMemo é apenas o começo. Vamos além.\n\n## 1. Code Splitting\n\n```typescript\nconst HeavyComponent = lazy(() => import('./HeavyComponent'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<Loading />}>\n      <HeavyComponent />\n    </Suspense>\n  );\n}\n```\n\n## 2. Virtualization\n\n```typescript\nimport { FixedSizeList } from 'react-window';\n\nconst Row = ({ index, style }) => (\n  <div style={style}>Row {index}</div>\n);\n\nconst List = () => (\n  <FixedSizeList\n    height={600}\n    itemCount={10000}\n    itemSize={35}\n    width='100%'\n  >\n    {Row}\n  </FixedSizeList>\n);\n```\n\n## 3. Concurrent Features\n\nUse useTransition e useDeferredValue para priorizar updates.",
                'excerpt' => 'Técnicas avançadas de otimização além dos hooks básicos de memoization.',
                'status' => 'published',
                'published_at' => now()->subDays(4),
                'author_id' => $admin->id,
                'reading_time' => 6,
                'tags' => [$react->id, $performance->id, $frontend->id],
            ],
            [
                'title' => 'Arquitetura Hexagonal: Clean Architecture na Prática',
                'slug' => 'arquitetura-hexagonal-clean-architecture-pratica',
                'content' => "# Arquitetura Hexagonal\n\nTambém conhecida como Ports and Adapters.\n\n## Estrutura\n\n```\nsrc/\n  domain/\n    entities/\n    use-cases/\n  application/\n    ports/\n    services/\n  infrastructure/\n    adapters/\n    repositories/\n```\n\n## Exemplo Prático\n\n```typescript\n// Domain\nclass User {\n  constructor(\n    public id: string,\n    public name: string,\n    public email: string\n  ) {}\n}\n\n// Port\ninterface UserRepository {\n  save(user: User): Promise<void>;\n  findById(id: string): Promise<User>;\n}\n\n// Adapter\nclass PostgresUserRepository implements UserRepository {\n  async save(user: User): Promise<void> {\n    await db.query('INSERT INTO users...');\n  }\n  \n  async findById(id: string): Promise<User> {\n    const row = await db.query('SELECT * FROM users WHERE id = $1', [id]);\n    return new User(row.id, row.name, row.email);\n  }\n}\n```",
                'excerpt' => 'Implementando Clean Architecture com Hexagonal Architecture.',
                'status' => 'published',
                'published_at' => now()->subDays(2),
                'author_id' => $admin->id,
                'reading_time' => 9,
                'tags' => [$arquitetura->id, $backend->id, $typescript->id],
            ],
            [
                'title' => 'WebSockets vs Server-Sent Events: Escolhendo a Tecnologia Certa',
                'slug' => 'websockets-vs-server-sent-events',
                'content' => "# WebSockets vs SSE\n\n## WebSockets\n\nComunicação bidirecional full-duplex.\n\n```typescript\nconst ws = new WebSocket('ws://localhost:3000');\n\nws.onopen = () => {\n  ws.send('Hello Server');\n};\n\nws.onmessage = (event) => {\n  console.log('Message:', event.data);\n};\n```\n\n## Server-Sent Events\n\nComunicação unidirecional do servidor para cliente.\n\n```typescript\nconst eventSource = new EventSource('/events');\n\neventSource.onmessage = (event) => {\n  console.log('New message:', event.data);\n};\n```\n\n## Quando usar cada um\n\n- **WebSockets**: Chat, jogos, colaboração em tempo real\n- **SSE**: Notificações, feeds, updates unidirecionais",
                'excerpt' => 'Comparação prática entre WebSockets e Server-Sent Events.',
                'status' => 'published',
                'published_at' => now()->subDay(),
                'author_id' => $admin->id,
                'reading_time' => 5,
                'tags' => [$backend->id, $frontend->id, $typescript->id],
            ],
            [
                'title' => 'Database Sharding: Estratégias e Trade-offs',
                'slug' => 'database-sharding-estrategias-tradeoffs',
                'content' => "# Database Sharding\n\nSharding é a técnica de particionar dados horizontalmente.\n\n## Estratégias\n\n### 1. Range-based Sharding\n\n```sql\n-- Shard 1: IDs 1-1000\n-- Shard 2: IDs 1001-2000\n```\n\n### 2. Hash-based Sharding\n\n```typescript\nfunction getShard(userId: string): number {\n  const hash = hashFunction(userId);\n  return hash % numberOfShards;\n}\n```\n\n### 3. Geographic Sharding\n\nDados por região geográfica.\n\n## Trade-offs\n\n**Vantagens:**\n- Escalabilidade horizontal\n- Performance melhorada\n\n**Desvantagens:**\n- Complexidade operacional\n- Joins complexos\n- Rebalanceamento difícil",
                'excerpt' => 'Explorando estratégias de sharding e seus trade-offs.',
                'status' => 'published',
                'published_at' => now()->subHours(12),
                'author_id' => $admin->id,
                'reading_time' => 8,
                'tags' => [$backend->id, $arquitetura->id, $distribuidos->id],
            ],
            [
                'title' => 'CI/CD: Pipeline Eficiente para Aplicações Modernas',
                'slug' => 'cicd-pipeline-eficiente-aplicacoes-modernas',
                'content' => "# CI/CD Pipeline\n\n## Estrutura do Pipeline\n\n```yaml\nname: CI/CD Pipeline\n\non:\n  push:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - name: Run tests\n        run: npm test\n      \n  build:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - name: Build\n        run: npm run build\n      \n  deploy:\n    needs: build\n    runs-on: ubuntu-latest\n    steps:\n      - name: Deploy\n        run: ./deploy.sh\n```\n\n## Best Practices\n\n1. Testes em paralelo\n2. Cache de dependências\n3. Deploy progressivo\n4. Rollback automático\n5. Monitoramento contínuo",
                'excerpt' => 'Como construir pipelines CI/CD eficientes e confiáveis.',
                'status' => 'published',
                'published_at' => now()->subHours(6),
                'author_id' => $admin->id,
                'reading_time' => 7,
                'tags' => [$devops->id, $backend->id],
            ],
            [
                'title' => 'GraphQL vs REST: Comparação Técnica Detalhada',
                'slug' => 'graphql-vs-rest-comparacao-tecnica',
                'content' => "# GraphQL vs REST\n\n## REST API\n\n```typescript\nGET /api/users/1\nGET /api/users/1/posts\nGET /api/users/1/comments\n```\n\n## GraphQL\n\n```graphql\nquery {\n  user(id: 1) {\n    name\n    posts {\n      title\n    }\n    comments {\n      content\n    }\n  }\n}\n```\n\n## Vantagens GraphQL\n\n- Busca precisa de dados\n- Único endpoint\n- Type safety\n- Documentação automática\n\n## Quando usar REST\n\n- APIs públicas simples\n- Cache HTTP nativo\n- Equipe sem experiência GraphQL",
                'excerpt' => 'Análise técnica comparando GraphQL e REST APIs.',
                'status' => 'published',
                'published_at' => now()->subDays(15),
                'author_id' => $admin->id,
                'reading_time' => 6,
                'tags' => [$backend->id, $typescript->id],
            ],
            [
                'title' => 'Testes de Integração com Docker e Testcontainers',
                'slug' => 'testes-integracao-docker-testcontainers',
                'content' => "# Testcontainers\n\n## Setup\n\n```typescript\nimport { GenericContainer } from 'testcontainers';\n\nlet container;\n\nbeforeAll(async () => {\n  container = await new GenericContainer('postgres:14')\n    .withExposedPorts(5432)\n    .withEnv('POSTGRES_PASSWORD', 'test')\n    .start();\n});\n\nafterAll(async () => {\n  await container.stop();\n});\n\ntest('should save user', async () => {\n  const repo = new UserRepository(container.getConnectionString());\n  await repo.save(user);\n  const found = await repo.findById(user.id);\n  expect(found).toEqual(user);\n});\n```\n\n## Benefícios\n\n- Ambiente isolado\n- Testes confiáveis\n- CI/CD friendly",
                'excerpt' => 'Como criar testes de integração robustos com Testcontainers.',
                'status' => 'published',
                'published_at' => now()->subDays(14),
                'author_id' => $admin->id,
                'reading_time' => 8,
                'tags' => [$devops->id, $backend->id],
            ],
            [
                'title' => 'State Management em React: Zustand vs Redux',
                'slug' => 'state-management-react-zustand-redux',
                'content' => "# Zustand vs Redux\n\n## Zustand\n\n```typescript\nimport create from 'zustand';\n\nconst useStore = create((set) => ({\n  count: 0,\n  increment: () => set((state) => ({ count: state.count + 1 })),\n}));\n\nfunction Counter() {\n  const { count, increment } = useStore();\n  return <button onClick={increment}>{count}</button>;\n}\n```\n\n## Redux Toolkit\n\n```typescript\nimport { createSlice, configureStore } from '@reduxjs/toolkit';\n\nconst counterSlice = createSlice({\n  name: 'counter',\n  initialState: { value: 0 },\n  reducers: {\n    increment: (state) => { state.value += 1 },\n  },\n});\n```\n\n## Quando usar cada um\n\n- **Zustand**: Apps pequenos/médios, simplicidade\n- **Redux**: Apps grandes, DevTools, middleware complexo",
                'excerpt' => 'Comparação prática entre Zustand e Redux para gerenciamento de estado.',
                'status' => 'published',
                'published_at' => now()->subDays(13),
                'author_id' => $admin->id,
                'reading_time' => 7,
                'tags' => [$react->id, $frontend->id, $typescript->id],
            ],
            [
                'title' => 'Autenticação JWT: Implementação Segura',
                'slug' => 'autenticacao-jwt-implementacao-segura',
                'content' => "# JWT Authentication\n\n## Gerando Token\n\n```typescript\nimport jwt from 'jsonwebtoken';\n\nconst token = jwt.sign(\n  { userId: user.id, role: user.role },\n  process.env.JWT_SECRET,\n  { expiresIn: '1h' }\n);\n```\n\n## Validando Token\n\n```typescript\nconst verifyToken = (token: string) => {\n  try {\n    return jwt.verify(token, process.env.JWT_SECRET);\n  } catch (error) {\n    throw new UnauthorizedError('Invalid token');\n  }\n};\n```\n\n## Best Practices\n\n1. HTTPS obrigatório\n2. Refresh tokens\n3. Token rotation\n4. Blacklist de tokens\n5. Claims mínimos necessários",
                'excerpt' => 'Implementando autenticação JWT de forma segura e eficiente.',
                'status' => 'published',
                'published_at' => now()->subDays(12),
                'author_id' => $admin->id,
                'reading_time' => 9,
                'tags' => [$backend->id, $typescript->id],
            ],
            [
                'title' => 'Monitoramento com OpenTelemetry e Observabilidade',
                'slug' => 'monitoramento-opentelemetry-observabilidade',
                'content' => "# OpenTelemetry\n\n## Traces\n\n```typescript\nimport { trace } from '@opentelemetry/api';\n\nconst tracer = trace.getTracer('my-service');\n\nasync function processOrder(orderId: string) {\n  const span = tracer.startSpan('process-order');\n  \n  try {\n    await validateOrder(orderId);\n    await chargePayment(orderId);\n    await shipOrder(orderId);\n    span.setStatus({ code: SpanStatusCode.OK });\n  } catch (error) {\n    span.setStatus({ code: SpanStatusCode.ERROR });\n    throw error;\n  } finally {\n    span.end();\n  }\n}\n```\n\n## Métricas\n\n```typescript\nconst meter = metrics.getMeter('my-service');\nconst requestCounter = meter.createCounter('http_requests_total');\n\nrequestCounter.add(1, { route: '/api/users', method: 'GET' });\n```",
                'excerpt' => 'Implementando observabilidade com OpenTelemetry.',
                'status' => 'published',
                'published_at' => now()->subDays(11),
                'author_id' => $admin->id,
                'reading_time' => 10,
                'tags' => [$devops->id, $backend->id],
            ],
            [
                'title' => 'Server-Side Rendering com React e Next.js',
                'slug' => 'server-side-rendering-react-nextjs',
                'content' => "# SSR com Next.js\n\n## getServerSideProps\n\n```typescript\nexport async function getServerSideProps(context) {\n  const res = await fetch(`https://api.example.com/posts/\${context.params.id}`);\n  const post = await res.json();\n\n  return {\n    props: { post },\n  };\n}\n\nexport default function Post({ post }) {\n  return <article>{post.title}</article>;\n}\n```\n\n## Static Generation\n\n```typescript\nexport async function getStaticProps() {\n  const posts = await fetchPosts();\n  return { props: { posts }, revalidate: 60 };\n}\n\nexport async function getStaticPaths() {\n  const posts = await fetchPosts();\n  return {\n    paths: posts.map(post => ({ params: { id: post.id } })),\n    fallback: 'blocking',\n  };\n}\n```",
                'excerpt' => 'Entendendo SSR e Static Generation com Next.js.',
                'status' => 'published',
                'published_at' => now()->subDays(9),
                'author_id' => $admin->id,
                'reading_time' => 8,
                'tags' => [$react->id, $frontend->id, $performance->id],
            ],
            [
                'title' => 'Rate Limiting e Throttling em APIs',
                'slug' => 'rate-limiting-throttling-apis',
                'content' => "# Rate Limiting\n\n## Token Bucket Algorithm\n\n```typescript\nclass TokenBucket {\n  private tokens: number;\n  private lastRefill: number;\n  \n  constructor(\n    private capacity: number,\n    private refillRate: number\n  ) {\n    this.tokens = capacity;\n    this.lastRefill = Date.now();\n  }\n  \n  consume(tokens = 1): boolean {\n    this.refill();\n    \n    if (this.tokens >= tokens) {\n      this.tokens -= tokens;\n      return true;\n    }\n    return false;\n  }\n  \n  private refill() {\n    const now = Date.now();\n    const elapsed = now - this.lastRefill;\n    const tokensToAdd = (elapsed / 1000) * this.refillRate;\n    \n    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);\n    this.lastRefill = now;\n  }\n}\n```",
                'excerpt' => 'Implementando rate limiting eficiente em APIs REST.',
                'status' => 'published',
                'published_at' => now()->subDays(7),
                'author_id' => $admin->id,
                'reading_time' => 6,
                'tags' => [$backend->id, $arquitetura->id],
            ],
            [
                'title' => 'CSS-in-JS: Styled Components vs Tailwind CSS',
                'slug' => 'css-in-js-styled-components-tailwind',
                'content' => "# CSS Solutions\n\n## Styled Components\n\n```typescript\nimport styled from 'styled-components';\n\nconst Button = styled.button<{ primary?: boolean }>`\n  background: \${props => props.primary ? '#FF4800' : 'white'};\n  color: \${props => props.primary ? 'white' : '#FF4800'};\n  padding: 0.5rem 1rem;\n  border-radius: 4px;\n  \n  &:hover {\n    opacity: 0.9;\n  }\n`;\n```\n\n## Tailwind CSS\n\n```tsx\nfunction Button({ primary, children }) {\n  return (\n    <button className={`px-4 py-2 rounded \${\n      primary ? 'bg-primary text-white' : 'bg-white text-primary'\n    } hover:opacity-90`}>\n      {children}\n    </button>\n  );\n}\n```\n\n## Trade-offs\n\n**Styled Components:**\n- Type safety\n- Componentes dinâmicos\n- Runtime overhead\n\n**Tailwind:**\n- Build time\n- Utility-first\n- Bundle menor",
                'excerpt' => 'Comparando abordagens modernas de estilização em React.',
                'status' => 'published',
                'published_at' => now()->subDays(5),
                'author_id' => $admin->id,
                'reading_time' => 5,
                'tags' => [$frontend->id, $react->id],
            ],
            [
                'title' => 'Message Queues: RabbitMQ vs Apache Kafka',
                'slug' => 'message-queues-rabbitmq-kafka',
                'content' => "# Message Queues\n\n## RabbitMQ\n\n```typescript\nimport amqp from 'amqplib';\n\nconst connection = await amqp.connect('amqp://localhost');\nconst channel = await connection.createChannel();\n\nawait channel.assertQueue('tasks');\nawait channel.sendToQueue('tasks', Buffer.from('task data'));\n\nchannel.consume('tasks', (msg) => {\n  console.log('Received:', msg.content.toString());\n  channel.ack(msg);\n});\n```\n\n## Apache Kafka\n\n```typescript\nimport { Kafka } from 'kafkajs';\n\nconst kafka = new Kafka({ brokers: ['localhost:9092'] });\nconst producer = kafka.producer();\n\nawait producer.send({\n  topic: 'events',\n  messages: [{ value: 'event data' }],\n});\n```\n\n## Escolhendo\n\n- **RabbitMQ**: Task queues, routing complexo\n- **Kafka**: Event streaming, alta throughput",
                'excerpt' => 'Comparação entre RabbitMQ e Kafka para mensageria.',
                'status' => 'published',
                'published_at' => now()->subDays(3),
                'author_id' => $admin->id,
                'reading_time' => 9,
                'tags' => [$backend->id, $arquitetura->id, $distribuidos->id],
            ],
            [
                'title' => 'API Versioning: Estratégias e Best Practices',
                'slug' => 'api-versioning-estrategias-best-practices',
                'content' => "# API Versioning\n\n## URL Versioning\n\n```typescript\napp.get('/api/v1/users', v1UsersHandler);\napp.get('/api/v2/users', v2UsersHandler);\n```\n\n## Header Versioning\n\n```typescript\napp.get('/api/users', (req, res) => {\n  const version = req.headers['api-version'] || '1';\n  \n  if (version === '2') {\n    return v2UsersHandler(req, res);\n  }\n  return v1UsersHandler(req, res);\n});\n```\n\n## Content Negotiation\n\n```typescript\naccept: application/vnd.api.v2+json\n```\n\n## Recomendações\n\n1. Versione desde o início\n2. Mantenha backward compatibility\n3. Documente breaking changes\n4. Sunset policy clara",
                'excerpt' => 'Estratégias para versionamento de APIs REST.',
                'status' => 'draft',
                'published_at' => null,
                'author_id' => $admin->id,
                'reading_time' => 6,
                'tags' => [$backend->id, $arquitetura->id],
            ],
            [
                'title' => 'Docker Multi-stage Builds para Aplicações Node.js',
                'slug' => 'docker-multi-stage-builds-nodejs',
                'content' => "# Multi-stage Builds\n\n## Dockerfile Otimizado\n\n```dockerfile\n# Build stage\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Production stage\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY --from=builder /app/dist ./dist\n\nUSER node\nEXPOSE 3000\nCMD [\"node\", \"dist/index.js\"]\n```\n\n## Benefícios\n\n- Imagem final menor\n- Camadas otimizadas\n- Build cache eficiente\n- Separação build/runtime",
                'excerpt' => 'Otimizando imagens Docker com multi-stage builds.',
                'status' => 'draft',
                'published_at' => null,
                'author_id' => $admin->id,
                'reading_time' => 5,
                'tags' => [$devops->id, $backend->id],
            ],
            [
                'title' => 'Design Patterns em TypeScript: Factory e Builder',
                'slug' => 'design-patterns-typescript-factory-builder',
                'content' => "# Design Patterns\n\n## Factory Pattern\n\n```typescript\ninterface Vehicle {\n  drive(): void;\n}\n\nclass Car implements Vehicle {\n  drive() { console.log('Driving car'); }\n}\n\nclass Bike implements Vehicle {\n  drive() { console.log('Riding bike'); }\n}\n\nclass VehicleFactory {\n  static create(type: string): Vehicle {\n    switch(type) {\n      case 'car': return new Car();\n      case 'bike': return new Bike();\n      default: throw new Error('Unknown type');\n    }\n  }\n}\n```\n\n## Builder Pattern\n\n```typescript\nclass UserBuilder {\n  private user = {};\n  \n  withName(name: string) {\n    this.user.name = name;\n    return this;\n  }\n  \n  withEmail(email: string) {\n    this.user.email = email;\n    return this;\n  }\n  \n  build() {\n    return new User(this.user);\n  }\n}\n```",
                'excerpt' => 'Implementando Factory e Builder patterns em TypeScript.',
                'status' => 'draft',
                'published_at' => null,
                'author_id' => $admin->id,
                'reading_time' => 7,
                'tags' => [$typescript->id, $arquitetura->id],
            ],
        ];

        foreach ($posts as $postData) {
            $tags = $postData['tags'];
            unset($postData['tags']);

            $post = \App\Models\Post::create($postData);
            $post->tags()->attach($tags);
        }
    }
}
