<template>
  <my-container>
    <!--查询-->
    <template #header>
      <el-form
        class="ad-form-query"
        :inline="true"
        :model="filter"
        @submit.native.prevent
      >
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
        <el-form-item>
          <el-button type="primary" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <my-confirm-button
            :disabled="sels.length === 0"
            :type="'delete'"
            :placement="'bottom-end'"
            :loading="deleteLoading"
            :validate="batchDeleteValidate"
            style="margin-left: 0px"
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
      :data="job"
      highlight-current-row
      height="'100%'"
      style="width: 100%; height: 100%"
      @selection-change="selsChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" width="80" label="#" />
      <el-table-column prop="groupName" label="分组名称" width />
      <el-table-column prop="name" label="任务名称" width />
      <el-table-column prop="description" label="任务描述" width />
      <el-table-column prop="displayState" label="状态" width />
      <el-table-column prop="interval" label="时间间隔" width />
      <el-table-column prop="triggerAddress" label="触发地址" width="260" />
      <el-table-column prop="runNumber" label="已执行次数" width />
      <el-table-column
        prop="nextFireTime"
        label="下次执行时间"
        :formatter="formatCreatedTime"
        width
      />
    <!--  <el-table-column
        prop="previousFireTime"
        label="上次执行时间"
        :formatter="formatCreatedTime"
        width
      />
      <el-table-column
        prop="beginTime"
        label="开始时间"
        :formatter="formatCreatedTime"
        width
      />
       <el-table-column prop="endTime" label="结束时间" :formatter="formatCreatedTime" width /> -->
      <!--<el-table-column prop="enabled" label="状态" width="200">
        <template v-slot="{row}">
          <el-tag
            :type="row.enabled ? 'success' : 'danger'"
            disable-transitions
          >{{ row.enabled ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column  label="操作" width="180">
        <template v-slot="{ $index, row }">
          <el-button  @click="onEdit($index, row)">编辑</el-button>
          <my-confirm-button
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

    <el-dialog
      title="新增任务"
      :visible.sync="addFormVisible"
      @close="closeAddForm"
      width="500px"
    >
      <el-form
        label-width="100px"
        :model="addForm"
        ref="addForm"
        :rules="addFormRules"
      >
        <el-form-item label="任务名称">
          <el-input v-model="addForm.jobName" style="width: 350px"></el-input>
        </el-form-item>

        <el-form-item label="分组名称">
          <el-input v-model="addForm.jobGroup" style="width: 350px"></el-input>
        </el-form-item>

        <el-form-item label="请求地址">
          <el-input
            v-model="addForm.requestUrl"
            style="width: 350px"
          ></el-input>
        </el-form-item>

        <el-form-item label="请求类型">
          <el-radio-group v-model="addForm.requestType">
            <el-radio :label="1">Get</el-radio>
            <el-radio :label="2">Post</el-radio>
            <el-radio :label="4">Put</el-radio>
            <el-radio :label="8">Delete</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="开始时间">
          <el-date-picker v-model="addForm.beginTime"></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker v-model="addForm.endTime"></el-date-picker>
        </el-form-item>

        <el-form-item label="触发器类型">
          <el-select v-model="addForm.triggerType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="间隔时间" v-if="addForm.triggerType == 2">
          <el-input
            placeholder="请输入内容"
            v-model="addForm.intervalSecond"
            class="input-with-select"
            style="width: 260px"
          >
            <el-select v-model="selectVal" slot="append" placeholder="请选择" style="width: 70px">
              <el-option label="秒" :value="1"></el-option>
              <el-option label="分" :value="60"></el-option>
              <el-option label="时" :value="3600"></el-option>
              <el-option label="天" :value="86400"></el-option>
            </el-select>
          </el-input>
        </el-form-item>

        <el-form-item label="Cron表达式" v-if="addForm.triggerType == 1">
          <el-input v-model="addForm.cron" style="width: 350px"></el-input>
        </el-form-item>



        <el-form-item label="请求头" >
          <el-input v-model="addForm.headers" style="width: 350px"></el-input>
        </el-form-item>


        <el-form-item label="请求参数" >
          <el-input type="textarea" v-model="addForm.headers" style="width: 350px"></el-input>
        </el-form-item>

        <el-form-item label="任务描述" >
          <el-input type="textarea" v-model="addForm.description" style="width: 350px"></el-input>
        </el-form-item>


          <el-form-item label="邮件通知">
          <el-radio-group v-model="addForm.mailMessage">
            <el-radio :label="0">不通知</el-radio>
            <el-radio :label="1">通知异常</el-radio>
            <el-radio :label="2">通知所有</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>




      

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :validate="addFormValidate"
          :loading="addLoading"
          @click="onAddSubmit"
          >提交</el-button
        >
      </div>
    </el-dialog>


    <!--编辑窗口-->

    <el-dialog
      title="编辑任务"
      :visible.sync="editFormVisible"
      @close="closeEditForm"
      width="500px"
    >
      <el-form
        label-width="100px"
        :model="addForm"
        ref="editForm"
        :rules="addFormRules"
      >
        <el-form-item label="任务名称">
          <el-input v-model="addForm.jobName" style="width: 350px"></el-input>
        </el-form-item>

        <el-form-item label="分组名称">
          <el-input v-model="addForm.jobGroup" style="width: 350px"></el-input>
        </el-form-item>

        <el-form-item label="请求地址">
          <el-input
            v-model="addForm.requestUrl"
            style="width: 350px"
          ></el-input>
        </el-form-item>

        <el-form-item label="请求类型">
          <el-radio-group v-model="addForm.requestType">
            <el-radio :label="1">Get</el-radio>
            <el-radio :label="2">Post</el-radio>
            <el-radio :label="4">Put</el-radio>
            <el-radio :label="8">Delete</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="开始时间">
          <el-date-picker v-model="addForm.beginTime"></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker v-model="addForm.endTime"></el-date-picker>
        </el-form-item>

        <el-form-item label="触发器类型">
          <el-select v-model="addForm.triggerType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="间隔时间" v-if="addForm.triggerType == 2">
          <el-input
            placeholder="请输入内容"
            v-model="addForm.intervalSecond"
            class="input-with-select"
            style="width: 260px"
          >
            <el-select v-model="selectVal" slot="append" placeholder="请选择" style="width: 70px">
              <el-option label="秒" :value="1"></el-option>
              <el-option label="分" :value="60"></el-option>
              <el-option label="时" :value="3600"></el-option>
              <el-option label="天" :value="86400"></el-option>
            </el-select>
          </el-input>
        </el-form-item>

        <el-form-item label="Cron表达式" v-if="addForm.triggerType == 1">
          <el-input v-model="addForm.cron" style="width: 350px"></el-input>
        </el-form-item>



        <el-form-item label="请求头" >
          <el-input v-model="addForm.headers" style="width: 350px"></el-input>
        </el-form-item>


        <el-form-item label="请求参数" >
          <el-input type="textarea" v-model="addForm.headers" style="width: 350px"></el-input>
        </el-form-item>

        <el-form-item label="任务描述" >
          <el-input type="textarea" v-model="addForm.description" style="width: 350px"></el-input>
        </el-form-item>


          <el-form-item label="邮件通知">
          <el-radio-group v-model="addForm.mailMessage">
            <el-radio :label="0">不通知</el-radio>
            <el-radio :label="1">通知异常</el-radio>
            <el-radio :label="2">通知所有</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>




      

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :validate="editFormValidate"
          :loading="editLoading"
          @click="onEditSubmit"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </my-container>
</template>

<script>
import { formatTime } from "@/utils";
import {
  getRoleListPage,
  removeRole,
  editRole,
  addRole,
  batchRemoveRole,
  getRole,
} from "@/api/admin/role";
import MyContainer from "@/components/my-container";
import MyConfirmButton from "@/components/my-confirm-button";
import { getAllJobs, addJobs,removeJob,getJobInfo } from "@/api/admin/task";

export default {
  name: "Roles",
  components: { MyContainer, MyConfirmButton },
  data() {
    return {
      selectVal:1,
      options: [
        {
          value: "2",
          label: "Simple",
        },
        {
          value: "1",
          label: "Cron",
        },
      ],
      filter: {
        name: "",
      },
      roles: [],
      job: [],
      total: 0,
      sels: [], // 列表选中列
      statusList: [
        { name: "激活", value: true },
        { name: "禁用", value: false },
      ],
      listLoading: false,

      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
        enabled: [{ required: true, message: "请输入状态", trigger: "change" }],
      },
      // 编辑界面数据
      editForm: {
        id: "",
        name: "",
        description: "",
        enabled: "",
      },
      editFormRef: null,

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
        enabled: [{ required: true, message: "请输入状态", trigger: "change" }],
      },
      // 新增界面数据
      addForm: {
        jobGroup: "",
        jobName: "",
        jobType: "1", //url
        beginTime: "",
        triggerType: "2",
        requestUrl: "",
        requestType: 1,
        intervalSecond: "",
        mailMessage: 0,
        cron: "",
      },
      addFormRef: null,
      deleteLoading: false,
    };
  },
  mounted() {
    this.getRoles();
    this.getJob();
  },
  methods: {
    formatCreatedTime: function (row, column, time) {
      return formatTime(time, "YYYY-MM-DD HH:mm");
    },
    onSearch() {
      this.$refs.pager.setPage(1);
      this.getRoles();
    },
    // 获取角色列表
    async getRoles() {
      var pager = this.$refs.pager.getPager();
      const params = {
        ...pager,
        filter: this.filter,
      };
      this.listLoading = true;
      const res = await getRoleListPage(params);
      this.listLoading = false;

      if (!res?.success) {
        return;
      }

      this.total = res.data.total;
      const data = res.data.list;
      data.forEach((d) => {
        d._loading = false;
      });
      this.roles = data;
    },

    // 获取任务列表
    async getJob() {
      var pager = this.$refs.pager.getPager();
      const params = {
        ...pager,
        filter: this.filter,
      };
      this.listLoading = true;
      const res = await getAllJobs(params);
      this.listLoading = false;

      this.total = 30; //res.data.total
      this.job = res.data;
    },

    // 显示编辑界面
    async onEdit(index, row) {
      const loading = this.$loading();
      const res = await getJobInfo({group: row.groupName,name:row.name});
      this.editFormVisible = true;
      loading.close();
    //  if (res && res.success) {
      //  const data = res.data;
        this.addForm = res;
        
      //}
    },
    closeEditForm() {
      this.$refs.editForm.resetFields();
    },
    // 显示新增界面
    onAdd() {
      this.addForm={};
      this.addFormVisible = true;
    },
    closeAddForm() {
      this.$refs.addForm.resetFields();
    },
    // 编辑验证
    editFormValidate: function () {
      let isValid = false;
      this.$refs.editForm.validate((valid) => {
        isValid = valid;
      });
      return isValid;
    },
    // 编辑
    async onEditSubmit() {
      this.editLoading = true;
      const para = _.cloneDeep(this.editForm);

      const res = await editRole(para);
      this.editLoading = false;

      if (!res?.success) {
        return;
      }

      this.$message({
        message: this.$t("admin.updateOk"),
        type: "success",
      });
      this.$refs["editForm"].resetFields();
      this.editFormVisible = false;
      this.getRoles();
    },
    // 新增验证
    addFormValidate: function () {
      let isValid = false;
      this.$refs.addForm.validate((valid) => {
        isValid = valid;
      });
      return isValid;
    },
    // 新增
    async onAddSubmit() {
      this.addLoading = true;
      this.addForm.intervalSecond=this.addForm.intervalSecond*this.selectVal
      const para = _.cloneDeep(this.addForm);

      const res = await addJobs(para);
      this.addLoading = false;

      if (!res?.success) {
        return;
      }

      this.$message({
        message: this.$t("admin.addOk"),
        type: "success",
      });
      this.$refs["addForm"].resetFields();
      this.addFormVisible = false;
      this.getRoles();
    },
    // 删除验证
    deleteValidate(row) {
      let isValid = true;
      if (row && row.name === "admin") {
        this.$message({
          message: row.description + "，禁止删除！",
          type: "warning",
        });
        isValid = false;
      }

      return isValid;
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true;
      const para = { group: row.groupName,name:row.name };
      console.log(para);
      const res = await removeJob(para);
      row._loading = false;



      this.$message({
        message: this.$t("admin.deleteOk"),
        type: "success",
      });

        this.getJob();
    },
    // 批量删除验证
    batchDeleteValidate() {
      let isValid = true;
      var row = this.sels && this.sels.find((s) => s.name === "admin");
      if (row && row.name === "admin") {
        this.$message({
          message: row.description + "，禁止删除！",
          type: "warning",
        });
        isValid = false;
      }

      return isValid;
    },
    // 批量删除
    async onBatchDelete() {
      const para = { ids: [] };
      para.ids = this.sels.map((s) => {
        return s.id;
      });

      this.deleteLoading = true;
      console.log(para.ids);
      const res = await batchRemoveRole(para.ids);
      this.deleteLoading = false;

      if (!res?.success) {
        return;
      }
      this.$message({
        message: this.$t("admin.batchDeleteOk"),
        type: "success",
      });

      this.getRoles();
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
  },
};
</script>
