import cors from 'cors'
const whitelist = ['http://localhost:3000/', 'http://localhost:6006']
const options = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

export default cors(options)
