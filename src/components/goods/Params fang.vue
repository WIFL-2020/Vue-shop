<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
       <el-alert title="注意： 只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon>
  </el-alert>

  <!-- 选择商品分类区域 -->
    <el-row class="cat_opt">
      <el-col>
      <span>商品的分类：</span>
       <!-- 选择商品分类的级联选择框 -->
        <el-cascader
          v-model="selectedCateKeys"
          :options="catelist"
          :props="cateProps"
          @change="handleChange"></el-cascader>
      </el-col>
    </el-row>

    <!-- 页签区域 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <!-- 动态参数表格 -->
    <el-tab-pane label="动态参数" name="many">
      <!-- 动态参数的按钮 -->
      <el-button type="primary" :disabled="isBtnDisabled" size="mini" @click="addDialogVisible=true">动态参数</el-button>
      <!-- 动态参数表格  -->
      <el-table :data="manyTableData" border stripe>
         <!-- 展开行 -->
    <el-table-column type="expand">
      <template slot-scope="scope">
        <!-- 循环生成的el-tag -->
        <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
          >{{item}}</el-tag
        >
        <!-- 输入框 -->
        <el-input
          class="input-new-tag"
          v-if="scope.row.inputVisible"
          v-model="scope.row.inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm(scope.row)"
          @blur="handleInputConfirm(scope.row)"
        >
        </el-input>
        <!-- 添加按钮 -->
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showInput(scope.row)"
          >+ New Tag</el-button
        >
      </template>
    </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" class="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                <el-button size="mini" type="danger" class="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性的表格 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 静态参数的按钮 -->
          <el-button type="primary" :disabled="isBtnDisabled" size="mini" @click="addDialogVisible= true">静态属性</el-button>
          <!-- 静态属性表格  -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行的操作 -->
                <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" class="el-icon-edit" @click="showEditDialog((scope.row.attr_id))">编辑</el-button>
                <el-button size="mini" type="danger" class="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
        <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClosed">
     <!-- 添加参数的对话框 -->
     <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
  </el-form-item>
     </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
        <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
     <!-- 添加参数的对话框 -->
     <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name" autocomplete="off"></el-input>
  </el-form-item>
     </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类列表
      catelist: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定的数组
      selectedCateKeys: [],
      // 激活的名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      // 参加表单的数据对象
      addForm: {
        attr_name: ''
      },
      // 添加表单的验证规则对象
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改表单数据对象
      editForm: {},
      // 修改表单的数据对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      // 用户输入了内容
    }
    // 点击按钮展示输入文本框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick: 当页面上的元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    handleChange () {
      this.getParamDate()
    },
    handleTabClick() {
      console.log(this.activeName)
      this.getParamDate()
    },
    async getParamDate() {
      // 判断选择的是不是三级选择框 如果不是就清空
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return
      }
      // 证明获取的是三级分类
      console.log(this.selectedCateKeys)
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      // 将获取到的数据中的attr_vals字符串转换为数组
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 添加一个bool值控制文本框的显示或者隐藏
        item.inputVisible = false
        // 添加一个inputValue保存文本框值
        item.inputValue = ''
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamDate()
      })
    },
    // 点击按钮，展示修改的对话框
    async showEditDialog(attrid) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrid}`,
        {
          params: { attr_sel: this.activeName }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }

      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 重置修改的表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮修改对话信息
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }

        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 根据Id删除对应的参数项
    async removeParams(attrid) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 用户取消了删除的操作
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }

      // 删除的业务逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attrid}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }

      this.$message.success('删除参数成功！')
      this.getParamsData()
    }
  },
  computed: {
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三角分类的Id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
 .cat_opt {
    margin:15px 0;
  }
  .el-tag {
    margin: 0 10px;
  }
  .input-new-tag{
  width: 120px;
}
</style>
