import { siteConfig } from '@/site.config'

const enUiText = {
  common: {
    more: 'More',
    postCount: (count: number) => `${count} ${count === 1 ? 'post' : 'posts'}`,
  },
  nav: {
    home: 'Go home',
  },
  search: {
    open: 'Open search',
    openWithShortcut: 'Search (Ctrl+K)',
    close: 'Close search',
    inputLabel: 'Search posts',
    clear: 'Clear search',
    resultsLabel: 'Search results',
    heading: 'Search results',
    headingForQuery: (query: string) => `Search results for "${query}"`,
    resultCount: (count: number) => `${count} ${count === 1 ? 'result' : 'results'}`,
    noResults: (query: string) => `No results for "${query}".`,
    viewAllResults: (query: string) => `View all results for "${query}"`,
    tryAll: 'Search everything',
    loading: 'Loading search index...',
    loadError: 'Could not load search. Please try again.',
    guide: 'Search titles, body text, topics, and audio titles.',
    matchedIn: (fields: string) => `Matched in ${fields}`,
    filters: {
      all: 'All',
      title: 'Title',
      body: 'Body',
      topics: 'Topics',
    },
    fieldBadges: {
      title: 'Title',
      body: 'Body',
      audioTitle: 'Audio',
      topics: 'Topics',
    },
    placeholders: ['Search posts', 'Find topics', 'Search titles or body text', 'What are you looking for?'],
    hints: {
      move: 'Move with arrow keys',
      changeFilter: 'Change filter with left/right',
      open: 'Enter to open',
      select: 'Enter to select',
      multiSelect: 'Ctrl+Enter to keep selecting',
      close: 'Esc to close',
    },
  },
  topic: {
    title: 'Topic search',
    openSearch: 'Open topic search',
    openSearchWithShortcut: 'Topic search (Ctrl+K)',
    searchDialog: 'Topic search',
    closeSearch: 'Close topic search',
    placeholder: 'Find topics',
    clear: 'Clear topic search',
    removeLabel: (topic: string) => `Remove ${topic}`,
    recommended: 'Recommended topics',
    browse: 'Browse topics',
    emptyBrowse: 'Choose a topic to browse.',
    emptyCombination: 'No posts match this topic combination.',
    resetSearch: 'Reset search',
    fallbackNotice: 'No exact matches found, so related posts are shown.',
    noMatches: 'No matching topics.',
  },
  audio: {
    label: 'Audio',
    play: 'Play',
    pause: 'Pause',
    seek: 'Audio position',
    repeatOn: 'Turn repeat on',
    repeatOff: 'Turn repeat off',
  },
  fullscreen: {
    enter: 'Enter fullscreen',
    exit: 'Exit fullscreen',
  },
  textSize: {
    increase: 'Increase text size',
    reset: 'Default text size',
  },
  toc: {
    label: 'Table of contents',
  },
  parentToc: {
    label: 'View table of contents',
    indexLink: 'Open table of contents',
    empty: 'No posts in this table of contents.',
    current: 'Current post',
  },
  indexToc: {
    heading: 'Contents',
    empty: 'No posts in this table of contents.',
  },
  chapter: {
    list: 'Chapter list',
    jumpTo: (label: string, title: string) => `Go to ${label} ${title}`,
  },
  cue: {
    jumpTo: (label: string) => `Go to ${label}`,
  },
  share: {
    label: 'Share link',
  },
  heading: {
    copyLink: 'Copy heading link',
    copied: 'Copied',
  },
  postFooter: {
    title: 'Title',
    info: 'Info',
    audio: 'Audio',
    topics: 'Topics',
    related: 'Related posts',
    backlinks: 'Backlinks',
  },
} as const

type WidenUiText<T> = T extends (...args: infer Args) => infer Return
  ? (...args: Args) => Return
  : T extends string
    ? string
    : T extends readonly string[]
      ? readonly string[]
      : T extends object
        ? { readonly [K in keyof T]: WidenUiText<T[K]> }
        : T

type UiText = WidenUiText<typeof enUiText>

