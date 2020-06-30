import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/dragon/product/list',
    method: 'get',
    params
  })
}
