<template>
  <!-- 用户管理 -->
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="userList"
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

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="钱包金额">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="地址">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户密码">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <!-- <el-button style="margin-bottom: 8px;" size="mini" @click="edit(scope.row)">编辑</el-button> -->
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
    name: 'Users', // 标签
    data() {
      return {
        userList: []
      }
    },
    created() {
      this.fetchData()
    },

    methods: {
      fetchData() {
        this.listLoading = true

        request({
          url: `/admin/get`,
          method: 'get'
        }).then(res => {
          this.userList = res.data
          this.listLoading = false
        }).catch(err => {
          console.log(err)
        })

      },

      deleteItem(item, index) {
        request({
          url: `/admin/deleteUser?userId=${item.userId}`,
          method: 'get'
        }).then(res => {
          this.userList.splice(index, 1)
        }).catch(err => {
          console.log(err)
        })
      },

      // edit(item) {
      //   this.$router.push({ path: '/form/notice' , query: { 'id': item.id}})
      // }

    }
  }
</script>
