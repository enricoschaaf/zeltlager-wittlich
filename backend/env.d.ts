declare namespace NodeJS {
  export interface ProcessEnv {
    TABLE_NAME: string
    YEAR: string
    BUCKET_NAME: string
    COMPUTER_VISION_KEY: string
    COMPUTER_VISION_ENDPOINT: string
    BASE_URL: string
    PRIVATE_KEY: string
    PUBLIC_KEY: string
    FUNCTION_NAME: string
    AUTH_TABLE_NAME: string
    ACCOUNT: string
    GOOGLE_CLIENT_EMAIL: string
    GOOGLE_PRIVATE_KEY: string
    GOOGLE_SHEET_ID: string
  }
}
