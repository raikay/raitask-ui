<template>
  <my-container>
    <!--查询-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <!-- <el-form-item>
          <el-input
            v-model="filter.name"
            placeholder="角色名"
            clearable
            @keyup.enter.native="onSearch"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </el-input>
        </el-form-item> -->
        <el-form-item>
          <!-- <el-button type="primary" @click="onSearch">查询</el-button> -->
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:role:add'])">
          <el-button type="primary" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:role:batchsoftdelete'])">
          <my-confirm-button
            :disabled="sels.length === 0"
            :type="'delete'"
            :placement="'bottom-end'"
            :loading="deleteLoading"
            :validate="batchDeleteValidate"
            style="margin-left: 0px;"
            @click="onBatchDelete"
          >
            <template #content>
              <p>确定要批量删除吗？</p>
            </template>
            批量删除
          </my-confirm-button>
        </el-form-item>
      </el-form>
    </template>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="roles"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
      @selection-change="selsChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" width="80" label="#" />
      <el-table-column prop="name" label="角色名" width />
      <el-table-column prop="description" label="说明" width />
      <el-table-column prop="createdTime" label="创建时间" :formatter="formatCreatedTime" width />
      <!--<el-table-column prop="CreatedUserName" label="创建者" width="" >-->
      <!--</el-table-column>-->
      <el-table-column prop="enabled" label="状态" width="200">
        <template v-slot="{row}">
          <el-tag
            :type="row.enabled ? 'success' : 'danger'"
            disable-transitions
          >{{ row.enabled ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['api:admin:role:update','api:admin:role:softdelete'])" label="操作" width="180">
        <template v-slot="{ $index, row }">
          <el-button v-if="checkPermission(['api:admin:role:update'])" @click="onEdit($index, row)">编辑</el-button>
          <my-confirm-button
            v-if="checkPermission(['api:admin:role:softdelete'])"
            type="delete"
            :loading="row._loading"
            :validate="deleteValidate"
            :validate-data="row"
            @click="onDelete($index, row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <template #footer>
      <my-pagination
        ref="pager"
        :total="total"
        :checked-count="sels.length"
        @get-page="getRoles"
      />
    </template>

    <!--新增窗口-->
    <el-drawer
      v-if="checkPermission(['api:admin:role:add'])"
      title="新增角色"
      :wrapper-closable="true"
      :visible.sync="addFormVisible"
      direction="btt"
      size="'auto'"
      class="el-drawer__wrapper"
      @close="closeAddForm"
    >
      <section style="padding:24px 48px 74px 24px;">
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          label-width="80px"
          :inline="false"
        >
          <el-row>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="角色名" prop="name">
                <el-input v-model="addForm.name" auto-complete="off" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="状态" prop="enabled">
                <el-select v-model="addForm.enabled" placeholder="请选择角色状态" style="width:100%;">
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="说明" prop="description">
                <el-input v-model="addForm.description" auto-complete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
      <div class="drawer-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" :validate="addFormValidate" :loading="addLoading" @click="onAddSubmit">提交</el-button>
      </div>
    </el-drawer>

    <!--编辑窗口-->
    <el-drawer
      v-if="checkPermission(['api:admin:role:update'])"
      title="编辑角色"
      :wrapper-closable="true"
      :visible.sync="editFormVisible"
      direction="btt"
      size="'auto'"
      @close="closeEditForm"
    >
      <section style="padding:24px 48px 74px 24px;">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          label-width="80px"
          :inline="false"
        >
          <el-row>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="角色名" prop="name">
                <el-input v-model="editForm.name" auto-complete="off" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="状态" prop="enabled">
                <el-select v-model="editForm.enabled" placeholder="请选择角色状态" style="width:100%;">
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="说明" prop="description">
                <el-input v-model="editForm.description" auto-complete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
      <div class="drawer-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" :validate="editFormValidate" :loading="editLoading" @click="onEditSubmit">提交</el-button>
      </div>
    </el-drawer>
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import { getRoleListPage, removeRole, editRole, addRole, batchRemoveRole, getRole } from '@/api/admin/role'
import MyContainer from '@/components/my-container'
import MyConfirmButton from '@/components/my-confirm-button'

export default {
  name: 'Roles',
  components: { MyContainer, MyConfirmButton },
  data() {
    return {
      filter: {
        name: ''
      },
      roles: [],
      total: 0,
      sels: [], // 列表选中列
      statusList: [
        { name: '激活', value: true },
        { name: '禁用', value: false }
      ],
      listLoading: false,

      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        enabled: [{ required: true, message: '请输入状态', trigger: 'change' }]
      },
      // 编辑界面数据
      editForm: {
        id: '',
        name: '',
        description: '',
        enabled: ''
      },
      editFormRef: null,

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        enabled: [{ required: true, message: '请输入状态', trigger: 'change' }]
      },
      // 新增界面数据
      addForm: {
        name: '',
        description: '',
        enabled: true
      },
      addFormRef: null,
      deleteLoading: false
    }
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    onSearch() {
      this.$refs.pager.setPage(1)
      this.getRoles()
    },
    // 获取角色列表
    async getRoles() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        filter: this.filter
      }
      this.listLoading = true
      const res = await getRoleListPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
      })
      this.roles = data
    },
    // 显示编辑界面
    async onEdit(index, row) {
      const loading = this.$loading()
      const res = await getRole({ id: row.id })
      loading.close()
      if (res && res.success) {
        const data = res.data
        this.editForm = data
        this.editFormVisible = true
      }
    },
    closeEditForm() {
      this.$refs.editForm.resetFields()
    },
    // 显示新增界面
    onAdd() {
      this.addFormVisible = true
    },
    closeAddForm() {
      this.$refs.addForm.resetFields()
    },
    // 编辑验证
    editFormValidate: function() {
      let isValid = false
      this.$refs.editForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    // 编辑
    async onEditSubmit() {
      this.editLoading = true
      const para = _.cloneDeep(this.editForm)

      const res = await editRole(para)
      this.editLoading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.updateOk'),
        type: 'success'
      })
      this.$refs['editForm'].resetFields()
      this.editFormVisible = false
      this.getRoles()
    },
    // 新增验证
    addFormValidate: function() {
      let isValid = false
      this.$refs.addForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    // 新增
    async onAddSubmit() {
      this.addLoading = true
      const para = _.cloneDeep(this.addForm)

      const res = await addRole(para)
      this.addLoading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.addOk'),
        type: 'success'
      })
      this.$refs['addForm'].resetFields()
      this.addFormVisible = false
      this.getRoles()
    },
    // 删除验证
    deleteValidate(row) {
      let isValid = true
      if (row && row.name === 'admin') {
        this.$message({
          message: row.description + '，禁止删除！',
          type: 'warning'
        })
        isValid = false
      }

      return isValid
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true
      const para = { id: row.id }
      const res = await removeRole(para)
      row._loading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })

      this.getRoles()
    },
    // 批量删除验证
    batchDeleteValidate() {
      let isValid = true
      var row = this.sels && this.sels.find(s => s.name === 'admin')
      if (row && row.name === 'admin') {
        this.$message({
          message: row.description + '，禁止删除！',
          type: 'warning'
        })
        isValid = false
      }

      return isValid
    },
    // 批量删除
    async onBatchDelete() {
      const para = { ids: [] }
      para.ids = this.sels.map(s => {
        return s.id
      })

      this.deleteLoading = true
      console.log(para.ids)
      const res = await batchRemoveRole(para.ids)
      this.deleteLoading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.batchDeleteOk'),
        type: 'success'
      })

      this.getRoles()
    },
    selsChange: function(sels) {
      this.sels = sels
    }
  }
}
</script>
