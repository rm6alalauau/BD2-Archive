// 简体中文语言资源
export default {
  // 通用词汇
  common: {
    today: '今天'
  },
  
  // 导航栏
  nav: {
    home: '首页',
    settings: '设置',
    feedback: '意见反馈',
    feedbackTracker: '意见追踪',
    about: '关于',
    switchLanguage: '切换语言',
    languageSelection: '语言选择',
    openMenu: '开启选单',
    closeMenu: '关闭选单'
  },
  
  // 个人资料/兑换码页面
  profile: {
    title: '兑换码',
    nickname: '游戏昵称',
    nicknameRequired: '请输入昵称',
    nicknamePlaceholder: '游戏昵称',
    nicknameInputPlaceholder: '请输入您的游戏昵称',
    queryButton: '查看兑换码列表',
    loadingTitle: '加载兑换码中...',
    retryLoadingTitle: '重新加载兑换码中...',
    retryButton: '重新加载',
    processing: '处理中...',
    expiryDate: '到期',
    
    // 用户信息
    userProfile: {
      clickAvatarToChange: '点击头像可更换 • 点击昵称可切换',
      clickNicknameToSwitch: '点击昵称可切换',
      switchNickname: '切换',
      reenterNickname: '重新输入昵称',
      selectAvatar: '选择头像',
      confirmSelection: '确认选择'
    },
    
    // API 状态
    apiStatus: {
      loading: 'API 加载中...',
      reloading: '重新加载中...',
      normal: 'API 连线正常',
      error: 'API 连线异常',
      retry: '重试',
      techDetails: '技术细节'
    },
    
    // 加载状态
    loading: {
      waitingApi: '正在等待API加载完成',
      processingData: '正在处理兑换码数据',
      updatingList: '正在更新兑换码列表',
      retryingData: '重新获取最新数据'
    },
    
    // 状态
    status: {
      limited: '限时可用',
      available: '目前可用',
      active: '目前可用',
      permanent: '永久',
      expired: '已过期',
      unknown: '未知状态'
    },
    
    // 操作按钮
    actions: {
      copy: '复制',
      copied: '已复制',
      visitOfficial: '前往官网',
      retry: '重试',
      clear: '清除',
      confirm: '确认',
      cancel: '取消',
      reload: '重新加载',
      reloadCoupons: '重新加载兑换码',
      claim: '兑换',
      claimed: '已兑换'
    },

    // 兑换码链接
    couponLink: {
      tooltip: '点击打开官方兑换页面并复制兑换码: {code}'
    },
    
    // 错误消息
    errors: {
      loadFailed: '加载失败',
      networkError: '网络连线错误',
      apiError: 'API 错误',
      unknownError: '未知错误',
      nicknameValidationFailed: '昵称验证失败，请确认昵称是否正确',
      couponExpired: '兑换码已过期',
      invalidCoupon: '无效的兑换码',
      alreadyUsed: '您的帐号先前已兑换过此序号',
      claimSuccess: '兑换成功',
      claimFailed: '兑换失败，请重新整理页面后再试',
      requestTimeout: '请求超时，请重试',
      networkConnection: '网络连线问题，请检查网络后重试',
      serverError: '服务器暂时无法回应，请稍后重试',
      rateLimited: '请求过于频繁，请稍后再试'
    },
    
    // 昵称管理
    nickname: {
      saved: '已保存的昵称',
      switch: '选择昵称',
      delete: '删除昵称',
      current: '使用中',
      using: '使用中',
      switchTo: '切换',
      noSaved: '暂无已保存的昵称',
      autoSaveHint: '输入昵称后会自动保存，方便下次快速选择',
      confirmDelete: '确认删除此昵称？',
      deleteTitle: '删除此昵称'
    },
    
    // 帮助文字
    helpText: {
      reloadHint: '如果兑换码未正确加载，点击此处重新加载',
      solutionTitle: '加载问题解决方案：',
      solution1: '如果提交昵称时API尚未加载完成，可能导致兑换码无法正确显示',
      solution2: '点击上方「重新加载兑换码」',
      solution3: '或者点击「退出」重新输入昵称'
    },
    
    // 网络状态
    network: {
      checking: '正在检测兑换服务连接...',
      slow: '兑换服务回应较慢，请稍候',
      unreachable: '无法连接兑换服务，请检查网络',
      corsError: 'iOS Safari 兼容性问题'
    },
    nicknameHelpTitle: '什么是游戏昵称？',
    nicknameHelp: '请输入您在游戏内的昵称（如图所示），否则无法正确领取奖励。',
    nicknameDialogTitle: '选择昵称',
    
    // 兑换码功能说明
    helpDialog: {
      title: '兑换码功能说明',
      howItWorks: '这是如何运作的？',
      step1: '输入昵称：首先，请输入您在游戏中完全相同的昵称。',
      step2: '查看列表：点击按钮后，网站会加载目前所有已知的可用兑换码。',
      step3: '点击兑换：您可以逐一点击「兑换」按钮。网站会将您的昵称和对应的兑换码，直接发送到游戏官方的兑换服务器。',
      statusMeaning: '兑换状态是什么意思？',
      statusDescription: '网站会根据官方服务器返回的真实信息，显示不同的状态：',
      statusSuccess: '成功（绿色）：代表您的账号首次成功领取该序号。',
      statusUsed: '已兑换（黄色）：代表您的账号之前已领过，无法重复领取。',
      statusFailed: '失败（红色）：代表序号可能已过期、无效，或您的昵称输入错误。',
      importantNote: '重要提醒',
      localStorageNote: '兑换记录仅储存在当前的浏览器中。如果您在其他设备或浏览器使用，将需要重新逐一点击兑换按钮来确认状态。'
    }
  },
  
  // 新闻
  news: {
    title: '官方新闻',
    noData: '目前没有新闻数据',
    loading: '加载中...',
    loadFailed: '加载失败',
    
    // 日期相关
    date: {
      today: '今天',
      yesterday: '昨天',
      daysAgo: '天前'
    },
    
    // 标签
    tags: {
      notice: '公告事项',
      maintenance: '维护',
      event: '活动',
      dev_note: '开发者笔记',
      package_deal: '礼包商品',
      issue: '游戏已知问题'
    }
  },
  
  // 官方媒体
  media: {
    title: '官方媒体',
    noData: '近期没有新的官方媒体',
    loading: '加载中...',
    loadFailed: '加载失败',
    watchVideo: '观看视频'
  },
  
  // 论坛
  forums: {
    title: '社群论坛',
    bahamut: '巴哈姆特',
    nga: 'NGA',
    ptt: 'PTT',
    x: 'X (Twitter)',
    reddit: 'Reddit',
    naver: 'Naver Lounge',
    noData: '目前没有论坛数据',
    loading: '加载中...',
    loadFailed: '加载失败'
  },
  
  // Pixiv 卡片
  pixiv: {
    title: 'Pixiv 热门作品',
    viewMore: '查看更多',
    noData: '目前没有作品数据',
    loading: '加载中...',
    loadFailed: '加载失败'
  },
  
  // 设置页面
  settings: {
    title: '设置',
    subtitle: '自定义您的使用体验',
    
    // 显示设置
    display: {
      title: '显示设置',
      yuriMode: '尤里模式',
      yuriModeDescription: '启用看看，据说会有来自尤里的神秘祝福降临在页面上…？',
      fontSize: '字体大小',
      fontSizeDescription: '调整界面字体的显示大小',
      r18Content: 'R18 内容',
      r18Description: '显示 R18 相关内容',
      websiteIcon: '网站图标',
      websiteIconDescription: '选择你喜欢的网站图标',
      iconPage: '页面'
    },
    
    // 内容设置
    contentSettings: {
      title: '内容设置',
      r18Content: 'Pixiv R18 内容',
      r18Description: '是否显示成人内容（需满 18 岁）',
      aiContent: 'Pixiv AI 生成内容',
      aiDescription: '是否显示 AI 生成的作品',
      dailyCheckinReminder: '每日签到提醒',
      dailyCheckinReminderDescription: '提醒您前往网络商店领取每日钻石',
      pushNotifications: '兑换码推送通知',
      enablePush: '启用通知',
      pushUnsupported: '浏览器不支持',
      pushDescription: '启用后有新的兑换码时会通知您',
      testNotification: '测试通知',
      iosNeedPWA: 'iOS 需要先添加到桌面',
      iosInstallGuide: '在 iOS 上需要先点击 Safari 分享按钮，选择“添加到主屏幕”，然后在主屏幕打开网站才能使用推送通知'
    },
    notifications: {
      title: '通知设置'
    },
    
    // 论坛设置
    forumSettings: {
      title: '论坛显示设置',
      description: '选择要显示的论坛',
      minRequired: '至少需要选择一个论坛来源'
    },
    
    // 数据管理
    dataManagement: {
      title: '数据管理',
      clearUserData: '清除用户数据',
      clearDescription: '清除已保存的昵称和兑换记录',
      clearButton: '清除数据',
      resetSettings: '重置设置',
      resetDescription: '恢复所有设置为默认值',
      resetButton: '还原默认值',
      resetHint: '将所有设置恢复为默认状态'
    },
    
    // 按钮和操作
    actions: {
      backToHome: '返回首页'
    },
    
    // 确认对话框
    confirmDialog: {
      clearDataTitle: '确认清除数据',
      clearDataMessage: '此操作将清除以下数据：',
      clearDataItems: [
        '已保存的游戏昵称',
        '兑换码使用记录', 
        '头像选择记录'
      ],
      clearDataWarning: '此操作无法复原，确定要继续吗？',
      
      resetTitle: '确认重置设置',
      resetMessage: '此操作将恢复所有设置为默认值：',
      resetItems: [
        '字体大小：100%',
        'R18 内容：关闭',
        '论坛显示：全部开启',
        '语言：简体中文'
      ],
      resetWarning: '确定要重置所有设置吗？',
      
      confirm: '确定',
      cancel: '取消'
    },
    
    // 成功消息
    success: {
      cleared: '数据已清除',
      reset: '设置已重置',
      saved: '设置已保存',
      iconChanged: '网站图标已切换！',
      forumsUpdated: '论坛设置已更新，正在重新加载数据...',
      enabled: '已启用通知',
      testNotification: '测试通知已发送'
    },
    supportTitle: '支持 The BD2 Pulse 持续运行',
    supportContent: `大家好，我是本站的开发者。
感谢每一位使用 The BD2 Pulse 的玩家！看到这个小工具能为大家带来便利，是我最大的动力。
为了应对日益增长的访问量，并确保网站能持续提供快速、稳定的服务，我已将网站的基础设施升级至付费方案。
如果您觉得这个网站对您有帮助，并且愿意支持它的长期运营，欢迎通过下方的链接「请我喝杯咖啡」。您的任何一点支持，都将直接用于支付服务器和域名的费用，并激励我投入更多时间来维护和开发新功能。
再次感谢大家的支持！`,
  },
  
  // 意见反馈页面
  feedback: {
    title: '意见反馈',
    description: '协助我们改善您的使用体验',
    cardTitle: '分享您的想法',
    formDescription: '感谢您花时间提供宝贵的意见。您的反馈将帮助我们持续改善网站功能与使用体验。',
    trackerPromo: {
      title: '查看意见追踪',
      description: '追踪所有汇报与改进的处理状态',
      view: '立即查看'
    },
    
    // 表单
    form: {
      issueType: '问题类型',
      issueTypePlaceholder: '请选择问题类型',
      description: '详细描述',
      descriptionPlaceholder: '请描述您遇到的问题或您的建议',
      nickname: '您的昵称',
      nicknamePlaceholder: '(选填)',
      submit: '送出反馈'
    },
    
    // 问题类型
    issueTypes: {
      bug: '闪退或 Bug',
      content: '文本、内容错误',
      suggestion: '建议',
      other: '其他'
    },
    
    // 系统信息
    systemInfo: {
      title: '系统信息',
      description: '为了更好地协助您解决问题，我们将自动附加您的设备信息'
    },
    
    // 验证
    validation: {
      required: '此为必填字段',
      maxLength: '长度不能超过 {limit} 个字'
    },
    
    // 错误
    errors: {
      validation: '请修正表单中的错误后再次提交。'
    },
    
    // 结果
    success: '感谢您的宝贵反馈！我们已成功收到您的意见，将会仔细评估并持续改善。',
    error: '发送时发生未知错误，请稍后再试。如问题持续发生，请直接联系我们。',
    
    // 隐私
    privacy: {
      title: '隐私保护',
      description: '您提供的所有信息仅用于问题排查与功能优化，我们承诺保护您的隐私。'
    }
  },
  
  // 通用
  common: {
    loading: '加载中...',
    error: '发生错误',
    retry: '重试',
    confirm: '确认',
    cancel: '取消',
    close: '关闭',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    submit: '送出',
    reset: '重置',
    clear: '清除',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    more: '更多',
    less: '收起',
    expand: '展开',
    collapse: '收合',
    select: '选择',
    deselect: '取消选择',
    selectAll: '全选',
    deselectAll: '全不选',
    apply: '套用',
    preview: '预览',
    download: '下载',
    upload: '上传',
    copy: '复制',
    paste: '贴上',
    cut: '剪下',
    undo: '复原',
    redo: '重做',
    refresh: '重新整理',
    update: '更新',
    sync: '同步',
    import: '导入',
    export: '导出',
    print: '打印',
    share: '分享',
    help: '说明',
    about: '关于',
    version: '版本',
    settings: '设置',
    profile: '个人资料',
    account: '账户',
    logout: '登出',
    login: '登录',
    register: '注册',
    forgotPassword: '忘记密码',
    changePassword: '变更密码',
    success: '成功',
    warning: '警告',
    info: '信息',
    question: '问题',
    yes: '是',
    no: '否',
    ok: '确定',
    undefined: '未定义',
    null: '无',
    empty: '空白',
    notFound: '找不到',
    notAvailable: '不可用',
    comingSoon: '即将推出',
    maintenance: '维护中',
    offline: '离线',
    online: '在线',
    connecting: '连接中',
    connected: '已连接',
    disconnected: '已断线',
    syncing: '同步中',
    synced: '已同步',
    updated: '已更新',
    saved: '已保存',
    deleted: '已删除',
    copied: '已复制',
    pasted: '已贴上',
    uploaded: '已上传',
    downloaded: '已下载'
  },
  
  // 周期性活动提醒
  weeklyReminder: {
    title: '每周签到提醒',
    description: '别忘了前往网络商店领取本周的免费抽奖券',
    currentWeek: '第 {week} 周',
    timeRemaining: '剩余时间',
    timeExpired: '本周已结束',
    timeRemainingDays: '{days} 天 {hours} 小时',
    timeRemainingHours: '{hours} 小时',
    timeRemainingMinutes: '{minutes} 分钟',
    goToWebshop: '前往网络商店',
    completed: '已完成',
    remindLater: '稍后提醒'
  },

  // 每日签到提醒
  dailyCheckin: {
    title: '每日签到提醒',
    currentDate: '{date}',
    description: '别忘了前往网络商店领取今日的钻石！',
    timeRemaining: '剩余时间',
    timeExpired: '今日已结束',
    timeRemainingHours: '还剩 {hours} 小时 {minutes} 分钟',
    timeRemainingMinutes: '还剩 {minutes} 分钟',
    remindLater: '稍后提醒',
    completed: '已完成',
    goToWebshop: '前往网络商店'
  },
  
  // 关于页面
  about: {
    title: '关于',
    description: '了解 The BD2 Pulse',
    cardTitle: '关于网站',
    content: 'The BD2 Pulse 是一个非官方的《棕色尘埃2》游戏信息整合平台，致力于为玩家提供便利的信息服务。我们即时更新最新兑换码、官方公告与社群热门话题，让您随时掌握游戏动态。我们汇聚了官方新闻、社群讨论、二次创作等丰富内容，帮助您轻松获取所有游戏相关信息。',
    openSource: {
      title: '开放源代码',
      github: 'GitHub',
      figma: 'Figma',
      viewCode: '查看源代码',
      viewDesign: '查看设计',
      license: '授权'
    },
    techStack: {
      title: '技术栈'
    },
    sponsorshipReport: {
      title: '赞助报表',
      description: '查看网站的运营与赞助情况',
      openFull: '在新分页打开完整报表',
      copyUrl: '复制链接',
      copied: '已复制'
    }
  },
  
  // 意见追踪页面
  feedbackTracker: {
    title: '意见追踪',
    back: '返回',
    scrollToTop: '回到顶部',
    description: '查看意见反馈处理状态',
    loading: '加载中...',
    noData: '尚无意见反馈记录',
    noDataDescription: '还没有提交过意见反馈',
    feedback: '意见内容',
    resolution: '处理方式',
    status: {
      completed: '已完成',
      inProgress: '处理中',
      pending: '待处理',
      rejected: '已拒绝'
    }
  },
  
  // 免责声明
  disclaimer: {
    title: '免责声明与版权信息',
    nav: '免责声明与版权信息',
    short: '本站为非官方粉丝信息站，与《棕色尘埃2》官方无任何关联',
    content: {
      title: '免责声明与版权信息',
      section1: {
        title: '网站定位与独立性',
        content: '本网站 (The BD2 Pulse) 为玩家自发创建的非官方粉丝信息站，旨在为《棕色尘埃2》社群提供便利的信息聚合服务。本站与游戏开发商 NEOWIZ 及《棕色尘埃2》运营团队无任何关联，亦未获得其任何形式的背书或认可。'
      },
      section2: {
        title: '知识产权归属',
        content: '本网站所引用之《棕色尘埃2》相关的所有商标、角色、图像、文本、影音及其他知识产权，其著作权与知识产权均归属于原权利人 (NEOWIZ) 所有。本站对这些内容的使用，遵循官方发布的「二次创作指引」及合理使用原则，仅供社群玩家参考、讨论与交流之用。'
      },
      section3: {
        title: '内容的准确性',
        content: '本站致力于提供准确、即时的信息，但无法保证所有内容（包括但不限于兑换码状态、社群文章等）的绝对正确性与即时性。所有游戏相关的官方信息，请一律以《棕色尘埃2》官方网站或游戏内公告为最终依据。'
      },
      section4: {
        title: '第三方内容与链接',
        content: '本网站聚合了来自 Pixiv, X (Twitter), 巴哈姆特等第三方平台的内容。这些内容的版权归原作者所有。本站仅为方便检索而提供预览和链接，不对其内容的准确性、合法性负责。访问这些第三方链接所产生的任何后果，由使用者自行承担。'
      },
      section5: {
        title: '非营利声明与赞助',
        content: '本站目前为非营利性质。所有可能获得的赞助款项，将全数用于支付服务器、域名等网站基础设施的维护成本，以支持本站的持续运营。'
      },
      section6: {
        title: '版权问题联系',
        content: '我们尊重所有版权所有者的权利。如果您认为本站的任何内容侵害了您的合法权益，请通过意见反馈与我联系。在收到通知后，将立即进行审核并移除相关内容。'
      }
    }
  }
} 