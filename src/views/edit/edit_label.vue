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
  data() {
    return {
      form: {
        phoneLabel: ''
      }
    }
  },

  mounted() {
     this.fetchData()
  },

  methods: {
    onSubmit() {
        request({
          url: `/label/update?id=${this.form.id}&phone_type=${this.form.phoneLabel}`,
          method: 'get'
        }).then(res => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.push({ path: '/manager/label'})
        }).catch(err => {
          console.log(err)
        })
    },

    onCancel() {     
       this.$router.push({ path: '/manager/label'})
    },

    // 获取信息
    fetchData() {

      // 发送请求
      request({
        url: `/label/byLabelId?id=${this.$route.query.id}`,
        method: 'get'
      }).then(res => {
        this.form = res.data
      }).catch(err => {
        console.log(err)
      })

    },

  }
}
</script>

<style>
</style>
