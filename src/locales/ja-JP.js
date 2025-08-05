// Japanese language resources
export default {
  // Common terms
  common: {
    today: '今日'
  },
  
  // Navigation
  nav: {
    home: 'ホーム',
    settings: '設定',
    feedback: 'フィードバック',
    switchLanguage: '言語切り替え',
    languageSelection: '言語選択',
    openMenu: 'メニューを開く',
    closeMenu: 'メニューを閉じる'
  },
  
  // Profile/Coupon page
  profile: {
    title: 'クーポンコード',
    nickname: 'ゲームニックネーム',
    nicknameRequired: 'ニックネームを入力してください',
    nicknamePlaceholder: 'ゲームニックネーム',
    nicknameInputPlaceholder: 'ゲームニックネームを入力してください',
    queryButton: 'コード一覧を表示',
    loadingTitle: 'クーポンコード読み込み中...',
    retryLoadingTitle: 'クーポンコード再読み込み中...',
    retryButton: '再読み込み',
    processing: '処理中...',
    expiryDate: '期限',
    
    // User profile
    userProfile: {
      clickAvatarToChange: 'アバターをクリックして変更 • ニックネームをクリックして切り替え',
      clickNicknameToSwitch: 'ニックネームをクリックして切り替え',
      switchNickname: '切り替え',
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
    
    // Status
    status: {
      limited: '期間限定',
      available: '現在利用可能',
      active: '有効',
      permanent: '永続',
      expired: '期限切れ',
      unknown: '不明'
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
      alreadyUsed: 'このアカウントでは、このコードは既に受け取り済みです',
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
      switch: 'ニックネームを選択',
      delete: 'ニックネーム削除',
      current: '使用中',
      using: '使用中',
      switchTo: '切り替え',
      noSaved: '保存されたニックネームはありません',
      autoSaveHint: 'ニックネームは自動保存され、次回から簡単に選択できます',
      confirmDelete: 'このニックネームを削除しますか？',
      deleteTitle: 'このニックネームを削除'
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
    },
    nicknameHelpTitle: 'ゲーム内のニックネームとは？',
    nicknameHelp: 'ゲーム内で使用しているニックネームを入力してください（画像参照）。正しく報酬を受け取るために必要です。',
    nicknameDialogTitle: 'ニックネームを選択',
    
    // クーポンコード機能説明
    helpDialog: {
      title: 'クーポンコード機能ガイド',
      howItWorks: 'これはどのように動作しますか？',
      step1: 'ニックネーム入力：まず、ゲーム内で使用している正確なニックネームを入力してください。',
      step2: 'リスト表示：ボタンをクリックすると、現在利用可能なすべてのクーポンコードが読み込まれます。',
      step3: '引き換えクリック：「引き換え」ボタンを一つずつクリックできます。ウェブサイトがあなたのニックネームと対応するクーポンコードを、ゲーム公式の引き換えサーバーに直接送信します。',
      statusMeaning: '引き換えステータスの意味は？',
      statusDescription: 'ウェブサイトは公式サーバーから返される実際のメッセージに基づいて、異なるステータスを表示します：',
      statusSuccess: '成功（緑色）：あなたのアカウントがこのコードを初回で成功引き換えました。',
      statusUsed: '引き換え済み（黄色）：あなたのアカウントは以前にこのコードを引き換え済みで、重複引き換えはできません。',
      statusFailed: '失敗（赤色）：コードが期限切れ、無効、またはニックネームが間違って入力された可能性があります。',
      importantNote: '重要な注意',
      localStorageNote: '引き換え記録は現在のブラウザにのみ保存されます。他のデバイスやブラウザで使用する場合は、ステータスを確認するために引き換えボタンを再度クリックする必要があります。'
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
    naver: 'Naver Lounge',
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
      r18Description: 'R18関連コンテンツを表示',
      websiteIcon: 'ウェブサイトアイコン',
      websiteIconDescription: 'お好みのウェブサイトアイコンを選択'
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
    
    // 成功メッセージ
    success: {
      cleared: 'データがクリアされました',
      reset: '設定がリセットされました',
      saved: '設定が保存されました',
      iconChanged: 'ウェブサイトアイコンが変更されました！',
      forumsUpdated: 'フォーラム設定が更新され、データを再読み込み中...'
    },
    supportTitle: 'The BD2 Pulse の運営を支援する',
    supportContent: `皆さん、こんにちは。このサイトの開発者です。
いつも The BD2 Pulse をご利用いただき、誠にありがとうございます！このツールが皆さんのお役に立てていることを、大変嬉しく思います。
日々増加するアクセスに対応し、サイトの安定したサービスを維持するため、インフラを有料プランにアップグレードいたしました。
もしこのサイトが便利だと感じ、長期的な運営を応援していただけるようでしたら、以下のリンクから「コーヒーを一杯おごる」形でご支援いただけますと幸いです。皆様からのご支援は、サーバーやドメイン費用の維持、そして新機能開発の大きな励みとなります。
いつも温かいご支援、心より感謝申し上げます。`,
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
  },
  
  // 免責事項
  disclaimer: {
    title: '免責事項・著作権情報',
    nav: '免責事項・著作権情報',
    short: '本サイトは非公式なファンサイトであり、『ブラウンダスト2』公式とは一切関係ありません',
    content: {
      title: '免責事項・著作権情報',
      section1: {
        title: 'サイトの位置づけと独立性',
        content: '本ウェブサイト（The BD2 Pulse）は、プレイヤーによって自発的に作成された非公式のファン情報サイトで、『ブラウンダスト2』コミュニティに便利な情報集約サービスを提供することを目的としています。本サイトは、ゲーム開発会社NEOWIZおよび『ブラウンダスト2』運営チームとは一切関係なく、いかなる形の承認や認可も受けていません。'
      },
      section2: {
        title: '知的財産権の帰属',
        content: '本ウェブサイトが引用している『ブラウンダスト2』に関連するすべての商標、キャラクター、画像、テキスト、映像音響およびその他の知的財産権は、その著作権と知的財産権が原権利者（NEOWIZ）に帰属しています。本サイトによるこれらのコンテンツの使用は、公式に発表された「二次創作ガイドライン」および合理的使用原則に従い、コミュニティプレイヤーの参考、議論、交流のためのみに行われています。'
      },
      section3: {
        title: 'コンテンツの正確性',
        content: '本サイトは正確でタイムリーな情報の提供に努めていますが、すべてのコンテンツ（クーポンコードの状態、コミュニティ記事などを含むがこれに限定されない）の絶対的な正確性と即時性を保証することはできません。すべてのゲーム関連の公式情報については、『ブラウンダスト2』公式サイトまたはゲーム内のお知らせを最終的な根拠としてください。'
      },
      section4: {
        title: 'サードパーティコンテンツとリンク',
        content: '本ウェブサイトは、Pixiv、X（Twitter）、バハムートなどのサードパーティプラットフォームからのコンテンツを集約しています。これらのコンテンツの著作権は原作者に帰属します。本サイトは検索の便宜のためにプレビューとリンクを提供するのみで、その内容の正確性や合法性について責任を負いません。これらのサードパーティリンクへのアクセスによって生じるいかなる結果についても、利用者の自己責任とします。'
      },
      section5: {
        title: '非営利宣言とスポンサーシップ',
        content: '本サイトは現在非営利性質です。受け取る可能性のあるすべてのスポンサー資金は、サーバー、ドメイン名などのウェブサイトインフラストラクチャーの維持費用に全額使用され、本サイトの継続的な運営を支援します。'
      },
      section6: {
        title: '著作権問題の連絡',
        content: '私たちはすべての著作権所有者の権利を尊重します。本サイトのいかなるコンテンツがあなたの合法的な権益を侵害していると思われる場合は、フィードバックを通じてご連絡ください。通知を受け取り次第、速やかに審査を行い、関連するコンテンツを削除いたします。'
      }
    }
  }
} 