# 기술 스택 및 숙련도

> 실무에서 직접 사용한 경험과 개인 프로젝트에서 학습한 수준을 구분해서 작성.

## 프로그래밍 언어

### Python (실무 주력)
- 빅밸류 실무 1년 전구간 사용 — 데이터 파이프라인, 크롤러, 검수 로직, LLM 챗봇 파이프라인
- 사용 라이브러리: pandas, requests, psycopg2, sqlalchemy, selenium, scrapy, fastapi
- 비동기: asyncio 기본 수준 (실무에서는 동기 위주)

### SQL (실무 주력)
- PostgreSQL/Oracle 양쪽 경험, 복합 PK 설계, 윈도우 함수, CTE, 인덱스 튜닝 기본
- 경매 파이프라인에서 비정규화 테이블 설계 (사건번호+법원+매각기일 복합 PK)
- 부동산 파이프라인에서 PNU 기반 격자 조인 쿼리 최적화 경험

### Java (학부 수준)
- CUHK 객체지향 수업에서 사용, 실무 미사용
- Spring 등 프레임워크 경험 없음

## 데이터 엔지니어링 스택

### Airflow (실무 주력)
- 총 15개 이상 DAG 운영 경험 (검역본부 9개 + 부동산 6개 + 개인 프로젝트)
- 테이블별 task 분리, 재시도·의존성·알림(Discord webhook) 설계
- Variable 기반 환경 분리 (dev/prod), on_failure_callback으로 공통 실패 알림

### PostgreSQL (실무 주력)
- 빅밸류 전 프로젝트에서 주 DB로 사용
- pgvector 확장으로 임베딩 검색 구현 (개인 프로젝트 게임 챗봇)
- 일 1,300만 건 격자 데이터 적재·조인 경험

### Oracle (실무 보조)
- 검역본부 원천 DB로만 사용, Oracle → PostgreSQL ETL만 담당
- PL/SQL 작성 경험 없음

### Spark / Hadoop (학부 + 개인 프로젝트)
- CUHK 빅데이터 수업에서 MapReduce 기반 K-means, SON, PCY 알고리즘 구현
- TFT 개인 프로젝트에서 SparkSQL로 챌린저 유저 경기 데이터 집계
- 실무 사용 경험 없음 (실무는 Airflow+Python+PostgreSQL 중심)

### Kafka (학습 중)
- 스터디 블로그에서 개념 정리 중
- 실무 사용 경험 없음

## 인프라

### AWS (개인 프로젝트)
- TFT 파이프라인에서 Lambda + S3 사용
- 인증/IAM, CloudWatch 기본 수준

### Docker (실무 + 개인)
- 빅밸류에서 Airflow compose 환경 운영, 컨테이너 재시작·로그 확인 수준
- 개인 프로젝트에서 docker-compose로 Airflow + PostgreSQL + pgvector 구성

### Linux (일상 사용)
- 실무 VM 운영, SSH, cron, systemd 기본

## 공간 데이터

### QGIS (실무)
- 검역본부 농장 좌표 처리, 도로 교차로 추출
- PostGIS 연동, SRID 변환 경험

## AI / LLM (개인 프로젝트)

### pgvector
- 게임 챗봇 프로젝트에서 few-shot 예제, 스키마 메타데이터 임베딩 저장소로 사용
- HNSW 인덱스로 유사도 검색 구현

### OpenAI / Gemini API
- 게임 챗봇에서 Text-to-SQL, RAG 파이프라인 구현
- 스트리밍 응답, 시스템 프롬프트 설계 경험

### Ollama (학습 중)
- 로컬 LLM 구동 환경 구축, 본 포트폴리오 사이트 AI 어시스턴트에 Gemma 연동

## 프론트엔드 (개인 프로젝트)

### Next.js / React
- 본 포트폴리오 사이트 (Next.js 16, App Router, Tailwind v4)
- MDX 기반 블로그/포트폴리오 콘텐츠 렌더링
- SSE 스트리밍 챗봇 UI 구현
