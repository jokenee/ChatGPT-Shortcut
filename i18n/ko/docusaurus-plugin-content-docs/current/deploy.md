# 배포

AI Short 는 오픈 소스 프로젝트로, 웹사이트의 이름과 설명을 자유롭게 수정할 수 있습니다.

- 페이지 이름을 변경하려면 `docusaurus.config.js` 파일을 편집합니다.
- 지침을 수정하려면 `docs` 디렉토리로 이동합니다.
- 프롬프트 단어를 수정하려면 `src/data/prompt.json`에서 찾을 수 있습니다. 중국어와 같이 단일 언어만 수정하면 되는 경우 `src/data/prompt_zh.json`을 직접 편집할 수 있습니다.
- 현재 사용자 백엔드는 공통 백엔드 시스템에 연결되어 있습니다. 필요한 경우 자체 백엔드를 빌드할 수 있으며 관련 인터페이스는 `src/api.js` 파일에 있습니다.

`CodeUpdateHandler.py`는 다국어 배포를 일괄 처리하기 위한 스크립트입니다. 수정을 완료한 후 `python CodeUpdateHandler.py`를 실행하면 `prompt.json`이 규칙에 따라 여러 언어로 분할되고 각 언어의 메인 페이지 코드와 선택한 프롬프트 단어의 독립 페이지 코드가 동기화됩니다.

## 배포 설명

시스템 요구 사항:

- [Node.js 18.0](https://nodejs.org/) 이상.
- macOS, Windows (WSL 포함), Linux에서 지원됩니다.

### 로컬 배포

먼저 [Node.js](https://nodejs.org/)가 설치되어 있는지 확인하십시오.

```shell
# 설치
yarn

# 로컬 개발
yarn start

# 빌드: 이 명령어는 정적 콘텐츠를 `build` 디렉토리에 생성합니다.
yarn build

# `docusaurus.config.js` 파일에서 `defaultLocale`을 업데이트한 후 원하는 언어로 빌드를 수행합니다.
yarn build --locale zh
yarn build --locale en
yarn build --locale ja
yarn build --locale ko
yarn build --locale es
yarn build --locale fr
yarn build --locale de
yarn build --locale it
yarn build --locale ru
yarn build --locale pt
yarn build --locale hi
yarn build --locale ar
yarn build --locale bn

# 여러 언어로 배포
yarn build --locale zh && yarn build --locale en
```

### Vercel 배포

아래 버튼을 클릭하여 ChatGPT-Shortcut을 Vercel 플랫폼에 한 번에 배포하세요:

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frockbenben%2FChatGPT-Shortcut%2Ftree%2Fmain)

**주의**: Vercel 무료 버전은 메모리 부족으로 오류가 발생할 수 있습니다. 이 경우 단일 언어 배포를 선택할 수 있습니다. 구체적인 작업은 다음과 같습니다:

1. 방금 배포한 Vercel 프로젝트로 이동하여 **Settings**를 엽니다.
2. **Build & Deployment** 섹션에서 **Build Command**를 찾아 오른쪽의 **Override**를 클릭합니다.
3. 배포 명령을 수정합니다. 예를 들어, 중국어 버전을 배포하려면 `yarn build --locale zh`를 사용하고, 포르투갈어 버전을 배포하려면 `yarn build --locale pt`를 사용합니다.

## Cloudflare Pages 배포

아래 버튼 또는 링크를 클릭하여 본 프로젝트를 Fork한 후, Cloudflare Pages에서 배포 지침을 따르세요:

👉 [이 프로젝트 Fork하기](https://github.com/rockbenben/ChatGPT-Shortcut/fork)

배포 절차:

1. [Cloudflare Pages](https://pages.cloudflare.com/)에 로그인하고 **"Create a project"**를 선택합니다.
2. 방금 Fork한 저장소를 연결합니다.
3. 빌드 명령을 설정합니다:
   - **Build command**: `yarn build --locale zh` (배포하려는 언어에 맞는 locale을 선택하십시오. 예: 포르투갈어는 `yarn build --locale pt` 사용).
   - **Output directory**: `build`.
4. **배포**를 클릭하고 Cloudflare Pages가 빌드 및 배포를 완료할 때까지 기다립니다.

Cloudflare Pages는 매번 새로운 코드를 푸시할 때마다 자동으로 빌드 및 배포를 트리거합니다.

### Docker 배포

Docker 에 익숙하다면 다음 명령어로 빠르게 배포할 수 있습니다.

```shell
# ghcr.io
docker run -d -p 3000:3000 --name chatgpt-shortcut ghcr.io/rockbenben/chatgpt-shortcut:latest

# docker hub
docker run -d -p 3000:3000 --name chatgpt-shortcut rockben/chatgpt-shortcut:latest
```

또는 `docker-compose`를 사용할 수 있습니다.

```yml
version: "3.8"

services:
docsify:
container_name: chatgpt-shortcut
image: ghcr.io/rockbenben/chatgpt-shortcut:latest
ports:
- "3000:3000"
restart: except-stopped
```

## 동기화된 업데이트

한 번의 클릭으로 Vercel 에 자체 프로젝트를 배포한 경우 업데이트가 지속적으로 표시되는 문제가 발생할 수 있습니다. 이는 Vercel 이 현재 프로젝트를 포크하는 대신 새 프로젝트를 만드는 기본 동작으로 인해 발생하여 적절한 업데이트 감지를 방해합니다. 재배포를 위한 다음 단계를 따르는 것이 좋습니다.

1. 이전 리포지토리를 제거합니다.
2. 페이지 오른쪽 상단에 있는 "포크" 버튼을 사용하여 현재 프로젝트를 포크합니다.
3. [Vercel New Project 페이지](https://vercel.com/new)에서 Import Git Repository 섹션에서 최근에 포크한 프로젝트를 선택하고 배포를 진행합니다.

### 자동 업데이트

> Upstream Sync 를 실행하는 동안 오류가 발생하는 경우 수동으로 단일 Sync Fork 를 수행합니다.

프로젝트를 포크한 후 GitHub 제한으로 인해 포크한 프로젝트의 작업 페이지에서 Workflows 를 수동으로 활성화하고 Upstream Sync 작업을 활성화해야 합니다. 활성화하면 매일 업데이트가 자동으로 실행됩니다.

![자동 업데이트](https://img.newzone.top/2023-05-19-11-57-59.png?imageMogr2/format/webp)

![자동 업데이트 활성화](https://img.newzone.top/2023-05-19-11-59-26.png?imageMogr2/format/webp)

### 수동 업데이트

즉시 수동으로 업데이트하려는 경우 [GitHub 설명서](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)를 참조하여 포크된 프로젝트를 업스트림 코드와 동기화하는 방법을 알아볼 수 있습니다.

별표/팔로우를 주거나 작성자를 팔로우하여 이 프로젝트에 대한 지원을 표시하고 새로운 기능 업데이트에 대한 적시 알림을 받으세요.
