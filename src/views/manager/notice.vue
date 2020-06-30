<template>
  <div class="app-container">

    <el-table
      v-loading="listLoading"
      :data="noticeList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="公告栏图片" width="100">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 50px" :src="scope.row.noticeImage" fit="cover">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column label="公告栏名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.notice }}</span>
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
  name: 'Notice', // 公告栏
  data() {
    return {
      noticeList: []
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.listLoading = true

      request({
        url: `/notice/list`,
        method: 'get'
      }).then(res => {
        this.noticeList = res.data
        this.listLoading = false
      }).catch(err => {
        console.log(err)
      })

    },

    deleteItem(item, index) {
      request({
        url: `/notice/delete?id=${item.id}`,
        method: 'get'
      }).then(res => {
        this.noticeList.splice(index, 1)
      }).catch(err => {
        console.log(err)
      })
    },

    edit(item) {
      this.$router.push({ path: '/edit/editNotice' , query: { 'id': item.id}})
    }

  }
}
</script>

<style>
</style>
