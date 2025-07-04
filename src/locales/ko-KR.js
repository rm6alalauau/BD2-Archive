// Korean language resources
export default {
  // Navigation
  nav: {
    home: '홈',
    settings: '설정',
    feedback: '피드백',
    switchLanguage: '언어 전환',
    languageSelection: '언어 선택'
  },
  
  // Profile/Coupon page
  profile: {
    title: '쿠폰 코드',
    nickname: '게임 닉네임',
    nicknameRequired: '닉네임을 입력해 주세요',
    nicknamePlaceholder: '게임 닉네임을 입력하세요',
    queryButton: '쿠폰 코드 조회',
    loadingTitle: '쿠폰 코드 로딩 중...',
    retryLoadingTitle: '쿠폰 코드 재로딩 중...',
    retryButton: '재로딩',
    processing: '처리 중...',
    
    // User profile
    userProfile: {
      clickAvatarToChange: '아바타를 클릭하여 변경',
      clickNicknameToSwitch: '닉네임을 클릭하여 전환',
      switchNickname: '닉네임 전환',
      reenterNickname: '닉네임 다시 입력',
      selectAvatar: '아바타 선택',
      confirmSelection: '선택 확인'
    },
    
    // API status
    apiStatus: {
      loading: 'API 로딩 중...',
      reloading: '재로딩 중...',
      normal: 'API 연결 정상',
      error: 'API 연결 오류',
      retry: '재시도',
      techDetails: '기술 세부사항'
    },
    
    // Loading states
    loading: {
      waitingApi: 'API 로딩 대기 중',
      processingData: '쿠폰 코드 데이터 처리 중',
      updatingList: '쿠폰 코드 목록 업데이트 중',
      retryingData: '최신 데이터 재획득 중'
    },
    
    // Coupon status
    couponStatus: {
      available: '현재 사용 가능',
      limited: '기간 한정',
      permanent: '영구',
      expired: '기간 만료'
    },
    
    // Action buttons
    actions: {
      copy: '복사',
      copied: '복사됨',
      visitOfficial: '공식 사이트로',
      retry: '재시도',
      clear: '지우기',
      confirm: '확인',
      cancel: '취소',
      reload: '다시 로딩',
      reloadCoupons: '쿠폰 코드 다시 로딩',
      claim: '교환',
      claimed: '교환 완료'
    },
    
    // Error messages
    errors: {
      loadFailed: '로딩 실패',
      networkError: '네트워크 연결 오류',
      apiError: 'API 오류',
      unknownError: '알 수 없는 오류',
      nicknameValidationFailed: '닉네임 검증에 실패했습니다. 닉네임이 올바른지 확인해 주세요',
      couponExpired: '쿠폰 코드가 만료되었습니다',
      invalidCoupon: '유효하지 않은 쿠폰 코드',
      alreadyUsed: '이 시리얼 번호는 이미 사용되었습니다',
      claimSuccess: '교환 성공',
      claimFailed: '교환에 실패했습니다. 페이지를 새로고침한 후 다시 시도해 주세요',
      requestTimeout: '요청 시간 초과, 다시 시도해 주세요',
      networkConnection: '네트워크 연결에 문제가 있습니다. 네트워크를 확인한 후 다시 시도해 주세요',
      serverError: '서버가 일시적으로 사용할 수 없습니다. 나중에 다시 시도해 주세요',
      rateLimited: '너무 많은 요청입니다. 잠시 후 다시 시도해 주세요'
    },
    
    // Nickname management
    nickname: {
      saved: '저장된 닉네임',
      switch: '닉네임 전환',
      delete: '닉네임 삭제',
      current: '현재 사용 중',
      using: '사용 중',
      switchTo: '전환',
      noSaved: '저장된 닉네임이 없습니다',
      autoSaveHint: '닉네임을 입력하면 자동으로 저장되어 다음번에 빠르게 선택할 수 있습니다',
      confirmDelete: '이 닉네임을 삭제하시겠습니까?'
    },
    
    // Help text
    helpText: {
      reloadHint: '쿠폰 코드가 올바르게 로딩되지 않은 경우, 여기를 클릭하여 다시 로딩하세요',
      solutionTitle: '로딩 문제 해결 방법:',
      solution1: 'API 로딩 중에 닉네임을 제출하면 쿠폰 코드가 올바르게 표시되지 않을 수 있습니다',
      solution2: '위의 "쿠폰 코드 다시 로딩" 버튼을 클릭',
      solution3: '또는 "종료"를 클릭하여 닉네임을 다시 입력'
    },
    
    // Network status
    network: {
      checking: '쿠폰 서비스 연결 확인 중...',
      slow: '쿠폰 서비스 응답이 느립니다. 잠시만 기다려 주세요',
      unreachable: '쿠폰 서비스에 연결할 수 없습니다. 네트워크를 확인해 주세요',
      corsError: 'iOS Safari 호환성 문제'
    }
  },
  
  // News
  news: {
    title: '공식 뉴스',
    noData: '뉴스 데이터가 없습니다',
    loading: '로딩 중...',
    loadFailed: '로딩 실패',
    
    // Date related
    date: {
      today: '오늘',
      yesterday: '어제',
      daysAgo: '일 전'
    },
    
    // Tags
    tags: {
      notice: '공지사항',
      maintenance: '점검',
      event: '이벤트',
      dev_note: '개발자 노트',
      package_deal: '패키지',
      issue: '알려진 문제'
    }
  },
  
  // Official media
  media: {
    title: '공식 미디어',
    noData: '최근 공식 미디어가 없습니다',
    loading: '로딩 중...',
    loadFailed: '로딩 실패',
    watchVideo: '비디오 시청'
  },
  
  // Forums
  forums: {
    title: '커뮤니티 포럼',
    bahamut: '바하무트',
    nga: 'NGA',
    ptt: 'PTT',
    x: 'X (Twitter)',
    reddit: 'Reddit',
    noData: '포럼 데이터가 없습니다',
    loading: '로딩 중...',
    loadFailed: '로딩 실패'
  },
  
  // Pixiv card
  pixiv: {
    title: 'Pixiv 인기 작품',
    viewMore: '더 보기',
    noData: '작품 데이터가 없습니다',
    loading: '로딩 중...',
    loadFailed: '로딩 실패'
  },
  
  // Settings page
  settings: {
    title: '설정',
    subtitle: '사용 경험을 맞춤 설정하세요',
    
    // Display settings
    display: {
      title: '표시 설정',
      fontSize: '글꼴 크기',
      fontSizeDescription: '인터페이스 글꼴 표시 크기 조정',
      r18Content: 'R18 콘텐츠',
      r18Description: 'R18 관련 콘텐츠 표시'
    },
    
    // Content settings
    contentSettings: {
      title: '콘텐츠 설정',
      r18Content: 'Pixiv R18 콘텐츠',
      r18Description: '성인 콘텐츠 표시 여부 (18세 이상 필요)'
    },
    
    // Forum settings
    forumSettings: {
      title: '포럼 표시 설정',
      description: '표시할 포럼 선택',
      minRequired: '최소 하나의 포럼 소스를 선택해야 합니다'
    },
    
    // Data management
    dataManagement: {
      title: '데이터 관리',
      clearUserData: '사용자 데이터 지우기',
      clearDescription: '저장된 닉네임과 교환 기록 지우기',
      clearButton: '데이터 지우기',
      resetSettings: '설정 초기화',
      resetDescription: '모든 설정을 기본값으로 복원',
      resetButton: '기본값으로 복원',
      resetHint: '모든 설정을 기본 상태로 복원'
    },
    
    // Actions
    actions: {
      backToHome: '홈으로 돌아가기'
    },
    
    // Confirm dialog
    confirmDialog: {
      clearDataTitle: '데이터 지우기 확인',
      clearDataMessage: '이 작업으로 다음 데이터가 지워집니다:',
      clearDataItems: [
        '저장된 게임 닉네임',
        '쿠폰 코드 사용 기록',
        '아바타 선택 기록'
      ],
      clearDataWarning: '이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?',
      
      resetTitle: '설정 초기화 확인',
      resetMessage: '이 작업으로 모든 설정이 기본값으로 복원됩니다:',
      resetItems: [
        '글꼴 크기: 100%',
        'R18 콘텐츠: 끄기',
        '포럼 표시: 모두 활성화',
        '언어: 번체 중국어'
      ],
      resetWarning: '모든 설정을 초기화하시겠습니까?',
      
      confirm: '확인',
      cancel: '취소'
    },
    
    // Success messages
    success: {
      cleared: '데이터가 지워졌습니다',
      reset: '설정이 초기화되었습니다',
      saved: '설정이 저장되었습니다'
    }
  },
  
  // Feedback page
  feedback: {
    title: '피드백',
    description: '사용 경험 개선에 도움을 주세요',
    cardTitle: '의견을 공유해 주세요',
    formDescription: '소중한 의견을 제공해 주셔서 감사합니다. 여러분의 피드백은 웹사이트 기능과 사용자 경험을 지속적으로 개선하는 데 도움이 됩니다.',
    
    // Form
    form: {
      issueType: '문제 유형',
      issueTypePlaceholder: '문제 유형을 선택하세요',
      description: '상세 설명',
      descriptionPlaceholder: '겪으신 문제나 제안 사항에 대해 설명해 주세요',
      nickname: '닉네임',
      nicknamePlaceholder: '(선택사항)',
      submit: '피드백 전송'
    },
    
    // Issue types
    issueTypes: {
      bug: '앱 충돌 또는 버그',
      content: '텍스트/콘텐츠 오류',
      suggestion: '제안',
      other: '기타'
    },
    
    // System info
    systemInfo: {
      title: '시스템 정보',
      description: '문제 해결을 더 잘 지원하기 위해 기기 정보를 자동으로 첨부합니다'
    },
    
    // Validation
    validation: {
      required: '이 항목은 필수입니다',
      maxLength: '길이는 {limit}자를 초과할 수 없습니다'
    },
    
    // Errors
    errors: {
      validation: '양식의 오류를 수정한 후 제출해 주세요.'
    },
    
    // Results
    success: '소중한 피드백 감사합니다! 의견을 성공적으로 받았으며, 신중히 평가하여 지속적으로 개선해 나가겠습니다.',
    error: '전송 중 알 수 없는 오류가 발생했습니다. 나중에 다시 시도해 주세요. 문제가 지속되면 직접 연락해 주세요.',
    
    // Privacy
    privacy: {
      title: '개인정보 보호',
      description: '제공해 주신 모든 정보는 문제 해결과 기능 최적화를 위해서만 사용됩니다. 개인정보 보호를 약속드립니다.'
    }
  },
  
  // Common
  common: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    retry: '재시도',
    confirm: '확인',
    cancel: '취소',
    close: '닫기',
    save: '저장',
    delete: '삭제',
    edit: '편집',
    back: '뒤로',
    next: '다음',
    previous: '이전',
    submit: '제출',
    reset: '초기화',
    clear: '지우기',
    search: '검색',
    filter: '필터',
    sort: '정렬',
    more: '더 보기',
    less: '접기',
    expand: '펼치기',
    collapse: '접기',
    select: '선택',
    deselect: '선택 해제',
    selectAll: '모두 선택',
    deselectAll: '모두 선택 해제',
    apply: '적용',
    preview: '미리보기',
    download: '다운로드',
    upload: '업로드',
    copy: '복사',
    paste: '붙여넣기',
    cut: '잘라내기',
    undo: '실행 취소',
    redo: '다시 실행',
    refresh: '새로고침',
    update: '업데이트',
    sync: '동기화',
    import: '가져오기',
    export: '내보내기',
    print: '인쇄',
    share: '공유',
    help: '도움말',
    about: '정보',
    version: '버전',
    settings: '설정',
    profile: '프로필',
    account: '계정',
    logout: '로그아웃',
    login: '로그인',
    register: '등록',
    forgotPassword: '비밀번호 찾기',
    changePassword: '비밀번호 변경',
    success: '성공',
    warning: '경고',
    info: '정보',
    question: '질문',
    yes: '예',
    no: '아니오',
    ok: '확인',
    undefined: '정의되지 않음',
    null: 'null',
    empty: '비어있음',
    notFound: '찾을 수 없음',
    notAvailable: '사용할 수 없음',
    comingSoon: '곧 출시',
    maintenance: '점검 중',
    offline: '오프라인',
    online: '온라인',
    connecting: '연결 중',
    connected: '연결됨',
    disconnected: '연결 끊김',
    syncing: '동기화 중',
    synced: '동기화됨',
    updated: '업데이트됨',
    saved: '저장됨',
    deleted: '삭제됨',
    copied: '복사됨',
    pasted: '붙여넣기됨',
    uploaded: '업로드됨',
    downloaded: '다운로드됨'
  }
} 