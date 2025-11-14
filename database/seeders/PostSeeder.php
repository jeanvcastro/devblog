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
        $admin = \App\Models\User::where('is_admin', true)->first();

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
        ];

        foreach ($posts as $postData) {
            $tags = $postData['tags'];
            unset($postData['tags']);

            $post = \App\Models\Post::create($postData);
            $post->tags()->attach($tags);
        }
    }
}