const koUiText = {
  common: {
    more: '더 보기',
    postCount: (count: number) => `${count}개의 글`,
  },
  nav: {
    home: '홈으로 가기',
  },
  search: {
    open: '검색 열기',
    openWithShortcut: '검색 (Ctrl+K)',
    close: '검색 닫기',
    inputLabel: '글 검색',
    clear: '검색어 지우기',
    resultsLabel: '검색 결과',
    heading: '검색 결과',
    headingForQuery: (query: string) => `“${query}” 검색 결과`,
    resultCount: (count: number) => `${count}개의 결과`,
    noResults: (query: string) => `"${query}"에 대한 결과가 없어요.`,
    viewAllResults: (query: string) => `"${query}" 전체 결과 보기`,
    tryAll: '전체에서 다시 검색',
    loading: '검색 인덱스를 불러오는 중...',
    loadError: '검색을 불러오지 못했어요. 다시 시도해 주세요.',
    guide: '제목, 본문, 오디오 제목에서 검색합니다.',
    matchedIn: (fields: string) => `${fields}에서 일치`,
    filters: {
      all: '전체',
      title: '제목',
      body: '본문',
      topics: '주제어',
    },
    fieldBadges: {
      title: '제목',
      body: '본문',
      audioTitle: '오디오',
      topics: '주제어',
    },
    placeholders: ['글 검색', '주제어 찾기', '제목이나 본문 검색', '무엇을 찾고 있나요?'],
    hints: {
      move: '방향키 이동',
      changeFilter: '좌우로 필터 변경',
      open: 'Enter로 열기',
      select: 'Enter로 선택',
      multiSelect: 'Ctrl+Enter로 계속 선택',
      close: 'Esc로 닫기',
    },
  },
  topic: {
    title: '주제어 검색 페이지',
    openSearch: '주제어 검색 열기',
    openSearchWithShortcut: '주제어 검색 (Ctrl+K)',
    searchDialog: '주제어 검색',
    closeSearch: '주제어 검색 닫기',
    placeholder: '주제어 찾기',
    clear: '주제어 검색어 지우기',
    removeLabel: (topic: string) => `${topic} 제거`,
    recommended: '추천 주제어',
    browse: '주제어 둘러보기',
    emptyBrowse: '둘러볼 주제어를 선택해 주세요.',
    emptyCombination: '이 주제어 조합에 맞는 글이 없어요.',
    resetSearch: '검색 초기화',
    fallbackNotice: '정확히 일치하는 글이 없어 관련 글을 보여줍니다.',
    noMatches: '일치하는 주제어가 없어요.',
  },
  audio: {
    label: '오디오',
    play: '재생',
    pause: '일시정지',
    seek: '오디오 재생 위치',
    repeatOn: '반복 재생 켜기',
    repeatOff: '반복 재생 끄기',
  },
  fullscreen: {
    enter: '전체화면 켜기',
    exit: '전체화면 끄기',
  },
  textSize: {
    increase: '글자 크게',
    reset: '기본 글자 크기',
  },
  toc: {
    label: '본문 목차',
  },
  parentToc: {
    label: '목차 보기',
    indexLink: '목차 글 보기',
    empty: '이 목차에 속한 글이 없어요.',
    current: '현재 글',
  },
  indexToc: {
    heading: '목차',
    empty: '이 목차에 속한 글이 없어요.',
  },
  chapter: {
    list: '챕터 목록',
    jumpTo: (label: string, title: string) => `${label} ${title}로 이동`,
  },
  cue: {
    jumpTo: (label: string) => `${label}로 이동`,
  },
  share: {
    label: '링크 공유',
  },
  heading: {
    copyLink: '헤딩 링크 복사',
    copied: '복사됨',
  },
  postFooter: {
    title: '제목',
    info: '정보',
    audio: '오디오',
    topics: '주제어',
    related: '관련 글',
    backlinks: '백링크',
  },
} as const satisfies UiText

export const uiTextDictionaries = {
  en: enUiText,
  ko: koUiText,
  si: enUiText,
} as const satisfies Record<typeof siteConfig.lang, UiText>

export const uiText = uiTextDictionaries[siteConfig.lang] ?? uiTextDictionaries.en
