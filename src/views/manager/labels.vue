<template>
  <!-- 手机标签管理 -->
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="labelsList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签名称">
        <template slot-scope="scope">
          {{ scope.row.phoneLabel }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button style="margin-bottom: 8px;" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteItem(scope.row, scope.$index)">
            <el-button size="mini" slot="reference">删除</el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import request from '@/utils/request'
  
  export default {
    name: 'Labels', // 标签
    data() {
      return {
        labelsList: []
      }
    },
    created() {
      this.fetchData()
    },
  
    methods: {
      fetchData() {
        this.listLoading = true
  
        request({
          url: `/label/list`,
          method: 'get'
        }).then(res => {
          this.labelsList = res.data
          this.listLoading = false
        }).catch(err => {
          console.log(err)
        })
  
      },
  
      deleteItem(item, index) {
  
        request({
          url: `/label/delete?id=${item.id}`,
          method: 'get'
        }).then(res => {
          this.labelsList.splice(index, 1)
        }).catch(err => {
          console.log(err)
        })
      },
  
      edit(item) {
        this.$router.push({ path: '/edit/editLabel' , query: { 'id': item.id}})
      }
  
    }
  }
</script>

<style>
</style>
