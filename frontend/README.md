# KDA-FE

# Page 별 구현 기능

### Main Page

[V](MVP) searchBar에 기입한 소환사명의 길이에 따라 SingleSearch, MultiSearch로 분기
[ ] 최근 검색 소환사명 저장
[ ] 즐겨찾기 소환사명 저장

### Single Search Page

[ ](MVP) 검색 소환사명의 소환사 정보 Container 렌더링
[ ](MVP) 검색 소환사의 최근 10경기 정보 렌더링
[ ] 해당 뷰포트 내의 최근 n 경기에 대한 통계 정보 렌더링 + worker 도입해 계산 과정 별도 쓰레드로 분리
[ ] 더보기 버튼 클릭 혹은 스크롤 시 자동으로 API 추가 호출
[ ] 이미지 로딩 중 skeleton 애니메이션 추가

### Multi Search Page

[ ](MVP) 검색 소환사 각각 정보 요약 Container 렌더링
[ ](MVP) 검색 소환사 별 최근 10경기 정보 렌더링
[ ](MVP) 검색 소환사 별 API 에러 처리
[ ] 더보기 탭 추가
