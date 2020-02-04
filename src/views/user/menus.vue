<template>
  <section class="menu">
    <el-row class="mt-10 px-10">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="formInline.title" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryAd">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="addAd">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <Table
      :table-data="tableData"
      :columns="columns"
      :page-num="pageNum"
      :page-size="pageSize"
      :total="total"
      @search="search"
    >
      <el-table-column
        slot="operate"
        fixed="right"
        label="操作"
        min-width="200"
        align="center">
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
    </Table>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      width="50%"
      center
    >
      <el-form :model="dialogForm" ref="ruleForm" label-position="left" label-width="100px">
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="dialogForm.order" class="w-100"></el-input-number>
        </el-form-item>
        <el-form-item label="菜单中文名" prop="title">
          <el-input v-model="dialogForm.title"></el-input>
        </el-form-item>
        <el-form-item label="菜单英文名" prop="name">
          <el-input v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单url" prop="path">
          <el-input v-model="dialogForm.path"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-select v-model="dialogForm.hidden" clearable placeholder="请选择" class="w-100">
            <el-option key="hidden-1" label="否" :value=false></el-option>
            <el-option key="hidden-2" label="是" :value=true></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input v-model="dialogForm.component"></el-input>
        </el-form-item>
        <el-form-item label="重定向url" prop="redirect">
          <el-input v-model="dialogForm.redirect"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="dialogForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="父菜单" prop="parent">
          <el-select v-model="dialogForm.parent" clearable placeholder="请选择" class="w-100">
            <el-option
              v-for="item in menuList"
              :key="item._id"
              :label="item.title"
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
  import Table from '../../components/Table'

  export default {
    name: 'menus',
    components: {
      Table
    },
    data () {
      return {
        menuList: [],
        tableData: [],
        columns: [],
        formInline: {
          title: ''
        },
        ads: [],
        textMap: {
          update: '编辑',
          create: '添加'
        },
        dialogStatus: 'create',
        dialogVisible: false,
        dialogForm: {
          title: '',
          name: '',
          path: '',
          component: '',
          hidden: false,
          redirect: '',
          icon: '',
          order: 0,
          parent: null
        },
        dialogId: null,
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    },
    created () {
      this.fetch()
      this.initCol()
      this.onSearch()
    },
    methods: {
      initCol () {
        this.columns = [
          { label: '排序', prop: 'order', width: '100' },
          { label: '菜单中文名', prop: 'title', width: '120' },
          { label: '菜单英文名', prop: 'name', width: '100' },
          { label: '父菜单', prop: 'parent.title', width: '120' },
          { label: '菜单url', prop: 'path', width: '200' },
          { label: '是否隐藏', prop: 'hidden', width: '100' },
          { label: '组件', prop: 'component', width: '120' },
          { label: '重定向url', prop: 'redirect', width: '200' },
          { label: '图标', prop: 'icon', width: '120' },
          { slot: 'operate' }
        ]
      },
      async fetch () {
        let menuData = await this.$http.get('/rest/menu')
        this.menuList = [...menuData]
      },
      search (pageNum, pageSize) {
        this.pageNum = pageNum
        this.pageSize = pageSize
        this.onSearch()
      },
      async onSearch () {
        const res = await this.$http.post('/page/menu/menu/pageList', {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          title: this.formInline.title,
          sort: { 'order': 1 }
        })
        this.tableData = res.data
        this.total = res.count
        this.fetch()
        // console.log('onSearch', res)
      },
      afterUpload (res) {
        // this.$set(this.dialogForm.url, 'icon', res.url)
        this.dialogForm.icon = res.url
      },
      addAd () {
        this.dialogVisible = true
        this.dialogStatus = 'create'
        this.dialogId = null
        // 删除_id,防止创建时传入重复_id
        delete this.dialogForm._id
        this.empty('ruleForm')
        this.dialogForm.icon = ''
      },
      queryAd () {
        this.pageNum = 1
        this.onSearch()
      },
      handleEdit (index, row) {
        this.dialogVisible = true
        this.dialogStatus = 'update'
        this.dialogId = row._id
        this.empty()
        this.$nextTick(() => {
          this.dialogForm = Object.assign({}, row)
          this.dialogForm.parent = row.parent._id
          this.empty('ruleForm')
        })
      },
      handleDelete (index, row) {
        this.$confirm(`是否确定要删除菜单 "${row.name}"`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$http.delete(`/rest/menu/${row._id}`)
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
      empty (form) {
        if (this.$refs[form]) {
          // 根据需求二选一
          /**
           * 移除校验结果并重置字段值
           * 注：清除表单项name的校验及数值
           */
          this.$refs[form].resetFields()
          /**
           * 移除校验结果
           * 注：只清除表单项name的校验，不清楚表单项name的数值
           */
          this.$refs[form].clearValidate()
        }
      },
      async submitForm (formName) {
        if (this.dialogForm.parent === '') {
          this.dialogForm.parent = null
        }
        if (this.dialogId) {
          await this.$http.put(`/rest/menu/${this.dialogId}`, this.dialogForm)
        } else {
          await this.$http.post('/rest/menu', this.dialogForm)
        }
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.dialogVisible = false
        this.onSearch()
      },
      resetForm (formName) {
        this.empty(formName)
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
