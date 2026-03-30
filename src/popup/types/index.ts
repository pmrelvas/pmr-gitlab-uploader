export interface GitLabConfig {
  host: string
  token: string
  owner: string
  repo: string
  targetPath: string
  defaultBranch: string
}

export interface EncodedFile {
  name: string
  path: string
  base64: string
  size: number
}

export type StatusType = 'success' | 'error' | null

export interface StatusMessage {
  text: string
  type: StatusType
}
