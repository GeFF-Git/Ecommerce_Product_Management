// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://product-management.azurewebsites.net/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCT_CREATE: '/products/create',
  PRODUCT_EDIT: '/products/:id/edit',
  CATEGORIES: '/categories',
  CATEGORY_CREATE: '/categories/create',
  CATEGORY_EDIT: '/categories/:id/edit',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;

// Data Types
export const DATA_TYPES = {
  STRING: 1,
  INTEGER: 2,
  DECIMAL: 3,
  BOOLEAN: 4,
  DATE: 5,
  JSON: 6,
} as const;

export const DATA_TYPE_NAMES = {
  [DATA_TYPES.STRING]: 'String',
  [DATA_TYPES.INTEGER]: 'Integer',
  [DATA_TYPES.DECIMAL]: 'Decimal',
  [DATA_TYPES.BOOLEAN]: 'Boolean',
  [DATA_TYPES.DATE]: 'Date',
  [DATA_TYPES.JSON]: 'JSON',
} as const;

// Form Validation
export const VALIDATION_RULES = {
  REQUIRED: 'This field is required',
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed`,
  POSITIVE_NUMBER: 'Must be a positive number',
  VALID_EMAIL: 'Please enter a valid email address',
  UNIQUE_SKU: 'Product SKU must be unique',
  VALID_URL: 'Please enter a valid URL',
  VALID_PHONE: 'Please enter a valid phone number',
} as const;

// Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  MAX_ROWS_PER_PAGE: 100,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  STORAGE_KEY: 'ecommerce-theme',
  DEFAULT_THEME: 'system' as const,
  THEMES: ['light', 'dark', 'system'] as const,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'ecommerce-theme',
  USER_PREFERENCES: 'ecommerce-user-preferences',
  SIDEBAR_STATE: 'ecommerce-sidebar-state',
  TABLE_SETTINGS: 'ecommerce-table-settings',
  RECENT_SEARCHES: 'ecommerce-recent-searches',
} as const;

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'text/csv', 'application/vnd.ms-excel'],
  MAX_FILES: 10,
} as const;

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 7000,
  WARNING_DURATION: 5000,
  MAX_NOTIFICATIONS: 5,
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
  MAX_RECENT_SEARCHES: 10,
  MAX_SUGGESTIONS: 5,
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#8B5CF6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4',
  GRADIENT: [
    '#3B82F6',
    '#8B5CF6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#06B6D4',
    '#EC4899',
    '#84CC16',
  ],
} as const;

// Status Colors
export const STATUS_COLORS = {
  ACTIVE: '#10B981',
  INACTIVE: '#6B7280',
  PENDING: '#F59E0B',
  ERROR: '#EF4444',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
} as const;

// Command Palette Configuration
export const COMMAND_PALETTE_CONFIG = {
  MAX_RESULTS: 10,
  RECENT_COMMANDS_LIMIT: 5,
  SHORTCUT_KEY: 'k',
  MODIFIER_KEY: 'cmd', // or 'ctrl' for Windows/Linux
} as const;

// Dashboard Configuration
export const DASHBOARD_CONFIG = {
  REFRESH_INTERVAL: 30000, // 30 seconds
  CHART_ANIMATION_DURATION: 1000,
  STATS_ANIMATION_DELAY: 100,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created!',
  UPDATED: 'Successfully updated!',
  DELETED: 'Successfully deleted!',
  SAVED: 'Successfully saved!',
  IMPORTED: 'Successfully imported!',
  EXPORTED: 'Successfully exported!',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_BULK_OPERATIONS: true,
  ENABLE_EXPORT: true,
  ENABLE_IMPORT: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_COMMAND_PALETTE: true,
  ENABLE_DRAG_DROP: true,
  ENABLE_REAL_TIME: false,
} as const;

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  VIRTUAL_SCROLL_THRESHOLD: 100,
  LAZY_LOAD_THRESHOLD: 50,
  DEBOUNCE_SEARCH: 300,
  THROTTLE_SCROLL: 16,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
} as const;

// Accessibility Configuration
export const A11Y_CONFIG = {
  FOCUS_VISIBLE_OUTLINE: '2px solid #3B82F6',
  SKIP_LINK_TARGET: '#main-content',
  ARIA_LIVE_REGION_ID: 'aria-live-region',
  SCREEN_READER_ONLY_CLASS: 'sr-only',
} as const;