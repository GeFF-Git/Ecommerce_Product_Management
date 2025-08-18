// Navigation routes
export const ROUTES = {
  DASHBOARD: '/',
  CATEGORIES: '/categories',
  PRODUCTS: '/products',
  SETTINGS: '/settings',
} as const;

// Data type mappings
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

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed`,
  POSITIVE_NUMBER: 'Must be a positive number',
  VALID_EMAIL: 'Please enter a valid email address',
  UNIQUE_SKU: 'Product SKU must be unique',
} as const;

// Table pagination defaults
export const TABLE_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;