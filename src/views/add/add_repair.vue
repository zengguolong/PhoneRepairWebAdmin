<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">

      <el-form-item label="维修人员名称">
        <el-input v-model="form.workerName" />
      </el-form-item>

      <el-form-item label="联系方式">
        <el-input v-model="form.workerPhone" />
      </el-form-item>

      <el-form-item label="身份证" v-if="type === 'create'">
        <el-input v-model="form.workerCard" />
      </el-form-item>

      <el-form-item style="margin-top: 30px">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'RepairForm',
  data() {
    return {
      type: 'create',
      form: {
        workerName: '',
        workerPhone: '',
        workerCard: '',
      }
    }
  },

  mounted() {

  },

  methods: {
    onSubmit() {
        request({
          url: `/worker/add?worker_card=${this.form.workerCard}&worker_phone=${this.form.workerPhone}&worker_name=${this.form.workerName}`,
          method: 'get'
        }).then(res => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.push({
            path: '/manager/worker'
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
