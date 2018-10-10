'use-strict'

import Jwt from 'jsonwebtoken'

const ACCESS_TOKEN_KEY = 'access-token'

let auth = {}

auth.checkAuth = () => {
  const decoded = auth.readAccessToken(auth.getAccessToken())

  // console.log(decoded)
  // console.log('valid:', (decoded && Date.parse(decoded.exp) > Date.now()))

  return decoded && Date.parse(decoded.exp) > Date.now()
}

auth.readAccessToken = (token) => {
  return Jwt.decode(token)
}

auth.getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

auth.setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

auth.clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export default auth
