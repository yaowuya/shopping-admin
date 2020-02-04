<template>
  <section class="userrole p-5">
    <el-row class="mt-10 px-10">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-select v-model="formInline.user" clearable placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item._id"
              :label="item.username"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名">
          <el-select v-model="formInline.role" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryCategory">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="addCategory('ruleForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        max-height="400"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          prop="user.username"
          label="用户名"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="role.name"
          label="角色名"
          min-width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          min-width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="mt-10">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        :pager-count="pageCount"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="f-right"
      >
      </el-pagination>
    </el-row>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      width="50%"
      center
    >
      <el-form :model="dialogForm" status-icon :rules="rules" ref="ruleForm" label-position="left" label-width="100px">
        <el-form-item v-if="this.dialogStatus==='update'" label="用户" prop="user">
          <el-input v-model="dialogForm.user" readonly></el-input>
        </el-form-item>
        <el-form-item v-if="this.dialogStatus==='create'" label="用户" prop="user">
          <el-select v-model="dialogForm.user" clearable placeholder="请选择" class="w-100">
            <el-option
              v-for="item in formUserList"
              :key="item._id"
              :label="item.username"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="dialogForm.role" clearable placeholder="请选择" class="w-100">
            <el-option
              v-for="item in roleList"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'userrole',
    data () {
      return {
        userList: [],
        roleList: [],
        userRoleList: [],
        formUserList: [],
        formInline: {
          user: '',
          role: ''
        },
        tableData: [],
        multipleSelection: [],
        textMap: {
          update: '编辑',
          create: '添加'
        },
        dialogStatus: 'create',
        dialogVisible: false,
        dialogForm: {
          user: '',
          role: ''
        },
        dialogId: null,
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ]
        },
        parents: [],
        pageNum: 1,
        pageSize: 10,
        pageSizeList: [10, 20, 50, 100, 200],
        pageCount: 11,
        total: 0
      }
    },
    created () {
      this.fetchUser()
      this.fetchRole()
      this.fetchUserRole()
      this.onSearch()
    },
    methods: {
      async fetchUser () {
        let userData = await this.$http.get('/rest/user')
        this.userList = [...userData]
      },
      async fetchRole () {
        let roleData = await this.$http.get('/rest/role')
        this.roleList = [...roleData]
      },
      async fetchUserRole () {
        let userRoleData = await this.$http.get('/rest/userRole')
        this.userRoleList = [...userRoleData]
        this.formUserList = []
        if (this.userRoleList.length === 0) {
          this.formUserList = [...this.userList]
        } else {
          let _that = this
          this.userList.map(function (user) {
            let isUser = _that.userRoleList.some(function (userRole) {
              return userRole.user === user._id
            })
            if (!isUser) {
              _that.formUserList.push(user)
            }
          })
        }
      },
      handleEdit (index, row) {
        this.dialogVisible = true
        this.dialogStatus = 'update'
        this.dialogId = row._id
        this.$nextTick(() => {
          this.dialogForm = Object.assign({}, row)
          this.dialogForm.user = row.user.username
          this.dialogForm.role = row.role._id
          this.empty('ruleForm')
        })
      },
      handleDelete (index, row) {
        this.$confirm(`是否确定要删除该记录 "${row.user.username}"`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$http.delete(`/rest/userRole/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.onSearch()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
        this.pageSize = val
        this.onSearch()
      },
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
        this.pageNum = val
        this.onSearch()
      },
      queryCategory () {
        this.pageNum = 1
        this.onSearch()
      },
      addCategory (formName) {
        this.dialogVisible = true
        this.dialogStatus = 'create'
        this.dialogId = null
        delete this.dialogForm._id
        this.$nextTick(() => {
          this.empty(formName)
        })
      },
      async onSearch () {
        const res = await this.$http.post('/page/userRole/userRole', {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          user: this.formInline.user,
          role: this.formInline.role,
          sort: { '_id': 1 }
        })
        this.tableData = res.data
        this.total = res.count
        this.fetchUser()
        this.fetchRole()
        this.fetchUserRole()
      },
      submitForm (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (this.dialogId) {
              await this.$http.put(`/rest/userRole/${this.dialogId}`, { role: this.dialogForm.role })
            } else {
              await this.$http.post('/rest/userRole', this.dialogForm)
            }
          } else {
            this.$message({
              type: 'error',
              message: '请输入完整信息'
            })
            return false
          }
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.dialogVisible = false
          this.onSearch()
        })
      },
      empty (form) {
        if (this.$refs[form]) {
          this.$refs[form].resetFields()
          this.$refs[form].clearValidate()
        }
      },
      resetForm (formName) {
        this.dialogVisible = false
        this.empty(formName)
      }
    }
  }
</script>

<style scoped>

</style>
