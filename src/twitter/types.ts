export interface User {
  screen_name: string
  id: number
  url: string
}

export interface FollowersChunk {
  data: User[]
  meta: {
    result_count: number
    next_token: string
    previous_token?: string
  }
}

export interface FollowersData {
  chunks: FollowersChunk[]
  expiresAt: string
  data: User[]
}
