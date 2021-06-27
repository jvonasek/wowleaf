export const cookieStorage = () => ({
  getItem: (name: string) => {
    const fullName = name + '='
    const cookiesDecoded = decodeURIComponent(document.cookie)
    const cookies = cookiesDecoded.split('; ')
    let value: string
    cookies.forEach((cookie) => {
      if (cookie.indexOf(fullName) === 0) {
        value = cookie.substring(fullName.length)
      }
    })
    return value
  },
  setItem: (name: string, value: string, expiration = 3650) => {
    const date = new Date()
    date.setTime(date.getTime() + expiration * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + date.toUTCString()
    document.cookie = name + '=' + value + '; ' + expires + '; path=/'
  },
})
