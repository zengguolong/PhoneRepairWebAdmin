import request from '@/utils/request'

export function upload(data) {
  return request({
    url: '/file/fileUpload',
    method: 'post',
    headers: { "Content-Type": "multipart/form-data" },
    params : data,
    data
  })
}
