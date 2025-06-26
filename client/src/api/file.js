import { getToken } from "@/utils/auth"
import request from '@/utils/request'

export function upUrl() {
  return import.meta.env.VITE_APP_BASE_API + '/file/'
}

export function upHeaders() {
  return { Authorization: "Bearer " + getToken() }
}

export function getFileList(query) {
  return request({
    url: '/file/',
    method: 'get',
    params: query
  })
}

export function updatefile(id, data) {
  return request({
    url: `/file/${id}/`,
    method: 'put',
    data
  })
}

export function deletefile(id) {
  return request({
    url: `/file/${id}/`,
    method: 'delete'
  })
}