import Express from 'express'

import targetList from './list.json'
import { fetchFollowers } from './twitter'

const app = Express()

const dxdaoUserId = '1165559841290694656'

app.get('/', async (_req, res) => {
  try {
    const followers = await fetchFollowers(dxdaoUserId)

    const resBody = targetList.map((targetUser) => ({
      ...targetUser,
      follows: followers.data.find(
        (user) => user.id.toString() == targetUser.id,
      )
        ? true
        : false,
    }))

    res.json(resBody)
  } catch (e) {
    res.json({
      error: 'Unknown error',
    })
  }
})

app.all('*', (_, res) => {
  res.json({
    error: 'Not found',
  })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
