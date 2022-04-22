import axios from 'axios'
import { writeFile, readFile } from 'fs/promises'
import dayjs from 'dayjs'
import { FollowersChunk, FollowersData, User } from './types'

export const TWITTER_API_V2_BEARER_TOKEN = process.env
  .TWITTER_API_V2_BEARER_TOKEN as string

/**
 * Fetch the list of followings of the user
 * @param userId The user id
 * @returns The list of followings
 */
export async function fetchFollowers(userId: string): Promise<FollowersData> {
  const chunks: FollowersChunk[] = []
  const list: User[] = []
  const max_results = 1000
  const cacheFilePath = `./cache/followers-${userId}.json`
  let paginationToken: any = undefined

  // Try to read the cache file
  try {
    const content = await readFile(cacheFilePath, 'utf8')

    const json = JSON.parse(content)

    if (dayjs().diff(json.expiresAt) < 0) {
      return json.data
    }
  } catch (e) {
    console.log(e)
  }

  const fetchList = (pagination_token: any) => {
    const headers: any = {
      Authorization: `Bearer ${TWITTER_API_V2_BEARER_TOKEN}`,
    }

    return axios.get<FollowersChunk>(
      `https://api.twitter.com/2/users/${userId}/followers`,
      {
        params: {
          max_results,
          pagination_token,
        },
        headers,
      },
    )
  }

  while (paginationToken !== null) {
    try {
      const { data } = await fetchList(paginationToken)

      // push to chunks
      chunks.push(data)
      console.log(data.meta, data.data.length)

      // Push to list
      list.push(...data.data)
      // We arrive at the end of the list  because at the
      // last page, the next_token refers to the first page
      // like a circular list
      paginationToken =
        data.meta.result_count < 1000 ? null : data.meta.next_token
    } catch (e) {
      paginationToken = null
    }
  }

  const followersData: FollowersData = {
    expiresAt: dayjs().add(30, 'm').toISOString(),
    data: list,
    chunks,
  }

  // Save to cache
  writeFile(
    cacheFilePath,
    JSON.stringify(followersData, null, 2),
  ).catch((error) => console.error('failed to save to cache', error))

  return followersData
}
