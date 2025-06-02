import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

const redis = new Redis(process.env.UPSTASH_URL)

export { redis }



// ENDPOINT: amazing-orca-11231.upstash.io
// PASSWORD: ASvfAAIjcDE3YzM3ZTJkMjc4MWE0NzhlOTcwZDJhYzRlZGM0ZDNjZnAxMA
// PORT: 6379
// TLS/SSL: Enabled

// REST API
// import { Redis } from '@upstash/redis'

// const redis = new Redis({
// 	url: 'https://amazing-orca-11231.upstash.io',
// 	token: 'ASvfAAIjcDE3YzM3ZTJkMjc4MWE0NzhlOTcwZDJhYzRlZGM0ZDNjZnAxMA',
// })

// await redis.set('foo', 'bar')
// const data = await redis.get('foo')

// console.log(data)