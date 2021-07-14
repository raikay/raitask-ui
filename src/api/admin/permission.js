import request from '@/utils/request'
// import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/permissions`

// 权限管理
export const getPermissionList = (params, config = {}) => {
  return request.get(apiPrefix, { params: params }, config)
}
export const removePermission = (params, config = {}) => {
  return request.delete(apiPrefix + '/' + params.id, { }, config)
}
export const getPermissions = (params, config = {}) => {
  return request.get(apiPrefix + '/' + 'userPermissions', { params: params }, config)
}
export const getPermissionIds = (params, config = {}) => {
  return request.get(apiPrefix + '/' + 'rolePermissions', { params: params }, config)
}
export const addRolePermission = (params, config = {}) => {
  return request.put(apiPrefix + '/' + 'Assign', params, config)
}

export const addGroup = (params, config = {}) => {
  return request.post(apiPrefix + '/' + 'group', params, config)
}
export const addMenu = (params, config = {}) => {
  return request.post(apiPrefix + '/' + 'menu', params, config)
}

export const addApi = (params, config = {}) => {
  return request.post(apiPrefix + '/' + 'Api', params, config)
}

export const updateGroup = (params, config = {}) => {
  return request.put(apiPrefix + '/' + 'Group' + '/' + params.id, params, config)
}
export const updateMenu = (params, config = {}) => {
  return request.put(apiPrefix + '/' + 'Menu' + '/' + params.id, params, config)
}
export const updateApi = (params, config = {}) => {
  return request.put(apiPrefix + '/' + 'Api' + '/' + params.id, params, config)
}

export const getGroup = (params, config = {}) => {
  return request.get(apiPrefix + '/' + 'Group/' + params.id, { }, config)
}
export const getMenu = (params, config = {}) => {
  return request.get(apiPrefix + '/' + 'Menu/' + params.id, { }, config)
}
export const getApi = (params, config = {}) => {
  return request.get(apiPrefix + '/' + 'Api/' + params.id, { }, config)
}
