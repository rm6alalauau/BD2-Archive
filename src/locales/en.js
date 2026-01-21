// English language resources
export default {
  // Common terms
  common: {
    today: 'Today'
  },

  // Service announcement
  serviceAnnouncement: {
    title: 'Service Notice',
    content: 'Due to the developer\'s personal schedule, updates to certain real-time content (such as coupon codes) may be delayed between December 18 and December 25. We apologize for any inconvenience.'
  },

  // Navigation
  nav: {
    home: 'Home',
    settings: 'Settings',
    feedback: 'Feedback',
    feedbackTracker: 'Feedback Tracker',
    about: 'About',
    switchLanguage: 'Switch Language',
    languageSelection: 'Language Selection',
    openMenu: 'Open Menu',
    closeMenu: 'Close Menu'
  },

  // Profile/Coupon page
  profile: {
    title: 'Coupon Codes',
    nickname: 'Game Nickname',
    nicknameRequired: 'Please enter nickname',
    nicknamePlaceholder: 'Game Nickname',
    nicknameInputPlaceholder: 'Enter your game nickname',
    queryButton: 'View Code List',
    loadingTitle: 'Loading coupon codes...',
    retryLoadingTitle: 'Reloading coupon codes...',
    retryButton: 'Reload',
    processing: 'Processing...',
    expiryDate: 'Expires',

    // User profile
    userProfile: {
      clickAvatarToChange: 'Click avatar to change • Click nickname to switch',
      clickNicknameToSwitch: 'Click nickname to switch',
      switchNickname: 'Switch',
      reenterNickname: 'Re-enter Nickname',
      selectAvatar: 'Select Avatar',
      confirmSelection: 'Confirm Selection'
    },

    // API status
    apiStatus: {
      loading: 'API Loading...',
      reloading: 'Reloading...',
      normal: 'API Connection Normal',
      error: 'API Connection Error',
      retry: 'Retry',
      techDetails: 'Technical Details'
    },

    // Loading states
    loading: {
      waitingApi: 'Waiting for API to load',
      processingData: 'Processing coupon code data',
      updatingList: 'Updating coupon code list',
      retryingData: 'Retrying to get latest data'
    },

    // Status
    status: {
      limited: 'Limited Time Available',
      available: 'Currently Available',
      active: 'Active',
      permanent: 'Permanent',
      expired: 'Expired',
      unknown: 'Unknown'
    },

    // Action buttons
    actions: {
      copy: 'Copy',
      copied: 'Copied',
      visitOfficial: 'Visit Official',
      retry: 'Retry',
      clear: 'Clear',
      confirm: 'Confirm',
      cancel: 'Cancel',
      reload: 'Reload',
      reloadCoupons: 'Reload Coupon Codes',
      claim: 'Claim',
      claimed: 'Claimed'
    },

    // Coupon link
    couponLink: {
      tooltip: 'Click to open official redemption page and copy coupon code: {code}'
    },

    // Error messages
    errors: {
      loadFailed: 'Load Failed',
      networkError: 'Network Connection Error',
      apiError: 'API Error',
      unknownError: 'Unknown Error',
      nicknameValidationFailed: 'Nickname validation failed, please check if the nickname is correct',
      couponExpired: 'Coupon code has expired',
      invalidCoupon: 'Invalid coupon code',
      alreadyUsed: 'This code has already been redeemed on your account',
      claimSuccess: 'Claim successful',
      claimFailed: 'Claim failed, please refresh the page and try again',
      requestTimeout: 'Request timeout, please retry',
      networkConnection: 'Network connection problem, please check your network and retry',
      serverError: 'Server temporarily unavailable, please try again later',
      rateLimited: 'Too many requests, please try again later'
    },

    // Nickname management
    nickname: {
      saved: 'Saved Nicknames',
      switch: 'Select Nickname',
      delete: 'Delete Nickname',
      current: 'In Use',
      using: 'In use',
      switchTo: 'Switch',
      noSaved: 'No saved nicknames',
      autoSaveHint: 'Nicknames will be saved automatically for quick selection next time',
      confirmDelete: 'Confirm delete this nickname?',
      deleteTitle: 'Delete this nickname'
    },

    // Help text
    helpText: {
      reloadHint: 'If coupon codes are not loaded correctly, click here to reload',
      solutionTitle: 'Loading Issues Solutions:',
      solution1: 'If you submit nickname while API is still loading, coupon codes may not display correctly',
      solution2: 'Click the "Reload Coupon Codes" button above',
      solution3: 'Or click "Exit" to re-enter nickname'
    },

    // Network status
    network: {
      checking: 'Checking coupon service connection...',
      slow: 'Coupon service is responding slowly, please wait',
      unreachable: 'Cannot connect to coupon service, please check your network',
      corsError: 'iOS Safari compatibility issue'
    },
    nicknameHelpTitle: 'What is the in-game nickname?',
    nicknameHelp: 'Please enter your in-game nickname (as shown in the picture) to receive rewards correctly.',
    nicknameDialogTitle: 'Select Nickname',

    // Redeem Code Help
    helpDialog: {
      title: 'Redeem Code Function Guide',
      howItWorks: 'How does this work?',
      step1: 'Enter Nickname: First, please enter your exact in-game nickname.',
      step2: 'View List: After clicking the button, the website will load all currently known available redeem codes.',
      step3: 'Click Redeem: You can click the "Redeem" button one by one. The website will send your nickname and the corresponding redeem code directly to the game\'s official redemption server.',
      statusMeaning: 'What do the redemption statuses mean?',
      statusDescription: 'The website displays different statuses based on real messages returned from the official server:',
      statusSuccess: 'Success (Green): Your account successfully claimed this code for the first time.',
      statusUsed: 'Already Redeemed (Yellow): Your account has already claimed this code before and cannot claim it again.',
      statusFailed: 'Failed (Red): The code may have expired, be invalid, or your nickname was entered incorrectly.',
      importantNote: 'Important Note',
      localStorageNote: 'Redemption records are only stored in your current browser. If you use this on other devices or browsers, you will need to click the redeem buttons again to check the status.'
    }
  },

  // News
  news: {
    title: 'Official News',
    noData: 'No news data available',
    loading: 'Loading...',
    loadFailed: 'Load Failed',

    // Date related
    date: {
      today: 'Today',
      yesterday: 'Yesterday',
      daysAgo: 'days ago'
    },

    // Tags
    tags: {
      notice: 'Notice',
      maintenance: 'Maintenance',
      event: 'Event',
      dev_note: 'Developer Note',
      package_deal: 'Package Deal',
      issue: 'Known Issue'
    }
  },

  // Events
  events: {
    timeline: 'Event Timeline',
    currentEvents: 'Current Events',
    noActiveEvents: 'No active events at the moment.',
    viewAllSchedule: 'View Schedule',
    showEndedEvents: 'Show Ended Events',
    useLocalTime: 'Use Local Time',
    localTime: 'Your Local Time',
    serverTime: 'Server Time (UTC+8)',
    ended: 'Ended',
    filter_banner: 'Pickup',
    filter_event: 'Event',
    filter_abyss: 'Evil Castle',
    filter_season: 'Season Pass',
    sort_reverse: 'Reverse Order'
  },

  // Official media
  media: {
    title: 'Official Media',
    noData: 'No recent official media',
    loading: 'Loading...',
    loadFailed: 'Load Failed',
    watchVideo: 'Watch Video'
  },

  // Forums
  forums: {
    title: 'Community Forums',
    bahamut: 'Bahamut',
    nga: 'NGA',
    ptt: 'PTT',
    x: 'X (Twitter)',
    reddit: 'Reddit',
    naver: 'Naver Lounge',
    noData: 'No forum data available',
    loading: 'Loading...',
    loadFailed: 'Load failed'
  },

  // Pixiv card
  pixiv: {
    title: 'Pixiv Popular Works',
    viewMore: 'View More',
    noData: 'No artwork data available',
    loading: 'Loading...',
    loadFailed: 'Load Failed'
  },

  // Settings page
  settings: {
    title: 'Settings',
    subtitle: 'Customize your experience',

    // Display settings
    display: {
      title: 'Display Settings',
      yuriMode: 'Yuri Mode',
      yuriModeDescription: 'Turn it on and see... Rumor has it that a mysterious blessing from Yuri will descend upon the page...?',
      fontSize: 'Font Size',
      fontSizeDescription: 'Adjust interface font display size',
      r18Content: 'R18 Content',
      r18Description: 'Show R18 related content',
      websiteIcon: 'Website Icon',
      websiteIconDescription: 'Choose your favorite website icon',
      iconPage: 'Page'
    },

    // Content settings
    contentSettings: {
      title: 'Content Settings',
      r18Content: 'Pixiv R18 Content',
      r18Description: 'Whether to show adult content (18+ required)',
      aiContent: 'Pixiv AI Generated Content',
      aiDescription: 'Whether to show AI-generated artworks',
      dailyCheckinReminder: 'Daily Check-in Reminder',
      dailyCheckinReminderDescription: 'Remind you to visit the webshop for daily diamonds',
      pushNotifications: 'Coupon Push Notifications',
      enablePush: 'Enable Notifications',
      pushUnsupported: 'Browser not supported',
      pushDescription: 'Get notified when new coupon codes are available',
      testNotification: 'Test Notification',
      iosNeedPWA: 'iOS needs to be added to Home Screen',
      iosInstallGuide: 'On iOS, tap the Safari share button, select "Add to Home Screen", then open the site from Home Screen to enable push notifications'
    },
    notifications: {
      title: 'Notification Settings'
    },

    // Forum settings
    forumSettings: {
      title: 'Forum Display Settings',
      description: 'Select forums to display',
      minRequired: 'At least one forum source must be selected'
    },

    // Data management
    dataManagement: {
      title: 'Data Management',
      clearUserData: 'Clear User Data',
      clearDescription: 'Clear saved nicknames and exchange records',
      clearButton: 'Clear Data',
      resetSettings: 'Reset Settings',
      resetDescription: 'Restore all settings to default values',
      resetButton: 'Restore Defaults',
      resetHint: 'Restore all settings to default state'
    },

    // Actions
    actions: {
      backToHome: 'Back to Home'
    },

    // Confirm dialog
    confirmDialog: {
      clearDataTitle: 'Confirm Clear Data',
      clearDataMessage: 'This operation will clear the following data:',
      clearDataItems: [
        'Saved game nicknames',
        'Coupon code usage records',
        'Avatar selection records'
      ],
      clearDataWarning: 'This operation cannot be undone. Are you sure you want to continue?',

      resetTitle: 'Confirm Reset Settings',
      resetMessage: 'This operation will restore all settings to default values:',
      resetItems: [
        'Font size: 100%',
        'R18 content: Off',
        'Forum display: All enabled',
        'Language: Traditional Chinese'
      ],
      resetWarning: 'Are you sure you want to reset all settings?',

      confirm: 'Confirm',
      cancel: 'Cancel'
    },

    // Success messages
    success: {
      cleared: 'Data cleared',
      reset: 'Settings reset',
      saved: 'Settings saved',
      iconChanged: 'Website icon changed!',
      forumsUpdated: 'Forum settings updated, reloading data...',
      enabled: 'Notifications enabled',
      testNotification: 'Test notification sent'
    },
    supportTitle: 'Support The BD2 Pulse',
    supportContent: `Hello everyone, I'm the developer of this site.
Thank you to every player who uses The BD2 Pulse! Knowing that this little tool is helpful to you is my biggest motivation.
To handle the growing traffic and ensure the site remains fast and stable, I've upgraded our infrastructure to a paid plan.
If you find this website useful and would like to support its long-term operation, please consider "buying me a coffee" through the link below. Every bit of support goes directly towards server and domain costs, and encourages me to spend more time on maintenance and developing new features.
Thank you again for all your support!`,
  },

  // Feedback page
  feedback: {
    title: 'Feedback',
    description: 'Help us improve your experience',
    cardTitle: 'Share Your Thoughts',
    formDescription: 'Thank you for taking the time to provide valuable feedback. Your input helps us continuously improve website functionality and user experience.',
    trackerPromo: {
      title: 'Feedback Tracker',
      description: 'Track all reports and improvements',
      view: 'View Now'
    },

    // Form
    form: {
      issueType: 'Issue Type',
      issueTypePlaceholder: 'Please select issue type',
      description: 'Detailed Description',
      descriptionPlaceholder: 'Please describe the issue you encountered or your suggestions',
      nickname: 'Your Nickname',
      nicknamePlaceholder: '(Optional)',
      submit: 'Submit Feedback'
    },

    // Issue types
    issueTypes: {
      bug: 'Crash or Bug',
      content: 'Text/Content Error',
      suggestion: 'Suggestion',
      other: 'Other'
    },

    // System info
    systemInfo: {
      title: 'System Information',
      description: 'To better assist you with problem resolution, we will automatically attach your device information'
    },

    // Validation
    validation: {
      required: 'This field is required',
      maxLength: 'Length cannot exceed {limit} characters'
    },

    // Errors
    errors: {
      validation: 'Please correct the errors in the form before submitting.'
    },

    // Results
    success: 'Thank you for your valuable feedback! We have successfully received your input and will carefully evaluate and continuously improve.',
    error: 'An unknown error occurred during sending, please try again later. If the problem persists, please contact us directly.',

    // Privacy
    privacy: {
      title: 'Privacy Protection',
      description: 'All information you provide is used solely for troubleshooting and feature optimization. We are committed to protecting your privacy.'
    }
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error occurred',
    retry: 'Retry',
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    reset: 'Reset',
    clear: 'Clear',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    more: 'More',
    less: 'Less',
    expand: 'Expand',
    collapse: 'Collapse',
    select: 'Select',
    deselect: 'Deselect',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    apply: 'Apply',
    preview: 'Preview',
    download: 'Download',
    upload: 'Upload',
    copy: 'Copy',
    paste: 'Paste',
    cut: 'Cut',
    undo: 'Undo',
    redo: 'Redo',
    refresh: 'Refresh',
    update: 'Update',
    sync: 'Sync',
    import: 'Import',
    export: 'Export',
    print: 'Print',
    share: 'Share',
    help: 'Help',
    about: 'About',
    version: 'Version',
    settings: 'Settings',
    profile: 'Profile',
    account: 'Account',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    forgotPassword: 'Forgot Password',
    changePassword: 'Change Password',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    question: 'Question',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    undefined: 'Undefined',
    null: 'Null',
    empty: 'Empty',
    notFound: 'Not Found',
    notAvailable: 'Not Available',
    comingSoon: 'Coming Soon',
    maintenance: 'Under Maintenance',
    offline: 'Offline',
    online: 'Online',
    connecting: 'Connecting',
    connected: 'Connected',
    disconnected: 'Disconnected',
    syncing: 'Syncing',
    synced: 'Synced',
    updated: 'Updated',
    saved: 'Saved',
    deleted: 'Deleted',
    copied: 'Copied',
    pasted: 'Pasted',
    uploaded: 'Uploaded',
    downloaded: 'Downloaded'
  },

  // Weekly Event Reminder
  weeklyReminder: {
    title: 'Weekly Check-in Reminder',
    description: 'Don\'t forget to visit the webshop to claim this week\'s free lottery tickets',
    currentWeek: 'Week {week}',
    timeRemaining: 'Time Remaining',
    timeExpired: 'This week has ended',
    timeRemainingDays: '{days} days {hours} hours',
    timeRemainingHours: '{hours} hours',
    timeRemainingMinutes: '{minutes} minutes',
    goToWebshop: 'Go to Webshop',
    completed: 'Completed',
    remindLater: 'Remind Later'
  },


  // Seasonal Event Reminder
  seasonalEvent: {
    title: 'Check-in Event',
    description: "Don't forget to participate in the check-in event",
    dontShowAgain: "Don't show again",
    confirmDontShowAgain: "Are you sure you want to hide this event reminder permanently?",
    completed: 'Completed',
    remindLater: 'Remind Later',
    goToWebshop: 'Go to Check-in'
  },

  // Daily Check-in Reminder
  dailyCheckin: {
    title: 'Daily Check-in Reminder',
    currentDate: '{date}',
    description: 'Don\'t forget to visit the webshop to claim today\'s Dia!',
    timeRemaining: 'Time Remaining',
    timeExpired: 'Today has ended',
    timeRemainingHours: '{hours} hours {minutes} minutes remaining',
    timeRemainingMinutes: '{minutes} minutes remaining',
    remindLater: 'Remind Later',
    completed: 'Completed',
    goToWebshop: 'Go to Webshop'
  },

  // About page
  about: {
    title: 'About',
    description: 'Learn about The BD2 Pulse',
    cardTitle: 'About the Site',
    content: 'The BD2 Pulse is an unofficial Brown Dust 2 information integration platform dedicated to providing convenient information services for players. We update the latest redemption codes, official announcements, and trending community discussions in real-time, keeping you up-to-date with the game. We gather official news, community discussions, fan creations, and more, helping you easily access all game-related information.',
    openSource: {
      title: 'Open Source',
      github: 'GitHub',
      figma: 'Figma',
      viewCode: 'View Code',
      viewDesign: 'View Design',
      license: 'License'
    },
    techStack: {
      title: 'Tech Stack'
    },
    sponsorshipReport: {
      title: 'Sponsorship Report',
      description: 'View site operations and sponsorship information',
      openFull: 'Open Full Report in New Tab',
      copyUrl: 'Copy Link',
      copied: 'Copied'
    }
  },

  // Feedback Tracker page
  feedbackTracker: {
    title: 'Feedback Tracker',
    back: 'Back',
    scrollToTop: 'Scroll to Top',
    description: 'Track feedback status',
    loading: 'Loading...',
    noData: 'No feedback records yet',
    noDataDescription: 'You haven\'t submitted any feedback yet',
    feedback: 'Feedback',
    resolution: 'Resolution',
    status: {
      completed: 'Completed',
      inProgress: 'In Progress',
      pending: 'Pending',
      rejected: 'Rejected'
    }
  },

  // Disclaimer
  disclaimer: {
    title: 'Disclaimer & Copyright Information',
    nav: 'Disclaimer & Copyright Information',
    short: 'This is an unofficial fan site with no affiliation to Brown Dust 2',
    content: {
      title: 'Disclaimer & Copyright Information',
      section1: {
        title: 'Website Position & Independence',
        content: 'This website (The BD2 Pulse) is a fan-created unofficial information site created by players, aiming to provide convenient information aggregation services for the Brown Dust 2 community. This site has no affiliation with game developer NEOWIZ or the Brown Dust 2 operations team, nor has it received any form of endorsement or approval from them.'
      },
      section2: {
        title: 'Intellectual Property Rights',
        content: 'All trademarks, characters, images, text, audio-visual content, and other intellectual property rights related to Brown Dust 2 referenced on this website belong to their original rights holders (NEOWIZ). Our use of these contents follows the official "Secondary Creation Guidelines" and fair use principles, solely for community players\' reference, discussion, and exchange purposes.'
      },
      section3: {
        title: 'Content Accuracy',
        content: 'This site strives to provide accurate and timely information, but cannot guarantee the absolute accuracy and timeliness of all content (including but not limited to coupon code status, community articles, etc.). For all game-related official information, please refer to the official Brown Dust 2 website or in-game announcements as the final authority.'
      },
      section4: {
        title: 'Third-Party Content & Links',
        content: 'This website aggregates content from third-party platforms such as Pixiv, X (Twitter), and Bahamut. The copyright of these contents belongs to their original creators. This site only provides previews and links for convenient browsing and is not responsible for the accuracy or legality of their content. Any consequences arising from visiting these third-party links are borne by the users themselves.'
      },
      section5: {
        title: 'Non-Profit Statement & Sponsorship',
        content: 'This site is currently non-profit in nature. All potential sponsorship funds received will be used entirely to pay for server, domain name, and other website infrastructure maintenance costs to support the continuous operation of this site.'
      },
      section6: {
        title: 'Copyright Issue Contact',
        content: 'We respect the rights of all copyright holders. If you believe that any content on this site infringes upon your legitimate rights, please contact me through feedback. Upon receiving notification, we will immediately review and remove the relevant content.'
      }
    }
  }
} 