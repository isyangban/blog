---
layout: Post
title: ZFS mirror vdev에 하드 추가하기 
category: SysAdmin 
date: "2020-01-04T02:30:00.392Z"
tags: ["SysAdmin", "zfs", "vdev", "attach", "detach", "harddisk"]
---
## 잘 사용하던 풀 용량이 꽉 차다
꽤 넉넉할 것 같은 약 6테라의 Pool의 용량이 꽉 차게 되었다. 주기적으로 스냅샷
찍다보니깐 옛날 데이터 지워도 용량은 차지하지, RaidZ나 Mirror 같은 Redundancy을 
추가하다보면 가용 용량은 적어지기도 하고. 무엇보다 나의 경우에는 장당 100메가 하는
사진이 쌓이다 보니깐 한 때 넉넉했다고 생각되는 Pool용량이 금방 고갈되고 말았다.

## ZFS 용량을 늘리는 방법
보통 ZFS Pool 용량을 늘리려면 vdev를 추가를 하면 된다. 보통 하나의 Pool에 여러개의
vdev로 구성이 되어 있는데 vdev는 하드디스크 또는 vdev으로 구성할 수 있다.
일종의 트리 형식인거다. vdev의 종류는 크게 4가지가 있다.
* mirror (n-way mirror 포함)
* raidz
  * raidz1 (parity disk 하나, RAID5와 유사)
  * raidz2 (parity disk 둘, RAID6와 유사)
  * raidz3 (parity disk 셋)
* disk (단일 디스크)
* file

이처럼 zfs은 하나의 pool에 vdev을 추가하는 것에는 매우 유연하다. 하지만 기존에 있는
vdev를 수정하려고 한다면 이야기가 달라진다. 
특히 raidz 형식의 vdev의 경우에는 더이상 하드를 추가할 수 없고 용량도 늘릴 수가 없다. 
그래서 만약 더 큰 용량의 하드를 구매했다라고 하면 울며겨자먹기로 다른 vdev를 만들어서
pool용량을 확대시키거나, 데이터를 딴 곳에 백업해놓고 Pool을 깨고 다시 처음부터 설정하는
방법밖에 없다. 
하지만 만약 이미 대용량의 데이터가 하드에 있는 경우 백업/복원을 하는 것은
시간이 너무 많이 걸리는 일이기도 하고 번거로움도 심하다.

하지만 mirror 타입의 vdev의 경우 한번 만들어놔도 하드를 추가해서 redundancy를 늘리거나 하드를 제거해서 redundancy를 줄일 수도 있다! 
Mirror vdev는 용량을 늘리는 것도 가능한데, 더 큰 용량의 하드디스크를 mirror vdev에 붙이고
resilvering (ZFS의 리빌딩에 해당하는 용어)을 하고 나서 용량 작은 하드디스크를 없애고 
zfs보고 용량을 늘리라고 명령하면 용량 업그레이드가 가능하다. 만약 베이나 sata port가 부족하면
mirror에 있는 disk하나를 제거하고 더 큰 하드를 추가하고 resilvering하고, 또 다른
disk하나를 제거하고 더 큰 하드를 추가하는 식으로 용량을 확대할 수 있다. 물론 해당 교체
를 하는 동안 redundancy가 줄어드는 것은 감수해야한다. 만약 하드를 교체하는 작업을
하다가 하드가 사망했다면? 애도를... ㅠㅠ


## 나의 용량 확장기
나는 원래 2TB + 2TB + 4TB + 4TB의 Vault라는 Pool을 만들어서 쓰고 있었다.
구성은 RAID10과 비슷하다고 보면 된다. 2TB 하드 2개를 mirror-1로 묶여 있고 4TB 하드
2개는 mirror-0으로 묶여 있다. mirror-0과 mirror-1 같은 sibling이므로 zfs에서는
stripe (RAID0) 처럼 처리를 한다. 그래서 총 6TB정도 용량을 쓸 수 있다. 

아마존에서 WD EasyStore나 Elements 제품을 파는데 고용량 하드를 저렴하게 구입할 수 
있는 방법이다. 인터넷에서 검색해보면 어떻게 하드를 적출하는지 나와있으니깐 참고하면
되시겠다. 10테라까지는 아직 필요한 것 같지 않아서 저는 8TB 2개 구입을 했다. 
이제 기존의 2TB 하드디스크를 8테라 하드디스크로 교체하는 방식으로 Pool용양 늘려보자.

