import cors from 'cors'

const whitelist = ['http://localhost:3000', 'http://localhost:6006']

export default () =>
  cors({
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  })
