# Gemini CLI 확장 프로그램 배포 가이드 (notify-sound)

이 가이드는 공식 문서를 바탕으로 `notify-sound` 확장 프로그램을 Gemini CLI용으로 배포하는 방법을 안내합니다.

## 사전 준비
1. **공개 GitHub 저장소:** 확장 프로그램 갤러리에 노출되려면 저장소가 공개(Public) 상태여야 합니다.
2. **매니페스트 파일:** `gemini-extension.json` 파일이 저장소 또는 릴리스 아카이브의 최상위(root)에 위치해야 합니다.

## 단계 1: 갤러리 토픽 추가
Gemini CLI 크롤러가 확장 프로그램을 찾을 수 있도록 설정합니다.
- GitHub 저장소 페이지로 이동합니다.
- 우측 사이드바의 "About" 섹션에 있는 톱니바퀴(설정) 아이콘을 클릭합니다.
- "Topics" 항목에 `gemini-cli-extension` 토픽을 추가합니다.

## 단계 2: 배포 방식 선택

### 옵션 A: Git 저장소를 통한 배포 (유연성 권장)
사용자가 저장소에서 직접 설치하는 가장 간단한 방법입니다.
- **방법:** 코드를 `main` 또는 `master` 브랜치에 푸시합니다.
- **설치 명령어:**
  ```bash
  gemini extensions install https://github.com/your-username/notify-sound
  ```
- 사용자는 `--ref` 옵션을 사용해 특정 브랜치나 태그를 지정할 수 있습니다 (예: `--ref=v1.0.0`).

### 옵션 B: GitHub Releases를 통한 배포 (효율성 권장)
더 빠른 설치를 위해 확장 프로그램을 아카이브로 패키징하려는 경우:
- **방법:** GitHub에서 새 Release를 생성하고 소스 코드 아카이브(zip/tar.gz)를 첨부하거나 GitHub가 자동 생성하게 둡니다.
- **설치:** 사용자가 설치 명령어를 실행하면 CLI가 자동으로 GitHub의 '최신 릴리스(Latest release)'를 가져옵니다.

## 단계 3: 배포 전 로컬 테스트
배포하기 전에 재설치 없이 로컬에서 확장 프로그램을 테스트할 수 있습니다:
```bash
# 현재 디렉토리를 연결(link)합니다.
gemini extensions link

# 설치 상태를 확인합니다.
gemini extensions list
```

## 단계 4: 최종 디렉토리 이름 변경
새로운 확장 프로그램 이름에 맞게 로컬 저장소 디렉토리 이름을 `alarm`에서 `notify-sound`로 변경해 주세요.
```bash
# 디렉토리 이름 변경 예시 명령어
mv ../alarm ../notify-sound
```