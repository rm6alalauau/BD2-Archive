// 繁體中文語言資源
export default {
  // 通用詞彙
  common: {
    today: '今天'
  },
  
  // 導航欄
  nav: {
    home: '首頁',
    settings: '設定',
    feedback: '意見回饋',
    switchLanguage: '切換語言',
    languageSelection: '語言選擇',
    openMenu: '開啟選單',
    closeMenu: '關閉選單'
  },
  
  // 個人資料/兌換碼頁面
  profile: {
    title: '兌換碼',
    nickname: '遊戲暱稱',
    nicknameRequired: '請輸入暱稱',
    nicknamePlaceholder: '遊戲暱稱',
    nicknameInputPlaceholder: '請輸入您的遊戲暱稱',
    queryButton: '查詢兌換碼',
    loadingTitle: '載入兌換碼中...',
    retryLoadingTitle: '重新載入兌換碼中...',
    retryButton: '重新載入',
    processing: '處理中...',
    
    // 用戶資訊
    userProfile: {
      clickAvatarToChange: '點擊頭像可更換 • 點擊暱稱可切換',
      clickNicknameToSwitch: '點擊暱稱可切換',
      switchNickname: '切換',
      reenterNickname: '重新輸入暱稱',
      selectAvatar: '選擇頭像',
      confirmSelection: '確認選擇'
    },
    
    // API 狀態
    apiStatus: {
      loading: 'API 載入中...',
      reloading: '重新載入中...',
      normal: 'API 連線正常',
      error: 'API 連線異常',
      retry: '重試',
      techDetails: '技術細節'
    },
    
    // 載入狀態
    loading: {
      waitingApi: '正在等待API載入完成',
      processingData: '正在處理兌換碼資料',
      updatingList: '正在更新兌換碼列表',
      retryingData: '重新獲取最新資料'
    },
    
    // 狀態
    status: {
      limited: '限時可用',
      available: '目前可用',
      active: '目前可用',
      permanent: '永久',
      expired: '已過期',
      unknown: '未知狀態',
      // 如果您需要更多狀態，可以添加：
      // coming_soon: '即將推出',
      // maintenance: '維護中',
      // special: '特殊活動'
    },
    
    // 操作按鈕
    actions: {
      copy: '複製',
      copied: '已複製',
      visitOfficial: '前往官網',
      retry: '重試',
      clear: '清除',
      confirm: '確認',
      cancel: '取消',
      reload: '重新載入',
      reloadCoupons: '重新載入兌換碼',
      claim: '兌換',
      claimed: '已兌換'
    },
    
    // 錯誤訊息
    errors: {
      loadFailed: '載入失敗',
      networkError: '網路連線錯誤',
      apiError: 'API 錯誤',
      unknownError: '未知錯誤',
      nicknameValidationFailed: '暱稱驗證失敗，請確認暱稱是否正確',
      couponExpired: '兌換碼已過期',
      invalidCoupon: '無效的兌換碼',
      alreadyUsed: '您的帳號先前已兌換過此序號',
      claimSuccess: '兌換成功',
      claimFailed: '兌換失敗，請重新整理頁面後再試',
      requestTimeout: '請求超時，請重試',
      networkConnection: '網路連線問題，請檢查網路後重試',
      serverError: '伺服器暫時無法回應，請稍後重試',
      rateLimited: '請求過於頻繁，請稍後再試'
    },
    
    // 暱稱管理
    nickname: {
      saved: '已儲存的暱稱',
      switch: '選擇暱稱',
      delete: '刪除暱稱',
      current: '使用中',
      using: '使用中',
      switchTo: '切換',
      noSaved: '暫無已保存的暱稱',
      autoSaveHint: '輸入暱稱後會自動保存，方便下次快速選擇',
      confirmDelete: '確認刪除此暱稱？',
      deleteTitle: '刪除此暱稱'
    },
    
    // 幫助文字
    helpText: {
      reloadHint: '如果兌換碼未正確載入，點擊此處重新載入',
      solutionTitle: '載入問題解決方案：',
      solution1: '如果提交暱稱時API尚未載入完成，可能導致兌換碼無法正確顯示',
      solution2: '點擊上方「重新載入兌換碼」',
      solution3: '或者點擊「退出」重新輸入暱稱'
    },
    
    // 網路狀態
    network: {
      checking: '正在檢測兌換服務連接...',
      slow: '兌換服務回應較慢，請稍候',
      unreachable: '無法連接兌換服務，請檢查網路',
      corsError: 'iOS Safari 兼容性問題'
    },
    nicknameHelpTitle: '什麼是遊戲暱稱？',
    nicknameHelp: '請輸入您在遊戲內的暱稱（如圖所示），否則無法正確領取獎勵。',
    nicknameDialogTitle: '選擇暱稱'
  },
  
  // 新聞
  news: {
    title: '官方新聞',
    noData: '目前沒有新聞資料',
    loading: '載入中...',
    loadFailed: '載入失敗',
    
    // 日期相關
    date: {
      today: '今天',
      yesterday: '昨天',
      daysAgo: '天前'
    },
    
    // 標籤
    tags: {
      notice: '公告事項',
      maintenance: '維護',
      event: '活動',
      dev_note: '開發者筆記',
      package_deal: '禮包商品',
      issue: '遊戲已知問題'
    }
  },
  
  // 官方媒體
  media: {
    title: '官方媒體',
    noData: '近期沒有新的官方媒體',
    loading: '載入中...',
    loadFailed: '載入失敗',
    watchVideo: '觀看影片'
  },
  
  // 論壇
  forums: {
    title: '社群論壇',
    bahamut: '巴哈姆特',
    nga: 'NGA',
    ptt: 'PTT',
    x: 'X (Twitter)',
    reddit: 'Reddit',
    naver: 'Naver Lounge',
    noData: '目前沒有論壇資料',
    loading: '載入中...',
    loadFailed: '載入失敗'
  },
  
  // Pixiv 卡片
  pixiv: {
    title: 'Pixiv 熱門作品',
    viewMore: '查看更多',
    noData: '目前沒有作品資料',
    loading: '載入中...',
    loadFailed: '載入失敗'
  },
  
  // 設定頁面
  settings: {
    title: '設定',
    subtitle: '自訂您的使用體驗',
    
    // 顯示設定
    display: {
      title: '顯示設定',
      fontSize: '字體大小',
      fontSizeDescription: '調整介面字體的顯示大小',
      r18Content: 'R18 內容',
      r18Description: '顯示 R18 相關內容',
      websiteIcon: '網站圖示',
      websiteIconDescription: '選擇你喜歡的網站圖示'
    },
    
    // 內容設定
    contentSettings: {
      title: '內容設定',
      r18Content: 'Pixiv R18 內容',
      r18Description: '是否顯示成人內容（需滿 18 歲）'
    },
    
    // 論壇設定
    forumSettings: {
      title: '論壇顯示設定',
      description: '選擇要顯示的論壇',
      minRequired: '至少需要選擇一個論壇來源'
    },
    
    // 資料管理
    dataManagement: {
      title: '資料管理',
      clearUserData: '清除用戶資料',
      clearDescription: '清除已儲存的暱稱和兌換記錄',
      clearButton: '清除資料',
      resetSettings: '重置設定',
      resetDescription: '恢復所有設定為預設值',
      resetButton: '還原預設值',
      resetHint: '將所有設定恢復為預設狀態'
    },
    
    // 按鈕和操作
    actions: {
      backToHome: '返回首頁'
    },
    
    // 確認對話框
    confirmDialog: {
      clearDataTitle: '確認清除資料',
      clearDataMessage: '此操作將清除以下資料：',
      clearDataItems: [
        '已儲存的遊戲暱稱',
        '兌換碼使用記錄', 
        '頭像選擇記錄'
      ],
      clearDataWarning: '此操作無法復原，確定要繼續嗎？',
      
      resetTitle: '確認重置設定',
      resetMessage: '此操作將恢復所有設定為預設值：',
      resetItems: [
        '字體大小：100%',
        'R18 內容：關閉',
        '論壇顯示：全部開啟',
        '語言：繁體中文'
      ],
      resetWarning: '確定要重置所有設定嗎？',
      
      confirm: '確定',
      cancel: '取消'
    },
    
    // 成功訊息
    success: {
      cleared: '資料已清除',
      reset: '設定已重置',
      saved: '設定已儲存',
      iconChanged: '網站圖示已切換！',
      forumsUpdated: '論壇設定已更新，正在重新載入數據...'
    },
    supportTitle: '支持 The BD2 Pulse 持續運行',
    supportContent: `大家好，我是本站的開發者。
感謝每一位使用 The BD2 Pulse 的玩家！看到這個小工具能為大家帶來便利，是我最大的動力。
為了應對日益增長的訪問量，並確保網站能持續提供快速、穩定的服務，我已將網站的基礎設施升級至付費方案。
如果您覺得這個網站對您有幫助，並且願意支持它的長期運營，歡迎通過下方的連結「請我喝杯咖啡」。您的任何一點支持，都將直接用於支付伺服器和網域名稱的費用，並激勵我投入更多時間來維護和開發新功能。
再次感謝大家的支持！`,
  },
  
  // 意見回饋頁面
  feedback: {
    title: '意見回饋',
    description: '協助我們改善您的使用體驗',
    cardTitle: '分享您的想法',
    formDescription: '感謝您花時間提供寶貴的意見。您的回饋將幫助我們持續改善網站功能與使用體驗。',
    
    // 表單
    form: {
      issueType: '問題類型',
      issueTypePlaceholder: '請選擇問題類型',
      description: '詳細描述',
      descriptionPlaceholder: '請描述您遇到的問題或您的建議',
      nickname: '您的暱稱',
      nicknamePlaceholder: '(選填)',
      submit: '送出回饋'
    },
    
    // 問題類型
    issueTypes: {
      bug: '閃退或 Bug',
      content: '文本、內容錯誤',
      suggestion: '建議',
      other: '其他'
    },
    
    // 系統資訊
    systemInfo: {
      title: '系統資訊',
      description: '為了更好地協助您解決問題，我們將自動附加您的設備資訊'
    },
    
    // 驗證
    validation: {
      required: '此為必填欄位',
      maxLength: '長度不能超過 {limit} 個字'
    },
    
    // 錯誤
    errors: {
      validation: '請修正表單中的錯誤後再次提交。'
    },
    
    // 結果
    success: '感謝您的寶貴回饋！我們已成功收到您的意見，將會仔細評估並持續改善。',
    error: '發送時發生未知錯誤，請稍後再試。如問題持續發生，請直接聯繫我們。',
    
    // 隱私
    privacy: {
      title: '隱私保護',
      description: '您提供的所有資訊僅用於問題排查與功能優化，我們承諾保護您的隱私。'
    }
  },
  
  // 通用
  common: {
    loading: '載入中...',
    error: '發生錯誤',
    retry: '重試',
    confirm: '確認',
    cancel: '取消',
    close: '關閉',
    save: '儲存',
    delete: '刪除',
    edit: '編輯',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    submit: '送出',
    reset: '重置',
    clear: '清除',
    search: '搜尋',
    filter: '篩選',
    sort: '排序',
    more: '更多',
    less: '收起',
    expand: '展開',
    collapse: '收合',
    select: '選擇',
    deselect: '取消選擇',
    selectAll: '全選',
    deselectAll: '全不選',
    apply: '套用',
    preview: '預覽',
    download: '下載',
    upload: '上傳',
    copy: '複製',
    paste: '貼上',
    cut: '剪下',
    undo: '復原',
    redo: '重做',
    refresh: '重新整理',
    update: '更新',
    sync: '同步',
    import: '匯入',
    export: '匯出',
    print: '列印',
    share: '分享',
    help: '說明',
    about: '關於',
    version: '版本',
    settings: '設定',
    profile: '個人資料',
    account: '帳戶',
    logout: '登出',
    login: '登入',
    register: '註冊',
    forgotPassword: '忘記密碼',
    changePassword: '變更密碼',
    success: '成功',
    warning: '警告',
    info: '資訊',
    question: '問題',
    yes: '是',
    no: '否',
    ok: '確定',
    undefined: '未定義',
    null: '無',
    empty: '空白',
    notFound: '找不到',
    notAvailable: '不可用',
    comingSoon: '即將推出',
    maintenance: '維護中',
    offline: '離線',
    online: '線上',
    connecting: '連接中',
    connected: '已連接',
    disconnected: '已斷線',
    syncing: '同步中',
    synced: '已同步',
    updated: '已更新',
    saved: '已儲存',
    deleted: '已刪除',
    copied: '已複製',
    pasted: '已貼上',
    uploaded: '已上傳',
    downloaded: '已下載'
  },
  
  // 免責聲明
  disclaimer: {
    title: '免責聲明與版權資訊',
    nav: '免責聲明與版權資訊',
    short: '本站為非官方粉絲資訊站，與《棕色塵埃2》官方無任何關聯',
    content: {
      title: '免責聲明與版權資訊',
      section1: {
        title: '網站定位與獨立性',
        content: '本網站 (The BD2 Pulse) 為玩家自發創建的非官方粉絲資訊站，旨在為《棕色塵埃2》社群提供便利的資訊聚合服務。本站與遊戲開發商 NEOWIZ 及《棕色塵埃2》營運團隊無任何關聯，亦未獲得其任何形式的背書或認可。'
      },
      section2: {
        title: '智慧財產權歸屬',
        content: '本網站所引用之《棕色塵埃2》相關的所有商標、角色、圖像、文本、影音及其他知識產權，其著作權與智慧財產權均歸屬於原權利人 (NEOWIZ) 所有。本站對這些內容的使用，遵循官方發布的「二次創作指引」及合理使用原則，僅供社群玩家參考、討論與交流之用。'
      },
      section3: {
        title: '內容的準確性',
        content: '本站致力於提供準確、即時的資訊，但無法保證所有內容（包括但不限於兌換碼狀態、社群文章等）的絕對正確性與即時性。所有遊戲相關的官方資訊，請一律以《棕色塵埃2》官方網站或遊戲內公告為最終依據。'
      },
      section4: {
        title: '第三方內容與連結',
        content: '本網站聚合了來自 Pixiv, X (Twitter), 巴哈姆特等第三方平台的內容。這些內容的版權歸原創作者所有。本站僅為方便檢索而提供預覽和連結，不對其內容的準確性、合法性負責。訪問這些第三方連結所產生的任何後果，由使用者自行承擔。'
      },
      section5: {
        title: '非營利聲明與贊助',
        content: '本站目前為非營利性質。所有可能獲得的贊助款項，將全數用於支付伺服器、網域名稱等網站基礎設施的維護成本，以支持本站的持續運營。'
      },
      section6: {
        title: '版權問題聯繫',
        content: '我們尊重所有版權所有者的權利。如果您認為本站的任何內容侵害了您的合法權益，請通過意見回饋與我聯繫。在收到通知後，將立即進行審核並移除相關內容。'
      }
    }
  }
} 