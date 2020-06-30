import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'get'
  })
}
