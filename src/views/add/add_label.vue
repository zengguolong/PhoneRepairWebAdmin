<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">

      <el-form-item label="标签名称">
        <el-input v-model="form.phoneLabel" />
      </el-form-item>

      <el-form-item style="margin-top: 30px">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from '@/utils/request.js'

export default {
  name: 'RepairForm',
  data() {
    return {
      type: 'create',
      form: {
        phoneLabel: ''
      }
    }
  },

  mounted() {

  },

  methods: {
    onSubmit() {
        request({
          url: `/label/add?phone_type=${this.form.phoneLabel}`,
          method: 'get'
        }).then(res => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.push({
            path: '/manager/label'
          })
        }).catch(err => {
          console.log(err)
        })
    },

    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.line{
  text-align: center;
}
</style>
