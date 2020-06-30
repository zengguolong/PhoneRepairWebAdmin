<template>
  <!-- 维修师傅管理 -->
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="personList"
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

      <el-table-column align="center" label="维修师傅" width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.workerName }}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证">
        <template slot-scope="scope">
          <div>{{ scope.row.workerCard }}</div>
        </template>
      </el-table-column>

      <el-table-column label="联系方式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.workerPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="评分" align="center">
        <template slot-scope="scope">
          <div v-if="!scope.row.comment">暂无评分</div>
          <el-rate
            v-else
            v-model="JSON.parse(scope.row.comment).rate"
            disabled
            show-score
            text-color="#ff9900">
          </el-rate>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteItem(scope.row, scope.$index)">
            <el-button size="mini" slot="reference">删除</el-button>
          </el-popconfirm>

          <el-button size="mini" @click="showComment(scope.row, scope.$index)">查看评论</el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 维修师傅评论详情框 -->
    <el-dialog title="维修师傅评论" :visible.sync="repair_flag">
      <div style="margin-bottom: 8px;">- 名称：{{ detailInfo.workerName }}</div>
      <div style="margin-bottom: 8px;">- 手机号：{{ detailInfo.workerPhone }}</div>
      <div style="margin-bottom: 8px; display: flex;">- 总评分：
        <el-rate
        v-model="detailInfo.comment.rate"
        disabled
        show-score
        text-color="#ff9900">
        </el-rate>
      </div>

      <el-table :data="detailInfo.comment.list">

        <el-table-column label="评分" align="center">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.rate"
              disabled
              show-score
              text-color="#ff9900">
            </el-rate>
          </template>
        </el-table-column>

        <el-table-column property="content" align="center" label="评价"></el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'repairPerson', // 维修人员
  data() {
    return {
      personList: [],
      repair_flag: false,
      detailInfo: {
        workerName: '',
        workerPhone: '',
        comment: {
          rate: 0,
          list: []
        }
      }
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    // 展示评论
    showComment(item, index) {
      this.repair_flag = true
      this.personList[index].comment = JSON.parse(item.comment)
      this.detailInfo = this.personList[index]
    },

    fetchData() {
      this.listLoading = true

      request({
        url: `/worker/list`,
        method: 'get'
      }).then(res => {
        this.personList = res.data
        this.listLoading = false
      }).catch(err => {
        console.log(err)
      })

    },

    deleteItem(item, index) {

      request({
        url: `/worker/delete?worker_id=${item.workerId}`,
        method: 'get'
      }).then(res => {
        console.log(res.data)
        this.personList.splice(index, 1)//删除当前list中索引为index的元素，并把当前list返回
          //splice方法第一个参数 要删除的元素的索引从这个元素开始，第二个参数是要删除几个元素
        console.log(this.personList)
      }).catch(err => {
        console.log(err)
      })
    },

    edit(item) {
      this.$router.push({ path: '/edit/editRepair' , query: { 'id': item.workerId}})
    }

  }
}
</script>
