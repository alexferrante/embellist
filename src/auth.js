export const attemptLogin = () => {
  const [, query] = window.location.hash.split('#')

  if (query) {
    const params = new URLSearchParams(query)
    const accessToken = params.get('access_token')
    const expiresIn = params.get('expires_in')

    if (accessToken && expiresIn) {
      const now = new Date()
      const expiryInMs = now.setSeconds(now.getSeconds() + parseInt(expiresIn, 10))

      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('expires_at', expiryInMs)
    }
  }
}

export const isLoggedIn = () => {
  const accessToken = localStorage.getItem('access_token')
  const expiresAt = localStorage.getItem('expires_at')

  return accessToken && expiresAt && Date.now() < expiresAt
}