현재 상태는 아래와 같다.
```console
[root@coearth by-id]# zpool status
  pool: vaul에
 state: ONLINE
  scan: scrub repaired 0B in 0 days 07:15:38 with 0 errors on Wed Jan  1 12:15:40 2020
config:

        NAME                                      STATE     READ WRITE CKSUM
        vault                                     ONLINE       0     0     0
          mirror-0                                ONLINE       0     0     0
            ata-TOSHIBA_MD04ACA400_28M3K8UUFSAA   ONLINE       0     0     0
            ata-TOSHIBA_MD04ACA400N_Y7E1K1UJFFCD  ONLINE       0     0     0
          mirror-1                                ONLINE       0     0     0
            ata-TOSHIBA_DT01ACA200_Y3SR3RPGS      ONLINE       0     0     0
            ata-TOSHIBA_DT01ACA200_Y3STXGAGS      ONLINE       0     0     0

errors: No known data errors
```

zfs보고 mirror-1에 새로운 디스크를 attach하라는 명령을 하자.  
```bash
zpool attach -f vault ata-TOSHIBA_DT01ACA200_Y3SR3RPGS ata-WDC_WD80EMAZ-00WJTA0_JEKW2RXN
```

조금 지나면 이렇게 resilvering이 진행 된다.
```console
[root@coearth by-id]# zpool status
  pool: vault
 state: ONLINE
status: One or more devices is currently being resilvered.  The pool will
        continue to function, possibly in a degraded state.
action: Wait for the resilver to complete.
  scan: resilver in progress since Fri Jan  3 23:08:34 2020
        2.88T scanned at 7.10G/s, 2.47T issued at 6.10G/s, 4.64T total
        29.1G resilvered, 53.23% done, 0 days 00:06:04 to go
config:

        NAME                                      STATE     READ WRITE CKSUM
        vault                                     ONLINE       0     0     0
          mirror-0                                ONLINE       0     0     0
            ata-TOSHIBA_MD04ACA400_28M3K8UUFSAA   ONLINE       0     0     0
            ata-TOSHIBA_MD04ACA400N_Y7E1K1UJFFCD  ONLINE       0     0     0
          mirror-1                                ONLINE       0     0     0
            ata-TOSHIBA_DT01ACA200_Y3SR3RPGS      ONLINE       0     0     0
            ata-TOSHIBA_DT01ACA200_Y3STXGAGS      ONLINE       0     0     0
            ata-WDC_WD80EMAZ-00WJTA0_JEKW2RXN     ONLINE       0     0     0  (resilvering)
```

Resilvering이 완전히 완료된 이후의 모습.
```console
[root@coearth by-id]# zpool status
  pool: vault
 state: ONLINE
  scan: resilvered 1.36T in 0 days 02:58:47 with 0 errors on Sat Jan  4 02:07:21 2020
config:

        NAME                                      STATE     READ WRITE CKSUM
        vault                                     ONLINE       0     0     0
          mirror-0                                ONLINE       0     0     0
            ata-TOSHIBA_MD04ACA400_28M3K8UUFSAA   ONLINE       0     0     0
            ata-TOSHIBA_MD04ACA400N_Y7E1K1UJFFCD  ONLINE       0     0     0
          mirror-1                                ONLINE       0     0     0
            ata-TOSHIBA_DT01ACA200_Y3SR3RPGS      ONLINE       0     0     0
            ata-TOSHIBA_DT01ACA200_Y3STXGAGS      ONLINE       0     0     0
            ata-WDC_WD80EMAZ-00WJTA0_JEKW2RXN     ONLINE       0     0     0

errors: No known data errors
```

이제 더이상 쓸 필요가 없는 2TB 하드를 제거하면 된다. 
```sh
zpool detach vault ata-TOSHIBA_DT01ACA200_Y3SR3RPGS
```
```console
[root@coearth by-id]# zpool status
  pool: vault
 state: ONLINE
  scan: scrub repaired 0B in 0 days 07:18:44 with 0 errors on Sat Jan  4 16:24:28 2020
config:

        NAME                                      STATE     READ WRITE CKSUM
        vault                                     ONLINE       0     0     0
          mirror-0                                ONLINE       0     0     0
            ata-TOSHIBA_MD04ACA400_28M3K8UUFSAA   ONLINE       0     0     0
            ata-TOSHIBA_MD04ACA400N_Y7E1K1UJFFCD  ONLINE       0     0     0
          mirror-1                                ONLINE       0     0     0
            ata-TOSHIBA_DT01ACA200_Y3STXGAGS      ONLINE       0     0     0
            ata-WDC_WD80EMAZ-00WJTA0_JEKW2RXN     ONLINE       0     0     0

errors: No known data errors
```

다른 8TB하드까지 위에 방식은 반복하면 된다. 만약 Sata포트가 남는다면 8TB 하드 둘다
attach한다음에 resilvering하면 시간을 좀 더 아낄 수 있을 것이다.

## Behind the scenes
난장판이다. 

![Mess1](~@assets/img/serverComputer/IMG_2141.jpg)
![Mess2](~@assets/img/serverComputer/IMG_2142.jpg)
## References
1. [ZFS Features and Terminology](https://www.freebsd.org/doc/handbook/zfs-term.html)
1. [zpool Administration](https://www.freebsd.org/doc/handbook/zfs-zpool.html)