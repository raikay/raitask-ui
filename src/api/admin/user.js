import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/Users`

// 根据Id获取用户
export const getUser = (params, config = {}) => {
  return request.get(apiPrefix + '/' + params.id, { }, config)
}
// 获取用户列表
export const getUserListPage = (params, config = {}) => {
  return request.get(apiPrefix, { params: params }, config)
}
export const removeUser = (params, config = {}) => {
  return request.delete(apiPrefix + '/' + params.id, { }, config)
}
export const editUser = (params, config = {}) => {
  return request.put(apiPrefix + '/' + params.id, params, config)
}
export const updateBasicUser = (params, config = {}) => {
  return request.put(apiPrefix + '/' + params.id, params, config)
}
// 新增用户
export const addUser = (params, config = {}) => {
  return request.post(apiPrefix, params, config)
}
// export const batchRemoveUser = (params, config = {}) => {
//   return request.put(apiPrefix + 'BatchsoftDelete', params, config)
// }
// 批量删除
export function batchRemoveUser(data) {
  return request({
    url: apiPrefix + '/' + 'batch',
    method: 'delete',
    data: data
  })
}

export const changePassword = (params, config = {}) => {
  return request.put(apiPrefix + '/' + 'ChangePassword', params, config)
}
export const getBasic = (params, config = {}) => {
  return request.get(apiPrefix + '/' + 'getbasic', { params: params }, config)
}
