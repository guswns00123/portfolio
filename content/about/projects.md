# 개인 프로젝트

## 1. 게임 무물봇 — 게임 맞춤형 LLM 챗봇 데이터 파이프라인 (2026.03 ~ 진행 중)
- '게임에 대해 **무**엇이든지 **물**어보세요'의 줄임말. 파편화된 게임 데이터를 통합 제공하는 **RAG 기반 LLM 챗봇** 및 확장 가능한 데이터 파이프라인 구축
- **로스트아크 API 적용 완료**, **TFT API 확장 개발 중** (멀티 도메인 검증 단계)
- 아키텍처: 로스트아크/TFT API → Airflow ETL → PostgreSQL(+pgvector) → FastAPI(비동기 + BackgroundTasks) → OpenAI LLM (Analysis/SQL/Answer 3단 Generator) → Next.js 챗봇 UI
- 2인 팀에서 **데이터 엔지니어링·AI 데이터 아키텍처 영역 100% 전담** (수집/적재/RAG/Text-to-SQL/모니터링)
- 일일 약 **5,000건** 경매·거래소 트랜잭션 적재, 캐릭터 데이터는 챗봇 활용도에 비례해 동적 누적
- API Key 2개 도메인 분리(캐릭터 / 경매·거래소)로 1분당 100회 Rate Limit 분산, 데이터 변동성에 따라 수집 주기 차등화 (5분/1시간/1일)
- 정적/동적 데이터 분리로 **일일 수집량 1.9GB → 400MB (79% 절감)**
- RAG Retrieval 4단계 진화(전체 주입 → LLM 자체 판단 → In-memory Vector → DB-native pgvector)로 **토큰 사용량 84% 절감, Text-to-SQL 정확도 100%, Cold Start 2,520ms → 0ms**
- **Few-shot Learning 도입**으로 동일 질문 5회 반복 시 할루시네이션 3/5 → 0/5, 표현 변형 SQL 생성 성공률 2/3 → 3/3
- 비정형 JSONB tooltip을 정규식으로 정제·Numeric 컬럼화하여 EXPLAIN ANALYZE 기준 **쿼리 속도 5.3배 향상 (0.644ms → 0.121ms)**
- LangChain 기본 모니터링의 한계를 보완하기 위해 **3개 LLM Generator(Analysis/SQL/Answer)별 토큰·응답시간·비용·에러율을 비교하는 자체 모니터링 대시보드** 직접 개발 → 팀원 프롬프트 디버깅 사이클 단축
- 기술: Python, Airflow, PostgreSQL, pgvector, FastAPI, RAG, Text-to-SQL, OpenAI, Next.js
- 링크: [챗봇 데모](https://gamechatbotfe.vercel.app/)

## 2. TFT 챌린저 유저 주간 경기 데이터 파이프라인 (2024.08 ~ 2024.10)
- Riot TFT API 기반 챌린저 유저 경기 데이터 수집·분석 파이프라인 및 Tableau 주간 대시보드 구축
- 아키텍처: Riot API → Airflow(Docker) → AWS Lambda → PostgreSQL + S3 → PySpark SQL → Tableau
- 챌린저 **약 300명** 유저·경기 데이터 자동 수집, 6개 정규화 테이블로 유저-경기-유닛-특성 관계 모델링
- DAG 2종 운영: User 적재(매일 새벽 1시) + Game 수집(매 2시간)
- 로컬 Airflow에서 직접 API 호출 시 발생하던 **heartbeat 에러를 Lambda 분리 아키텍처로 해소** (Airflow는 트리거만, 호출·처리는 Lambda)
- API Rate Limit 대응: Lambda를 동시 호출하지 않고 **3개씩 단계적 트리거**로 누락률 최소화
- 챌린저 강등 유저의 과거 경기 데이터 보존 위해 `tier`/`rank`/`leaguePoints` 갱신형 + 경기 누적형 스키마 분리
- 기술: Python, Airflow, AWS Lambda, S3, PostgreSQL, SparkSQL, Tableau, Docker
- 링크: [GitHub](https://github.com/guswns00123/TFT_data)

## 3. Hadoop 분산 처리 실습 (2023.02 ~ 2023.04, CUHK 빅데이터 과목)
- MapReduce 기반 대표 분산 알고리즘 직접 구현
- **K-means**(클러스터링), **SON**(빈발 항목 집합), **PCY**(메모리 효율 빈발 항목) 3종 알고리즘을 Map → Shuffle → Reduce 단계로 직접 설계·구현
- 분산 처리에서 디스크 I/O 비용이 큰 이유, Spark가 메모리 캐시로 이를 해소하는 원리를 실측 비교로 체감
- 기술: Hadoop, MapReduce, Java

## 4. 레시피 그래프 기반 음식 추천 (2023.09 ~ 2024.04, CUHK 졸업 프로젝트)
- 레시피·식재료 데이터를 그래프로 모델링해 식재료 기반 음식을 추천하는 시스템
- 아키텍처: Scrapy + Selenium 크롤링 → 식재료-레시피 정제 → NetworkX 그래프 구축 → 추천 로직
- 동적 페이지(Selenium)와 정적 페이지(Scrapy)를 혼합 크롤링하여 수집 속도와 커버리지를 동시에 확보
- 식재료를 노드, 함께 사용되는 빈도를 엣지 가중치로 두어 "가진 재료 → 만들 수 있는 음식" 추천 흐름 구현
- 기술: Python, Scrapy, Selenium, NetworkX
