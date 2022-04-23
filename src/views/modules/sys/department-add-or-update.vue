<template>
  <el-dialog
    :title="!dataForm.departId ? '新增' : '修改'"
    :close-on-click-modal="false"
    @close="closeHandel"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="分子行名称" prop="departName" label-width="100px">
        <el-input
          v-model="dataForm.departName"
          placeholder="分子行名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分子行状态" label-width="100px">
        <el-select v-model="dataForm.status" placeholder="状态">
          <el-option value="0" label="正常"></el-option>
          <el-option value="1" label="停用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="description" label-width="100px">
        <el-input v-model="dataForm.description" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="授权" label-width="100px">
        <el-checkbox-group v-model="checkedList">
          <el-checkbox
            v-for="e in checkList"
            :key="e.roleId"
            :label="e.roleName"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  data () {
    return {
      visible: false,

      checkList: [],
      checkedList: [],
      dataForm: {
        departId: 0,
        departName: '',
        status: '',
        sysRole: [],
        description: ''
      },
      dataRule: {
        departName: [
          { required: true, message: '分子行名称不能为空', trigger: 'blur' }
        ]
      },

    }
  },
  methods: {
    init (dataForm) {
      if (dataForm) {
        this.dataForm = dataForm

        this.dataForm.sysRole.forEach(e => {
          this.checkedList.push(e.roleName)
        })
      } else {
        this.dataForm.departId = ""
      }
      console.info(this.dataForm)
      this.$http({
        url: this.$http.adornUrl('/sys/role/list'),
        method: 'get',
        params: this.$http.adornParams({

        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.checkList = data.page.list
          this.visible = true
        } else {
          this.checkList = []

        }

      })
    },
    closeHandel () {
      this.checkedList = []
      this.dataForm.departId = ""
      this.dataForm.departName = ""
      this.dataForm.status = ""
      this.dataForm.sysRole = []
      this.dataForm.description = ""
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let str = JSON.stringify(this.checkedList)
          this.checkList.forEach(e => {
            if (str.indexOf(e.roleName) != -1) {
              this.dataForm.sysRole.push(e.roleId)
            }
          })
          this.$http({
            url: this.$http.adornUrl(`/sys/depart/${!this.dataForm.departId ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'departId': this.dataForm.departId || undefined,
              'departName': this.dataForm.departName,
              'status': this.dataForm.status,
              'sysRole': this.dataForm.sysRole,
              'description': this.dataForm.description
            })

          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }

}
</script>
