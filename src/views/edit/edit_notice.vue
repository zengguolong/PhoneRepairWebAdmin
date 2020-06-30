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
          :before-upload="beforeExcelUpload"
          :file-list="imagesUrl">
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
      form: {
        noticeImage: '',
        notice: ''
      },
      dialogVisible : false,
      imagesUrl : [],
    }
  },

  mounted() {
     this.fetchData()
  },

  methods: {
    onSubmit() {
       request({
          url: `/notice/update?id=${this.form.id}&notice=${this.form.notice}&notice_image=${this.form.noticeImage}`,
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
    this.$router.push({ path: '/manager/notice'})
    },

    // 获取信息
    fetchData() {

      // 发送请求
      request({
        url: `/notice/byId?id=${this.$route.query.id}`,
        method: 'get'
      }).then(res => {
        this.form = res.data
        let picture = {url:''}
        picture.url = res.data.noticeImage
        this.imagesUrl.push(picture)
      }).catch(err => {
        console.log(err)
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
         }).catch(err =>{
            console.log(err)
         })
    }

  }
}
</script>

<style>
.line{
  text-align: center;
}

.upload-area {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  position: relative;
  display: inline-block;
  height: 10rem;
  width: 10rem;
  border: 1px dashed #ccc;
  border-radius: 3px;
  cursor: pointer;
  &::after {
    content: '+';
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    font-weight: 200;
    width: 100%;
    height: 100%;
    color: #ccc;
    position: absolute;
    top: 0rem;
    left: 0rem;
    z-index: -1;
  }
}
</style>
