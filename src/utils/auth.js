import db from '@/utils/localstorage'

// export function getToken() {
//   return db.get('ACCESS_TOKEN', '')
// }

// export function getRefreshToken() {
//   return db.get('REFRESH_TOKEN', '')
// }

// export function getExpireTime() {
//   return db.get('EXPIRE_TIME', 0)
// }

// export function getRouteTokenExpireTime() {
//   return db.get('ROUTE_TOKEN_EXPIRE_TIME', 0)
// }

// export function getRouteToken() {
//   return db.get('ROUTE_TOKEN', '')
// }

// export function removeRouteToken() {
//   return db.remove('ROUTE_TOKEN')
// }

// export function clearAll() {
//   return db.clear()
// }

const TokenKey = 'ACCESS_TOKEN'

export function getToken() {
  return db.get(TokenKey)
}

export function setToken(token) {
  return db.save(TokenKey, token)
}

export function removeToken() {
  return db.remove(TokenKey)
}

export function clearAll() {
  return db.clear()
}
