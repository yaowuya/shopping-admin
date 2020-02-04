<template>
  <section class="category-list p-5">
    <el-row class="mt-10 px-10">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="formInline.username" placeholder="分类名称"></el-input>
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
          prop="username"
          label="用户名"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="password"
          label="密码"
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="dialogForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="dialogForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="enPassword">
          <el-input type="password" v-model="dialogForm.enPassword"></el-input>
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
  import { mapGetters } from 'vuex'

  export default {
    name: 'user',
    data () {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.dialogForm.enPassword !== '') {
            this.$refs.ruleForm.validateField('enPassword')
          }
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.dialogForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        formInline: {
          username: ''
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
          username: '',
          password: '',
          enPassword: ''
        },
        dialogId: null,
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          enPassword: [
            { required: true, validator: validatePass2, trigger: 'blur' }
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
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    created () {
      this.onSearch()
    },
    methods: {
      handleEdit (index, row) {
        this.dialogVisible = true
        this.dialogStatus = 'update'
        this.dialogId = row._id
        this.$nextTick(() => {
          this.dialogForm = Object.assign({}, row)
          this.empty('ruleForm')
        })
      },
      handleDelete (index, row) {
        this.$confirm(`是否确定要删除分类 "${row.name}"`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$http.delete(`/rest/user/${row._id}`)
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
        const res = await this.$http.post('/page/user/user/pageList', {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.formInline.username
        })
        this.tableData = res.data
        this.total = res.count
      },
      submitForm (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (this.dialogId) {
              await this.$http.put(`/rest/user/${this.dialogId}`, this.dialogForm)
            } else {
              await this.$http.post('/rest/user', this.dialogForm)
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
