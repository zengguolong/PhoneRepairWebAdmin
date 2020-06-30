<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" element-loading-text="玩命加载中" border="" fit="" highlight-current-row="">
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>

      <el-table-column align="center" label="手机图片" width="100">
        <template slot-scope="scope">
          <el-image style="width: 50px; height: 100px" :src="scope.row.productImage" fit="cover">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column label="品牌" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="型号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.productType }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button style="margin-bottom: 8px;" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除这一段内容吗?" @onConfirm="deleteItem(scope.row, scope.$index)">
            <el-button size="mini" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 加上冒号的变量 比如:total 后面绑定了变量  加上@代表事件-->
    <el-pagination style="text-align: center; margin-top: 24px;" background @current-change="changePage" layout="pager"
      :page-size="8" :total="total">
    </el-pagination>

  </div>
</template>

<script>
  import {
    getList
  } from '@/api/phone.js'
  import request from '@/utils/request.js'

  export default {
    data() {
      return {
        list: null,
        listLoading: true,
        labels: [],
        page: 1,
        total: 0
      }
    },
    created() {
      this.fetchDate()
      this.fetchLabel()
    },
    methods: {
      //当前行数据的获取也会用到插槽,scope相当于一行的数据，scope.row相当于当前行的数据对象,"
      //item参数接受scope.row当前数据对象，index (索引)
      deleteItem(item, index) { //删除手机标签
        console.log(item)
        request({
          url: `/dragon/product/delete?productId=${item.productId}`,
          method: 'get'
        }).then(res => {
          this.list.splice(index, 1) //删除当前list中索引为index的元素，并把当前list返回
          //splice方法第一个参数 要删除的元素的索引从这个元素开始，第二个参数是要删除几个元素
        }).catch(err => {
          console.log(err)
        })
      },

      changePage(e) {
        this.page = e
        this.fetchDate()
      },

      fetchDate() { //分页查询手机产品信息
        this.listLoading = true
        request({
          url: `/dragon/product/pageQueryProduct?page=${this.page}`,
          method: 'get'
        }).then(res => {
          this.total = res.data.total;
          this.list = res.data.list;
          this.listLoading = false;
        }).catch(err => {
          console.log(err)
        })
      },

      edit(item) {
        this.$router.push({
          path: '/edit/editPhone',
          query: {
            'id': item.productId
          }
        })
      },

      fetchLabel() { //获取标签
        request({
          url: `/label/list`,
          method: 'get'
        }).then(res => {
          this.labels = res.data
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="scss">
  .labels-wrapper {
    display: flex;
    margin-bottom: 24px;
    align-items: center;

    >.labels-item {
      font-size: 14px;
      margin-right: 14px;
      border-radius: 4px;
      border: 1px solid #ccc;
      background-color: #fff;
      color: #8d8d8d;
      padding: 2px 6px;
      cursor: pointer;
      transition: all .4s;

      &:hover {
        background-color: #409EFF;
        border: 1px solid #409EFF;
        color: #fff;
      }
    }
  }
</style>
