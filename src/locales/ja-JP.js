// Japanese language resources
export default {
  // Navigation
  nav: {
    home: 'ホーム',
    settings: '設定',
    feedback: 'フィードバック',
    switchLanguage: '言語切り替え',
    languageSelection: '言語選択'
  },
  
  // Profile/Coupon page
  profile: {
    title: 'クーポンコード',
    nickname: 'ゲームニックネーム',
    nicknameRequired: 'ニックネームを入力してください',
    nicknamePlaceholder: 'ゲームニックネームを入力',
    queryButton: 'クーポンコード照会',
    loadingTitle: 'クーポンコード読み込み中...',
    retryLoadingTitle: 'クーポンコード再読み込み中...',
    retryButton: '再読み込み',
    processing: '処理中...',
    
    // User profile
    userProfile: {
      clickAvatarToChange: 'アバターをクリックして変更',
      clickNicknameToSwitch: 'ニックネームをクリックして切り替え',
      switchNickname: 'ニックネーム切り替え',
      reenterNickname: 'ニックネーム再入力',
      selectAvatar: 'アバター選択',
      confirmSelection: '選択確認'
    },
    
    // API status
    apiStatus: {
      loading: 'API読み込み中...',
      reloading: '再読み込み中...',
      normal: 'API接続正常',
      error: 'API接続エラー',
      retry: '再試行',
      techDetails: '技術詳細'
    },
    
    // Loading states
    loading: {
      waitingApi: 'API読み込み待機中',
      processingData: 'クーポンコードデータ処理中',
      updatingList: 'クーポンコードリスト更新中',
      retryingData: '最新データ再取得中'
    },
    
    // Coupon status
    couponStatus: {
      available: '現在利用可能',
      limited: '期間限定',
      permanent: '永続',
      expired: '期限切れ'
    },
    
    // Action buttons
    actions: {
      copy: 'コピー',
      copied: 'コピーしました',
      visitOfficial: '公式サイトへ',
      retry: '再試行',
      clear: 'クリア',
      confirm: '確認',
      cancel: 'キャンセル',
      reload: '再読み込み',
      reloadCoupons: 'クーポンコード再読み込み',
      claim: '引き換え',
      claimed: '引き換え済み'
    },
    
    // Error messages
    errors: {
      loadFailed: '読み込み失敗',
      networkError: 'ネットワーク接続エラー',
      apiError: 'APIエラー',
      unknownError: '不明なエラー',
      nicknameValidationFailed: 'ニックネーム検証に失敗しました。ニックネームが正しいかご確認ください',
      couponExpired: 'クーポンコードが期限切れです',
      invalidCoupon: '無効なクーポンコード',
      alreadyUsed: 'このシリアル番号は既に使用されています',
      claimSuccess: '引き換え成功',
      claimFailed: '引き換えに失敗しました。ページを更新してもう一度お試しください',
      requestTimeout: 'リクエストタイムアウト、再試行してください',
      networkConnection: 'ネットワーク接続に問題があります。ネットワークを確認して再試行してください',
      serverError: 'サーバーが一時的に利用できません。後でもう一度お試しください',
      rateLimited: 'リクエストが多すぎます。しばらくしてから再試行してください'
    },
    
    // Nickname management
    nickname: {
      saved: '保存されたニックネーム',
      switch: 'ニックネーム切り替え',
      delete: 'ニックネーム削除',
      current: '現在使用中',
      using: '使用中',
      switchTo: '切り替え',
      noSaved: '保存されたニックネームはありません',
      autoSaveHint: 'ニックネームは自動保存され、次回から簡単に選択できます',
      confirmDelete: 'このニックネームを削除しますか？'
    },
    
    // Help text
    helpText: {
      reloadHint: 'クーポンコードが正しく読み込まれない場合、ここをクリックして再読み込みしてください',
      solutionTitle: '読み込み問題の解決方法：',
      solution1: 'API読み込み中にニックネームを送信すると、クーポンコードが正しく表示されない場合があります',
      solution2: '上の「クーポンコード再読み込み」ボタンをクリック',
      solution3: 'または「終了」をクリックしてニックネームを再入力'
    },
    
    // Network status
    network: {
      checking: 'クーポンサービス接続確認中...',
      slow: 'クーポンサービスの応答が遅くなっています。お待ちください',
      unreachable: 'クーポンサービスに接続できません。ネットワークをご確認ください',
      corsError: 'iOS Safari互換性の問題'
    }
  },
  
  // News
  news: {
    title: '公式ニュース',
    noData: 'ニュースデータがありません',
    loading: '読み込み中...',
    loadFailed: '読み込み失敗',
    
    // Date related
    date: {
      today: '今日',
      yesterday: '昨日',
      daysAgo: '日前'
    },
    
    // Tags
    tags: {
      notice: 'お知らせ',
      maintenance: 'メンテナンス',
      event: 'イベント',
      dev_note: '開発者ノート',
      package_deal: 'パッケージ',
      issue: '既知の問題'
    }
  },
  
  // Official media
  media: {
    title: '公式メディア',
    noData: '最近の公式メディアはありません',
    loading: '読み込み中...',
    loadFailed: '読み込み失敗',
    watchVideo: '動画を見る'
  },
  
  // Forums
  forums: {
    title: 'コミュニティフォーラム',
    bahamut: 'バハムート',
    nga: 'NGA',
    ptt: 'PTT',
    x: 'X (Twitter)',
    reddit: 'Reddit',
    noData: 'フォーラムデータがありません',
    loading: '読み込み中...',
    loadFailed: '読み込み失敗'
  },
  
  // Pixiv card
  pixiv: {
    title: 'Pixiv人気作品',
    viewMore: 'もっと見る',
    noData: '作品データがありません',
    loading: '読み込み中...',
    loadFailed: '読み込み失敗'
  },
  
  // Settings page
  settings: {
    title: '設定',
    subtitle: '使用体験をカスタマイズ',
    
    // Display settings
    display: {
      title: '表示設定',
      fontSize: 'フォントサイズ',
      fontSizeDescription: 'インターフェースのフォント表示サイズを調整',
      r18Content: 'R18コンテンツ',
      r18Description: 'R18関連コンテンツを表示'
    },
    
    // Content settings
    contentSettings: {
      title: 'コンテンツ設定',
      r18Content: 'Pixiv R18コンテンツ',
      r18Description: '成人向けコンテンツを表示するか（18歳以上必須）'
    },
    
    // Forum settings
    forumSettings: {
      title: 'フォーラム表示設定',
      description: '表示するフォーラムを選択',
      minRequired: '少なくとも1つのフォーラムソースを選択する必要があります'
    },
    
    // Data management
    dataManagement: {
      title: 'データ管理',
      clearUserData: 'ユーザーデータクリア',
      clearDescription: '保存されたニックネームと交換記録をクリア',
      clearButton: 'データクリア',
      resetSettings: '設定リセット',
      resetDescription: 'すべての設定をデフォルト値に復元',
      resetButton: 'デフォルトに戻す',
      resetHint: 'すべての設定をデフォルト状態に復元'
    },
    
    // Actions
    actions: {
      backToHome: 'ホームに戻る'
    },
    
    // Confirm dialog
    confirmDialog: {
      clearDataTitle: 'データクリア確認',
      clearDataMessage: 'この操作により以下のデータがクリアされます：',
      clearDataItems: [
        '保存されたゲームニックネーム',
        'クーポンコード使用記録',
        'アバター選択記録'
      ],
      clearDataWarning: 'この操作は取り消せません。続行しますか？',
      
      resetTitle: '設定リセット確認',
      resetMessage: 'この操作によりすべての設定がデフォルト値に復元されます：',
      resetItems: [
        'フォントサイズ：100%',
        'R18コンテンツ：オフ',
        'フォーラム表示：すべて有効',
        '言語：繁体字中国語'
      ],
      resetWarning: 'すべての設定をリセットしますか？',
      
      confirm: '確認',
      cancel: 'キャンセル'
    },
    
    // Success messages
    success: {
      cleared: 'データがクリアされました',
      reset: '設定がリセットされました',
      saved: '設定が保存されました'
    }
  },
  
  // Feedback page
  feedback: {
    title: 'フィードバック',
    description: 'ユーザー体験の改善にご協力ください',
    cardTitle: 'ご意見をお聞かせください',
    formDescription: '貴重なご意見をお寄せいただき、ありがとうございます。皆様のフィードバックは、ウェブサイトの機能とユーザー体験の継続的な改善に役立てさせていただきます。',
    
    // Form
    form: {
      issueType: '問題の種類',
      issueTypePlaceholder: '問題の種類を選択してください',
      description: '詳細な説明',
      descriptionPlaceholder: '遭遇した問題やご提案について詳しく説明してください',
      nickname: 'ニックネーム',
      nicknamePlaceholder: '（任意）',
      submit: 'フィードバック送信'
    },
    
    // Issue types
    issueTypes: {
      bug: 'クラッシュまたはバグ',
      content: 'テキスト・コンテンツエラー',
      suggestion: '提案',
      other: 'その他'
    },
    
    // System info
    systemInfo: {
      title: 'システム情報',
      description: '問題解決をより良くサポートするため、デバイス情報を自動的に添付いたします'
    },
    
    // Validation
    validation: {
      required: 'この項目は必須です',
      maxLength: '長さは{limit}文字を超えることはできません'
    },
    
    // Errors
    errors: {
      validation: 'フォームのエラーを修正してから送信してください。'
    },
    
    // Results
    success: '貴重なフィードバックをありがとうございます！ご意見を受け取りました。慎重に評価し、継続的な改善に取り組んでまいります。',
    error: '送信中に不明なエラーが発生しました。後でもう一度お試しください。問題が続く場合は、直接お問い合わせください。',
    
    // Privacy
    privacy: {
      title: 'プライバシー保護',
      description: 'ご提供いただいたすべての情報は、問題の解決と機能の最適化のためのみに使用されます。プライバシーの保護をお約束いたします。'
    }
  },
  
  // Common
  common: {
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    retry: '再試行',
    confirm: '確認',
    cancel: 'キャンセル',
    close: '閉じる',
    save: '保存',
    delete: '削除',
    edit: '編集',
    back: '戻る',
    next: '次へ',
    previous: '前へ',
    submit: '送信',
    reset: 'リセット',
    clear: 'クリア',
    search: '検索',
    filter: 'フィルター',
    sort: '並び替え',
    more: 'もっと見る',
    less: '閉じる',
    expand: '展開',
    collapse: '折りたたむ',
    select: '選択',
    deselect: '選択解除',
    selectAll: 'すべて選択',
    deselectAll: 'すべて選択解除',
    apply: '適用',
    preview: 'プレビュー',
    download: 'ダウンロード',
    upload: 'アップロード',
    copy: 'コピー',
    paste: '貼り付け',
    cut: '切り取り',
    undo: '元に戻す',
    redo: 'やり直し',
    refresh: '更新',
    update: '更新',
    sync: '同期',
    import: 'インポート',
    export: 'エクスポート',
    print: '印刷',
    share: '共有',
    help: 'ヘルプ',
    about: '情報',
    version: 'バージョン',
    settings: '設定',
    profile: 'プロフィール',
    account: 'アカウント',
    logout: 'ログアウト',
    login: 'ログイン',
    register: '登録',
    forgotPassword: 'パスワードを忘れた',
    changePassword: 'パスワード変更',
    success: '成功',
    warning: '警告',
    info: '情報',
    question: '質問',
    yes: 'はい',
    no: 'いいえ',
    ok: 'OK',
    undefined: '未定義',
    null: 'null',
    empty: '空',
    notFound: '見つかりません',
    notAvailable: '利用できません',
    comingSoon: '近日公開',
    maintenance: 'メンテナンス中',
    offline: 'オフライン',
    online: 'オンライン',
    connecting: '接続中',
    connected: '接続済み',
    disconnected: '切断済み',
    syncing: '同期中',
    synced: '同期済み',
    updated: '更新済み',
    saved: '保存済み',
    deleted: '削除済み',
    copied: 'コピー済み',
    pasted: '貼り付け済み',
    uploaded: 'アップロード済み',
    downloaded: 'ダウンロード済み'
  }
} 