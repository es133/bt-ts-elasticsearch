# bt-ts-elasticsearch 2.0

Elasticsearch Node.js 클라이언트를 위한 TypeScript 지원 라이브러리

- **버전**: 2.0.0
- **지원 Elasticsearch**: 9.2.x (2026.04)
- **작성자**: bugshot@gmail.com
- **라이선스**: MIT

> **⚠️ 주요 변경사항**: 버전 2.0.0은 Elasticsearch 9.x 호환성을 위한 Breaking Changes를 포함합니다.
> - Mapping Types (`_type`) 완전 제거
> - Response 구조 변경 (`response.body` → 직접 `response` 사용)
> - Retriever API 추가 (고급 검색 기능)
> - Point-in-Time (PIT) 지원

---

## 📋 목차

1. [실행 환경](#-실행-환경)
2. [설치 방법](#-설치-방법)
3. [프로젝트 구조](#-프로젝트-구조)
4. [환경 설정](#-환경-설정)
5. [기본 사용법](#-기본-사용법)
6. [Query DSL 작성](#-query-dsl-작성)
7. [Retriever 사용 (ES 8.14+)](#-retriever-사용-es-814)
8. [Aggregation 사용](#-aggregation-사용)
9. [고급 기능](#-고급-기능)

---

## 🔧 실행 환경

### 필수 요구사항
- **Node.js**: 18.x 이상
- **TypeScript**: 5.x 이상
- **Elasticsearch**: 9.2.x 이상

### 의존성
```json
{
  "@elastic/elasticsearch": "^9.2.0",
  "@types/node": "^24.10.8"
}
```

---

## 📦 설치 방법

### 1. GitHub Packages를 통한 설치

프로젝트 루트에 `.npmrc` 파일 생성:
```
@es133:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken={YOUR_GITHUB_PAT}
```

`package.json`에 의존성 추가:
```json
{
  "dependencies": {
    "@es133/bt-ts-elasticsearch": "^2.0.0"
  }
}
```

설치 실행:
```bash
npm install
```

### 2. Git을 통한 직접 설치

```bash
npm install "git+https://github.com/es133/bt-ts-elasticsearch.git#semver:^2.0.0"
```

---

## 📁 프로젝트 구조

```
bt-ts-elasticsearch/
├── src/
│   ├── BtElasticSearch.ts          # 메인 진입점
│   ├── BtEsAbstractConfig.ts       # 설정 추상 클래스
│   ├── BtEsAbstractDao.ts          # DAO 추상 클래스
│   ├── bt_es_request/              # Request 클래스들
│   │   ├── BtEsAbstractRequest.ts
│   │   ├── BtEsAbstractSearchRequest.ts
│   │   ├── BtEsAbstractGetRequest.ts
│   │   ├── BtEsAbstractPutRequest.ts
│   │   ├── BtEsAbstractDeleteRequest.ts
│   │   ├── BtEsAbstractMGetRequest.ts
│   │   ├── BtEsAbstractUpdateRequest.ts
│   │   ├── BtEsAbstractUpdateByQueryRequest.ts
│   │   ├── BtEsAbstractDeleteByQueryRequest.ts
│   │   └── BtEsRequestUtil.ts
│   ├── response/                   # Response 클래스들
│   │   ├── BtEsSearchResponse.ts
│   │   ├── BtEsGetResponse.ts
│   │   ├── BtEsDocumentIndexResponse.ts
│   │   ├── BtEsBulkIndexResponse.ts
│   │   ├── BtEsGenericResponse.ts
│   │   ├── BtEsUpdateByQueryResponse.ts
│   │   └── BtEsDeleteByQueryResponse.ts
│   ├── es_query_dsl/               # Query DSL 빌더
│   │   ├── EsQueryBuilder.ts
│   │   ├── EsBoolQuery.ts
│   │   ├── EsMatchQuery.ts
│   │   ├── EsTermQuery.ts
│   │   ├── EsRangeQuery.ts
│   │   ├── EsKnnQuery.ts           # 벡터 검색
│   │   ├── EsSemanticQuery.ts      # 시맨틱 검색
│   │   └── ... (40+ Query DSL 클래스)
│   ├── es_retriever/               # Retriever API (NEW in 2.0)
│   │   ├── EsRetrieverBuilder.ts
│   │   ├── EsStandardRetriever.ts
│   │   ├── EsKnnRetriever.ts
│   │   ├── EsRrfRetriever.ts       # Hybrid Search
│   │   └── EsAbstractRetriever.ts
│   ├── es_aggregation/             # Aggregation 빌더
│   ├── es_search_option/           # Sort, Suggest 등
│   ├── interface/                  # TypeScript 인터페이스
│   └── type/                       # 타입 정의
└── dist/                           # 컴파일된 JavaScript
```

---

## ⚙️ 환경 설정

### 기본 설정

```typescript
import { BtEsAbstractConfig, BtEsAbstractDao } from '@es133/bt-ts-elasticsearch';

const config = {
  esClientService: {
    configuration: {
      nodes: ['http://localhost:9200'],
      maxRetries: 3,
      requestTimeout: 30000,
    },
    index: {
      article_index: 'articles',
      user_index: 'users',
      search_index: 'search',
    },
  },
};

// Config 초기화
const esConfig = new BtEsAbstractConfig(config['esClientService']);

// DAO 생성
const esDao = new BtEsAbstractDao(esConfig);
```

### 인증 설정

#### API Key 인증
```typescript
const config = {
  esClientService: {
    configuration: {
      nodes: ['https://your-cluster.es.io:9200'],
      auth: {
        apiKey: 'your-api-key'
      },
      maxRetries: 3,
      requestTimeout: 30000,
    },
    index: { ... },
  },
};
```

#### Basic 인증
```typescript
const config = {
  esClientService: {
    configuration: {
      nodes: ['http://localhost:9200'],
      auth: {
        username: 'elastic',
        password: 'your-password'
      },
      maxRetries: 3,
      requestTimeout: 30000,
    },
    index: { ... },
  },
};
```

### 고급 설정 (Index Settings, Mappings, Templates)

```typescript
import { BtEsAbstractConfig } from '@es133/bt-ts-elasticsearch';

class MyEsConfig extends BtEsAbstractConfig {
  constructor(config: any) {
    super(config);
    
    // Index Settings
    this.indexSettingMap = new Map();
    this.indexSettingMap.set('articles', {
      number_of_shards: 3,
      number_of_replicas: 1,
    });
    
    // Index Mappings
    this.indexMappingMap = new Map();
    this.indexMappingMap.set('articles', {
      properties: {
        title: { type: 'text' },
        content: { type: 'text' },
        created_at: { type: 'date' },
      },
    });
    
    // Index Templates
    this.indexTemplateMap = new Map();
    this.indexTemplateMap.set('article_template', {
      index_patterns: ['articles-*'],
      template: {
        settings: { number_of_shards: 1 },
        mappings: { /* ... */ },
      },
    });
    
    // ILM Policies
    this.ilmPolicyMap = new Map();
    this.ilmPolicyMap.set('article_policy', {
      policy: {
        phases: {
          hot: { actions: { rollover: { max_age: '7d' } } },
          delete: { min_age: '90d', actions: { delete: {} } },
        },
      },
    });
  }
}
```

---

## 🚀 기본 사용법

### 1. 문서 조회 (Get)

```typescript
import { BtEsAbstractGetRequest } from '@es133/bt-ts-elasticsearch';

const getRequest = new BtEsAbstractGetRequest();
getRequest.setIndex(esConfig.getIndexName('article_index'));
getRequest.setId(12345);
getRequest.setSource(true);

const response = await esDao.requestGet(getRequest);
console.log('Document:', response.response.source);
```

**응답 예시:**
```typescript
{
  response: {
    index: 'articles',
    id: '12345',
    version: 1,
    found: true,
    source: {
      title: 'Elasticsearch Guide',
      content: 'This is a guide...',
      created_at: '2026-04-16T10:00:00Z'
    }
  }
}
```

### 2. 문서 검색 (Search)

```typescript
import { 
  BtEsAbstractSearchRequest, 
  EsQueryBuilder 
} from '@es133/bt-ts-elasticsearch';

const searchRequest = new BtEsAbstractSearchRequest();
searchRequest.setIndex(esConfig.getIndexName('article_index'));

// Query DSL 작성
const query = EsQueryBuilder.boolQuery()
  .must(EsQueryBuilder.matchQuery('content', 'elasticsearch'))
  .filter(EsQueryBuilder.rangeQuery('created_at').gte('2026-01-01'));

searchRequest.setQueryDsl(query);
searchRequest.setSize(10);
searchRequest.setFrom(0);
searchRequest.setSource(true);

const response = await esDao.requestSearch(searchRequest);
console.log('Total:', response.totalCount);
console.log('Hits:', response.hits);
```

### 3. 문서 인덱싱 (Index)

```typescript
import { BtEsAbstractPutRequest } from '@es133/bt-ts-elasticsearch';

const putRequest = new BtEsAbstractPutRequest();
putRequest.setIndex(esConfig.getIndexName('article_index'));
putRequest.setId(12345); // Optional: 생략시 자동 생성

const document = {
  title: 'New Article',
  content: 'Article content here...',
  author: 'John Doe',
  created_at: new Date().toISOString(),
};

const response = await esDao.requestPut(putRequest, document);
console.log('Result:', response.response.result); // 'created' or 'updated'
```

### 4. 문서 업데이트 (Update)

```typescript
import { BtEsAbstractUpdateRequest } from '@es133/bt-ts-elasticsearch';

const updateRequest = new BtEsAbstractUpdateRequest();
updateRequest.setIndex(esConfig.getIndexName('article_index'));
updateRequest.setId(12345);

// 부분 업데이트
updateRequest.setDocument({
  view_count: 100,
  updated_at: new Date().toISOString(),
});

const response = await esDao.requestUpdate(updateRequest);
```

### 5. 문서 삭제 (Delete)

```typescript
import { BtEsAbstractDeleteRequest } from '@es133/bt-ts-elasticsearch';

const deleteRequest = new BtEsAbstractDeleteRequest();
deleteRequest.setIndex(esConfig.getIndexName('article_index'));
deleteRequest.setId(12345);

const response = await esDao.requestDelete(deleteRequest);
```

### 6. 벌크 작업 (Bulk)

```typescript
const bulkOperations = [
  { index: { _index: 'articles', _id: '1' } },
  { title: 'Article 1', content: 'Content 1' },
  { index: { _index: 'articles', _id: '2' } },
  { title: 'Article 2', content: 'Content 2' },
  { delete: { _index: 'articles', _id: '3' } },
];

const response = await esDao.requestBulk(bulkOperations);
console.log('Errors:', response.error);
console.log('Results:', response.resultList);
```

---

## 🔍 Query DSL 작성

### Query Builder 사용

Elasticsearch의 JSON 기반 Query DSL을 TypeScript 빌더 패턴으로 쉽게 작성할 수 있습니다.

#### Bool Query (복합 쿼리)

```typescript
const boolQuery = EsQueryBuilder.boolQuery()
  .must(EsQueryBuilder.matchQuery('title', 'elasticsearch'))
  .must(EsQueryBuilder.termQuery('status', 'published'))
  .should(EsQueryBuilder.matchQuery('tags', 'tutorial'))
  .filter(EsQueryBuilder.rangeQuery('created_at').gte('2026-01-01'))
  .mustNot(EsQueryBuilder.termQuery('deleted', true));

searchRequest.setQueryDsl(boolQuery);
```

#### Match Query (전문 검색)

```typescript
const matchQuery = EsQueryBuilder.matchQuery('content', 'elasticsearch guide');
matchQuery.operator('AND');
matchQuery.minimumShouldMatch(2);
matchQuery.boost(2.0);
```

#### Term Query (정확한 값 매칭)

```typescript
const termQuery = EsQueryBuilder.termQuery('status', 'published');
termQuery.boost(1.5);
```

#### Range Query (범위 검색)

```typescript
const rangeQuery = EsQueryBuilder.rangeQuery('price');
rangeQuery.gte(100);
rangeQuery.lte(500);
rangeQuery.boost(1.2);
```

#### Multi-Match Query (여러 필드 검색)

```typescript
const multiMatchQuery = EsQueryBuilder.multiMatchQuery(
  'elasticsearch tutorial',
  ['title', 'content', 'tags']
);
multiMatchQuery.type('best_fields');
multiMatchQuery.tieBreaker(0.3);
```

#### Fuzzy Query (오타 허용 검색)

```typescript
const fuzzyQuery = EsQueryBuilder.fuzzyQuery('title', 'elasticsearh'); // 오타
fuzzyQuery.fuzziness('AUTO');
fuzzyQuery.maxExpansions(50);
```

#### Wildcard Query (와일드카드 검색)

```typescript
const wildcardQuery = EsQueryBuilder.wildcardQuery('email', '*@example.com');
```

#### Nested Query (중첩 객체 검색)

```typescript
const nestedQuery = EsQueryBuilder.nestedQuery(
  'comments',
  EsQueryBuilder.boolQuery()
    .must(EsQueryBuilder.matchQuery('comments.author', 'John'))
    .must(EsQueryBuilder.rangeQuery('comments.rating').gte(4))
);
```

#### Geo Distance Query (지리적 거리 검색)

```typescript
const geoQuery = EsQueryBuilder.geoDistanceQuery(
  'location',
  { lat: 37.5665, lon: 126.9780 },
  '10km'
);
```

---

## 🎯 Retriever 사용 (ES 8.14+)

> **⚠️ 라이선스 요구사항**
> - **Basic 라이선스**: Standard, kNN, Pinned, Rescorer Retriever 사용 가능
> - **Enterprise 라이선스 필요**: RRF (Reciprocal Rank Fusion), Linear, Rule, Text Similarity Re-ranker Retriever
> - 자세한 내용은 [Elastic 구독 페이지](https://www.elastic.co/subscriptions)를 참조하세요.

Retriever는 Elasticsearch 8.14+에서 도입된 통합 검색 인터페이스로, BM25, kNN, 하이브리드 검색을 쉽게 구현할 수 있습니다.

### Standard Retriever (기본 쿼리 래핑)

```typescript
import { EsRetrieverBuilder, EsQueryBuilder } from '@es133/bt-ts-elasticsearch';

const searchRequest = new BtEsAbstractSearchRequest();
searchRequest.setIndex('articles');

// Query DSL을 Retriever로 래핑
const matchQuery = EsQueryBuilder.matchQuery('content', 'elasticsearch');
const standardRetriever = EsRetrieverBuilder.standardRetriever(matchQuery);

// 필터 추가
const filterQuery = EsQueryBuilder.termQuery('status', 'published');
standardRetriever.filter(filterQuery);

searchRequest.setRetriever(standardRetriever);
const response = await esDao.requestSearch(searchRequest);
```

### kNN Retriever (벡터 검색)

```typescript
// 임베딩 벡터 (예: OpenAI, Sentence Transformers 등으로 생성)
const queryVector = [0.1, 0.2, 0.3, /* ... 768 dimensions */];

const knnRetriever = EsRetrieverBuilder.knnRetriever(
  'content_embedding',  // 벡터 필드명
  queryVector,          // 쿼리 벡터
  10,                   // k: 반환할 결과 수
  100                   // num_candidates: 검색할 후보 수
);

// 필터 추가 (벡터 검색 전 사전 필터링)
knnRetriever.filter(EsQueryBuilder.termQuery('language', 'ko'));

searchRequest.setRetriever(knnRetriever);
const response = await esDao.requestSearch(searchRequest);
```

### RRF Retriever (하이브리드 검색)

> **🔒 Enterprise 라이선스 필요**: RRF Retriever는 Elasticsearch Enterprise 라이선스가 필요합니다.

Reciprocal Rank Fusion을 사용하여 여러 검색 전략을 결합합니다.

```typescript
// 1. 키워드 검색 (BM25)
const matchQuery = EsQueryBuilder.matchQuery('content', 'elasticsearch tutorial');
const standardRetriever = EsRetrieverBuilder.standardRetriever(matchQuery);

// 2. 벡터 검색 (kNN)
const queryVector = getEmbedding('elasticsearch tutorial'); // 임베딩 함수
const knnRetriever = EsRetrieverBuilder.knnRetriever(
  'content_embedding',
  queryVector,
  10,
  100
);

// 3. RRF로 결합 (하이브리드 검색)
const rrfRetriever = EsRetrieverBuilder.rrfRetriever(
  [standardRetriever, knnRetriever],
  100,  // rank_window_size (선택사항)
  60    // rank_constant (선택사항)
);

searchRequest.setRetriever(rrfRetriever);
const response = await esDao.requestSearch(searchRequest);
```

> **참고**: Retriever를 사용할 때는 `setQueryDsl()`과 함께 사용할 수 없습니다. Retriever가 우선합니다.

---

## 📊 Aggregation 사용

### Terms Aggregation (그룹화)

```typescript
import { EsAggregationBuilder } from '@es133/bt-ts-elasticsearch';

const searchRequest = new BtEsAbstractSearchRequest();
searchRequest.setQueryDsl(EsQueryBuilder.matchAllQuery());

// 카테고리별 문서 수 집계
const categoryAggs = EsAggregationBuilder.termsAggregations(
  'categories',
  'category.keyword'
);
categoryAggs.size(10);

searchRequest.addAggregations(categoryAggs);
const response = await esDao.requestSearch(searchRequest);
console.log('Aggregations:', response.aggregations);
```

### Date Histogram Aggregation (시계열 집계)

```typescript
const dateAggs = EsAggregationBuilder.dateHistogramAggregations(
  'posts_over_time',
  'created_at'
);
dateAggs.interval('day', 'yyyy-MM-dd');
dateAggs.extendedBounds(-30, 0); // 최근 30일

searchRequest.addAggregations(dateAggs);
```

### Stats Aggregation (통계)

```typescript
const statsAggs = EsAggregationBuilder.statsAggregations('price_stats');
statsAggs.field('price');

searchRequest.addAggregations(statsAggs);

// 결과: min, max, avg, sum, count
```

### Nested Aggregation (중첩 집계)

```typescript
const categoryAggs = EsAggregationBuilder.termsAggregations(
  'by_category',
  'category'
);

// 하위 집계: 각 카테고리별 평균 가격
const avgPriceAggs = EsAggregationBuilder.avgAggregations('avg_price');
avgPriceAggs.field('price');

categoryAggs.subAggregations(avgPriceAggs);
searchRequest.addAggregations(categoryAggs);
```

---

## 🎨 고급 기능

### 1. Sorting (정렬)

```typescript
import { EsSearchOptionBuilder } from '@es133/bt-ts-elasticsearch';

// 기본 정렬
searchRequest.addSort(
  EsSearchOptionBuilder.sort('created_at', 'desc')
);

// 스크립트 정렬
const scriptSort = EsSearchOptionBuilder.scriptSort({
  _script: {
    type: 'number',
    script: {
      source: "doc['like_count'].value * 2 + doc['comment_count'].value"
    },
    order: 'desc'
  }
});
searchRequest.addSort(scriptSort);

// 중첩 필드 정렬
const nestedSort = EsSearchOptionBuilder.nestedSort(
  'comments',
  'comments.rating',
  'desc'
);
searchRequest.addSort(nestedSort);
```

### 2. Search After (대용량 페이징)

```typescript
// 첫 번째 요청
searchRequest.setSize(100);
searchRequest.addSort(EsSearchOptionBuilder.sort('_id', 'asc'));

let response = await esDao.requestSearch(searchRequest);

// 다음 페이지
while (response.hits && response.hits.hits.length > 0) {
  const lastHit = response.hits.hits[response.hits.hits.length - 1];
  searchRequest.searchAfter = lastHit.sort;
  
  response = await esDao.requestSearch(searchRequest);
  // 처리...
}
```

### 3. Point-in-Time (PIT)

```typescript
// PIT 열기
const pitId = await esDao.openPointInTime('articles', '5m');

// PIT를 사용한 검색
searchRequest.pit = { id: pitId, keep_alive: '5m' };
searchRequest.setSize(100);

const response = await esDao.requestSearch(searchRequest);

// PIT 닫기
await esDao.closePointInTime(pitId);
```

### 4. Scroll API (대용량 데이터 조회)

```typescript
// 초기 Scroll 요청
searchRequest.setScroll('5m');
searchRequest.setSize(1000);

let response = await esDao.requestSearch(searchRequest);
let scrollId = response.scrollId;

// Scroll 계속
while (scrollId && response.hits.hits.length > 0) {
  response = await esDao.requestScroll(scrollId, '5m');
  scrollId = response.scrollId;
  
  // 데이터 처리...
}

// Scroll 정리
if (scrollId) {
  await esDao.clearScroll(scrollId);
}
```

### 5. Update By Query

```typescript
import { BtEsAbstractUpdateByQueryRequest } from '@es133/bt-ts-elasticsearch';

const updateRequest = new BtEsAbstractUpdateByQueryRequest();
updateRequest.setIndex('articles');

// 조건에 맞는 문서 찾기
const query = EsQueryBuilder.termQuery('status', 'draft');
updateRequest.setQueryDsl(query);

// 스크립트로 업데이트
updateRequest.setScript({
  source: "ctx._source.status = 'published'; ctx._source.published_at = params.now",
  params: { now: new Date().toISOString() }
}, 'painless');

const response = await esDao.requestUpdateByQuery(updateRequest);
console.log('Updated:', response.response.total);
```

### 6. Delete By Query

```typescript
import { BtEsAbstractDeleteByQueryRequest } from '@es133/bt-ts-elasticsearch';

const deleteRequest = new BtEsAbstractDeleteByQueryRequest();
deleteRequest.setIndex('articles');

// 30일 이전 문서 삭제
const query = EsQueryBuilder.rangeQuery('created_at')
  .lt('now-30d');
deleteRequest.setQueryDsl(query);

const response = await esDao.requestDeleteByQuery(deleteRequest);
console.log('Deleted:', response.response.deleted);
```

### 7. Multi Get

```typescript
import { BtEsAbstractMGetRequest } from '@es133/bt-ts-elasticsearch';

const mgetRequest = new BtEsAbstractMGetRequest();
mgetRequest.setIndex('articles');
mgetRequest.setIds([1, 2, 3, 4, 5]);

const response = await esDao.requestMGet(mgetRequest);
console.log('Documents:', response.resultList);
```

### 8. Index Management

```typescript
// 인덱스 생성
await esDao.createIndex('new-index');

// 인덱스 삭제
await esDao.deleteIndex('old-index');

// 인덱스 존재 확인
const exists = await esDao.existsIndex('my-index');

// 인덱스 템플릿 생성
await esDao.createIndexTemplate('my-template');

// Alias 관리
await esDao.updateAliases([
  { add: { index: 'articles-2026-04', alias: 'articles' } },
  { remove: { index: 'articles-2026-03', alias: 'articles' } }
]);
```

---

## 📝 추가 제안 사항

다음 내용들을 추가로 문서화하면 좋을 것 같습니다:

### 1. **마이그레이션 가이드**
   - v1.x에서 v2.0으로 업그레이드 시 주의사항
   - Breaking Changes 상세 설명
   - 코드 변경 예시

### 2. **성능 최적화 가이드**
   - Bulk 작업 최적화
   - Connection Pool 설정
   - 쿼리 최적화 팁

### 3. **에러 핸들링**
   - 일반적인 에러 상황과 해결 방법
   - Retry 전략
   - Circuit Breaker 패턴

### 4. **테스트 가이드**
   - Unit Test 예시
   - Integration Test 예시
   - Mock 사용법

### 5. **실전 예제**
   - 전문 검색 시스템 구현
   - 추천 시스템 구현
   - 로그 분석 시스템 구현

이 중 어떤 내용을 추가로 작성해드릴까요?
