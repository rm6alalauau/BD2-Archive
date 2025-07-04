// English language resources
export default {
  // Navigation
  nav: {
    home: 'Home',
    settings: 'Settings',
    feedback: 'Feedback',
    switchLanguage: 'Switch Language',
    languageSelection: 'Language Selection'
  },
  
  // Profile/Coupon page
  profile: {
    title: 'Coupon Codes',
    nickname: 'Game Nickname',
    nicknameRequired: 'Please enter nickname',
    nicknamePlaceholder: 'Enter your game nickname',
    queryButton: 'Query Coupon Codes',
    loadingTitle: 'Loading coupon codes...',
    retryLoadingTitle: 'Reloading coupon codes...',
    retryButton: 'Reload',
    processing: 'Processing...',
    
    // User profile
    userProfile: {
      clickAvatarToChange: 'Click avatar to change',
      clickNicknameToSwitch: 'Click nickname to switch',
      switchNickname: 'Switch Nickname',
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
    
    // Coupon status
    couponStatus: {
      available: 'Currently Available',
      limited: 'Limited Time Available',
      permanent: 'Permanent',
      expired: 'Expired'
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
    
    // Error messages
    errors: {
      loadFailed: 'Load Failed',
      networkError: 'Network Connection Error',
      apiError: 'API Error',
      unknownError: 'Unknown Error',
      nicknameValidationFailed: 'Nickname validation failed, please check if the nickname is correct',
      couponExpired: 'Coupon code has expired',
      invalidCoupon: 'Invalid coupon code',
      alreadyUsed: 'This serial number has already been used',
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
      switch: 'Switch Nickname',
      delete: 'Delete Nickname',
      current: 'Currently in use',
      using: 'In use',
      switchTo: 'Switch',
      noSaved: 'No saved nicknames',
      autoSaveHint: 'Nicknames will be saved automatically for quick selection next time',
      confirmDelete: 'Confirm delete this nickname?'
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
    noData: 'No forum data available',
    loading: 'Loading...',
    loadFailed: 'Load Failed'
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
      fontSize: 'Font Size',
      fontSizeDescription: 'Adjust interface font display size',
      r18Content: 'R18 Content',
      r18Description: 'Show R18 related content'
    },
    
    // Content settings
    contentSettings: {
      title: 'Content Settings',
      r18Content: 'Pixiv R18 Content',
      r18Description: 'Whether to show adult content (18+ required)'
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
      saved: 'Settings saved'
    }
  },
  
  // Feedback page
  feedback: {
    title: 'Feedback',
    description: 'Help us improve your experience',
    cardTitle: 'Share Your Thoughts',
    formDescription: 'Thank you for taking the time to provide valuable feedback. Your input helps us continuously improve website functionality and user experience.',
    
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
  }
} 