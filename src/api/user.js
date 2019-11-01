import request from '@/utils/request'

export function login(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/api/logout/',
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: '/api/admin/user/info/',
    method: 'get'
  })
}

