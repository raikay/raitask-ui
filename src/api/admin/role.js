import request from '@/utils/request'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/roles`

// 角色管理
export const getRole = (params, config = {}) => {
  return request.get(apiPrefix + '/' + params.id, { }, config)
}
export const getRoleListPage = (params, config = {}) => {
  params = params || {}
  return request.get(apiPrefix, { params: params }, config)
}
export const addRole = (params, config = {}) => {
  return request.post(apiPrefix, params, config)
}
export const editRole = (params, config = {}) => {
  return request.put(apiPrefix + '/' + params.id, params, config)
}
export const removeRole = (params, config = {}) => {
  return request.delete(apiPrefix + '/' + params.id, { }, config)
}
// export const batchRemoveRole1 = (params, config = {}) => {
//   return request.delete(apiPrefix + 'batch', params, config)
// }

// 批量删除
export function batchRemoveRole(data) {
  return request({
    url: apiPrefix + '/' + 'batch',
    method: 'delete',
    data: data
  })
}
