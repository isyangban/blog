---
layout: Post
title: 아치 리눅스 AUR에 패키지 올리기
category: Linux
description: AUR에 패키지를 올리는 방법 
date: "2021-06-05T12:28:29.368Z"
tags: ["Arch Linux", "Linux", "AUR"]
cover: /image/cover/aur.png
---
3-4개월 전에 새로운 컴퓨터를 구매를 하면서 Arch Linux를 다시 설치하게 되었다. 
새로 운영체제를 설치하면서 다시 프린터 드라이버를 설치해야 했는데, 아무래도 Arch Linux의 경우 그렇게 대중적인 배포판이 아니므로, 프린터 드라이버가 있는지 제조사 홈페이지에 들어가서 찾아봤는데 아니나 다를까 공식적인 드라이버가 없었다.
보통 Arch Linux의 같은 경우 개발자들과 Geek과 많이 쓰는 배포판이다 보니 왠만하면 AUR에 프린터 드라이버가 올라올 만도 한데, 하필이면 프린터도 그렇게 대중적이지 않다보니 AUR에도 원하는 드라이버가 없었다. 
오랜만(?)에 대중적이지 않은 OS를 쓰는 불편함을 느끼게 되었다.

3년 전에 프린터 처음 구매했을 때, 어찌어찌 DEB패키지 압축 풀어서 수동으로 필요한 파일들 옮겨서 드라이버 설치했었던 경험이 있다. 그런데 다시 해보려고 하니 기록도 안해놨고, 오래되어서 기억도 잘 안나서 이번에는 설치 과정을 자동화도 할겸 PKGBUILD 만들어 봤다. 나중에 혹시 Arch Linux 다시 설치할 때, 드라이버 설치하는 번거러움 없기를 원해서...
사실 PKGBUILD 만들어 놓은 것은 3개월 정도 되었는데, 혼자만 잘 쓰다가, 요즘 시간도 좀 많이 나고 다른 사람 혹시 필요하신 분이 있을 수도 있어서 AUR올리는 방법 찾아봐서 Arch AUR에도 해당 패키지를 올려놨다 (brother-hll2335d). [방법](https://wiki.archlinux.org/title/AUR_submission_guidelines)은 그렇게 어렵지 않다. 위키에도 자세히 설명되어 있지만 나도 간략하게 설명을 적어본다. 

# 패키지 등록 단계
1. PKGBUILD 만들기
2. SSH Key 만들기
3. AUR 회원 가입 
4. 패키지 Repository 만들기
5. 패키지 배포하기

## PKGBUILD 만들기
방대하기 때문에 자세한 설명은 찾아보거나 질문 주면 답변 해드립니다. 간단하게 설명하자면 아치 리눅스 패키지를 만들려면 [makepkg](https://wiki.archlinux.org/title/Makepkg) 툴을 사용하는데 makepkg에서 가장 처음 참고하는 파일이 [PKGBUILD](https://wiki.archlinux.org/title/PKGBUILD) 파일이다. PKGBUILD을 통해 필요한 파일들을 준비하고, 빌드하고, 테스트해서 패키지를 만든다. 쉘 스크립트 작성하듯이 PKGBUILD 파일을 만들어 주면 된다.

## SSH Key 만들기
AUR에 패키지를 올리려면 SSH Key가 필요하다.
```bash
cd ~/.ssh
ssh-keygen -t ed25519
```
그다음 `~/.ssh/config`에 필요한 설정을 추가해준다.
```
Host aur.archlinux.org
  IdentityFile ~/.ssh/aur
  User aur
```

## AUR 가입
AUR에 패키지를 올리려면 [회원가입](https://aur.archlinux.org/register/)을 해줘야한다. 이전 단계에서 생성한 `aur.pub` 파일의 내용을 SSH Public Key 항목에 넣어두자. 나머지는 Required 항목만 채워서 계정을 생성하면 된다.

## 패키지 Repository 만들기
만약 git repo가 없으면 clone하면 된다. 
```bash
git clone https://aur.archlinux.org/<패키지 이름>.git       
'패키지 이름'에 복제합니다...
remote: Enumerating objects: 8, done.
remote: Counting objects: 100% (8/8), done.
remote: Compressing objects: 100% (8/8), done.
remote: Total 8 (delta 0), reused 8 (delta 0), pack-reused 0
오브젝트 묶음 푸는 중: 100% (8/8), 2.29 KiB | 391.00 KiB/s, 완료.
```
만약 이미 만들어 놓은 Repo가 있다면, 이런식으로 remote 추가해주면 된다. 
```bash
git remote add origin ssh://aur@aur.archlinux.org/<패키지 이름>.git
```

## 패키지 배포하기
배포하기 전에 `.SRCINFO` 파일을 생성해야한다.
```bash
makepkg --printsrcinfo > .SRCINFO
```
필요한 파일들을 추가해서 커밋하고 푸쉬하면 된다.
```bash
git add PKGBUILD .SRCINFO
git add <기타 필요한 파일들>
git commit -m "Commit Message"
git push 
```
마지막으로 제대로 패키지가 올라가 있는 것을 [AUR 홈페이지](https://aur.archlinux.org)에 들어가서 다시 한번 확인하면 된다. 



## 소감
1,2,3 번 과정이 이미 되어있다면 패키지 올리거나 업데이트 하는 것은 정말 5분도 안 걸리는 일일 것이다. 심지어 검증하는 과정도 없어서 살짝 걱정될 정도? 
