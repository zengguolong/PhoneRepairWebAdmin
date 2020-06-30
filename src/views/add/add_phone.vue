<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">

      <el-form-item label="品牌名称">
        <el-select v-model="form.productName" placeholder="请选择手机品牌">
          <el-option :key="item.id" v-for="item in labels" :label="item.phoneLabel" :value="item.phoneLabel"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="手机型号">
        <el-input v-model="form.productType" :readonly="confirmType === true" />
        <el-button style="margin-top: 8px;" @click="confirmType = true">确认手机型号</el-button>
      </el-form-item>

      <el-form-item label="手机图片">
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
            <img width="100%" :src="form.productImage" alt="">
          </el-dialog>
      </el-form-item>

      <br />
      <h3>维修项目管理</h3>
      <div class="managerList-item" :key="item.id" v-for="(item, index) in managerList">
        <div style="font-size: 12px;">序号：{{ index }}</div>
        <el-form-item label="故障名称：">
          <el-input size="mini" v-model="item.message" />
        </el-form-item>
        <el-form-item label="维修价格：">
          <el-input size="mini" v-model="item.price" />
        </el-form-item>

        <el-button style="margin-left: 14px;" type="primary" size="mini" @click="submitItem(item, index)">保存</el-button>
      </div>

      <el-button size="mini" @click="addMessage">添加此型号故障信息</el-button>

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
        labels: [],
        form: {
          productName: '',
          productType: '',
          productImage: ''
        },
        managerList: [],
        confirmType: false,
        dialogVisible: false
      }
    },

    mounted() {
      this.fetchLabel()
    },

    methods: {
      addMessage() {
        if (this.confirmType === false) {
          this.$message.error('请先确认手机型号。')
          return
        }

        this.managerList.push({
          message: '',
          phoneType: this.form.productType,
          price: 0,
          edit: true,
          add: true
        })
      },

      fetchLabel() {
        request({
          url: `/label/list`,
          method: 'get'
        }).then(res => {
          this.labels = res.data
        }).catch(err => {
          console.log(err)
        })
      },

      onSubmit() {
        request({
          url: `/dragon/product/add?product_name=${this.form.productName}&product_type=${this.form.productType}&product_image=${this.form.productImage}`,
          method: 'get'
        }).then(res => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.push({
            path: '/manager/phone'
          })
        }).catch(err => {
          console.log(err)
        })
      },

      // 提交维修项目
      submitItem(item, index) {
        request({
          url: `/manager/add?phone_type=${this.form.productType}&message=${item.message}&price=${item.price}`,
          method: 'get'
        }).then(res => {
          this.$message({
            message: res.message,
            type: 'success'
          })
        }).catch(err => {
          console.log(err)
        })
      },

      // 编辑维修项目
      editItem(item, index) {

        for (let i = 0; i < this.managerList.length; i++) {
          if (this.managerList[i].edit === true) {
            this.$message({
              message: '请先保存当前所编辑的项目',
              type: 'error'
            })
            return false
          }
        }

        this.managerList[index].edit = true
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
        this.form.productImage = file.url;
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
              this.form.productImage = res.data
           }).catch(err =>{
              console.log(err)
           })
      }

    }
  }
</script>

<style>
</style>
