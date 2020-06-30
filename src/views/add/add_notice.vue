<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">

      <el-form-item label="公告栏名称">
        <el-input v-model="form.notice" />
      </el-form-item>

      <el-form-item label="公告栏图片">
          <el-upload
          class="upload-demo"
          drag
          action="#"
          list-type="picture-card"
          :http-request="httpRequest"
          :limit="1"
          :show-file-list="true"
          :multiple="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="beforeExcelUpload">
          <i class="el-icon-upload"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="form.noticeImage" alt="">
          </el-dialog>
      </el-form-item>

      <br />
      <el-form-item style="margin-top: 30px">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>


    </el-form>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import { upload } from '@/api/upload.js'

export default {
  data() {
    return {
      type: 'create',
      labels: [],
      form: {
        noticeImage: '',
        notice: ''
      },
      dialogVisible: false
    }
  },

  mounted() {

  },

  methods: {
    onSubmit() {
        request({
          url: `/notice/add?notice=${this.form.notice}&notice_image=${this.form.noticeImage}`,
          method: 'get'
        }).then(res => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.push({ path: '/manager/notice'})
        }).catch(err => {
          console.log(err)
        })
    },

    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },

    handleRemove(file, fileList) { //图片删除时触发事件
      console.log(file, fileList);
    },

    handlePictureCardPreview(file) { //图片打开照片墙时触发事件
      this.form.noticeImage = file.url;
      console.log(file)
      this.dialogVisible = true;
    },

    beforeExcelUpload(file){ //上传文件之前的钩子
      console.log(file)
    },

    httpRequest(params){   //覆盖上传时的方式
         let fd = new FormData();
         fd.append("file", params.file);
         upload(fd).then(res =>{
            this.form.noticeImage = res.data
            console.log(this.form.noticeImage)
         }).catch(err =>{
            console.log(err)
         })
    }

  }
}
</script>

<style>
</style>
