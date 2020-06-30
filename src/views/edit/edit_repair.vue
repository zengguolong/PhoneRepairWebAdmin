<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">

      <el-form-item label="维修人员名称">
        <el-input v-model="form.workerName" />
      </el-form-item>

      <el-form-item label="联系方式">
        <el-input v-model="form.workerPhone" />
      </el-form-item>

      <el-form-item label="身份证">
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
    data() {
      return {
        form: {
          workerName: '',
          workerPhone: '',
          workerCard: '',
        }
      }
    },

    mounted() {
       this.fetchData()
    },

    methods: {
      onSubmit() {
          request({
            url: `/worker/update?worker_id=${this.form.workerId}&worker_card=${this.form.workerCard}&worker_phone=${this.form.workerPhone}&worker_name=${this.form.workerName}&comment=${this.form.comment}`,
            method: 'get'
          }).then(res => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$router.push({ path: '/manager/worker'})
          }).catch(err => {
            console.log(err)
          })

      },

      onCancel() {
          this.$router.push({ path: '/manager/worker'})
      },

      // 获取信息
      fetchData() {
        // 发送请求
        request({
          url: `/worker/byWorkerId?worker_id=${this.$route.query.id}`,
          method: 'get'
        }).then(res => {
          this.form = res.data
          console.log(this.form)
        }).catch(err => {
          console.log(err)
        })

      },

    }
  }
</script>

<style lang="scss" scoped>
.line{
  text-align: center;
}
</style>
