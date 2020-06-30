<template>
  <!-- 订单管理 -->
  <div class="app-container">
    <el-table
    v-loading="listLoading"
    :data="orderList"
    element-loading-text="玩命加载中"
    border fit highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline="" class="demo-table-expand">

            <el-form-item label="订单编号:">
              <span>{{props.row.orderId}}</span>
            </el-form-item>

            <el-form-item label="手机型号：">
              <span>{{ props.row.orderDetail.phone }}</span>
            </el-form-item>

            <el-form-item label="故障列表:">
               <!-- vue中列表循环需加:key="唯一标识" 唯一标识可以是item里面id index等，因为vue组件高度复用增加Key
               可以标识组件的唯一性，为了更好地区别各个组件 key的作用主要是为了高效的更新虚拟DOM -->
               <span class="phone-list-item" v-for="(item,index) in props.row.orderDetail.list" :key="item.id">
                  <br />
                  <span style="display: inline-block; width: 400px">{{ (index+1) +'.'+ item.message }}</span>
                  <span>价格：￥{{ item.price }}</span>
               </span>
            </el-form-item>

            <el-form-item label="维修信息：" v-if="props.row.orderStatus !== '0' && props.row.orderStatus !== '5'">
              <br><span>-. 维修师傅：{{ props.row.orderDetail.repairInfo.workerName }}</span>
              <br><span>-. 联系电话：{{ props.row.orderDetail.repairInfo.workerPhone }}</span>
            </el-form-item>

            <el-form-item  label="用户信息：">
              <br><span>-. 姓名：{{ props.row.orderUsername }}</span>
              <br><span>-. 联系方式：{{ props.row.orderPhone }}</span>
            </el-form-item>

            <el-form-item v-if="props.row.orderStatus === '2' " label="订单评价：">
              <div>
                <br>
                <el-rate
                  v-model="props.row.orderDetail.comment.rate"
                  disabled
                  show-score
                  text-color="#ff9900">
                </el-rate>
                <span>{{ props.row.orderDetail.comment.content }}</span>
              </div>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>

      <el-table-column label="订单金额" align="center">
        <template slot-scope="scope">
          <span>￥{{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderUsername }}</span>
        </template>
      </el-table-column>

      <el-table-column label="下单时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus === '0' ">未完成</span>
          <span v-if="scope.row.orderStatus === '1' ">已安排上门维修</span>
          <span v-if="scope.row.orderStatus === '2' ">已完成</span>
          <span v-if="scope.row.orderStatus === '3' ">申请退款</span>
          <span v-if="scope.row.orderStatus === '4' ">已退款</span>
          <span v-if="scope.row.orderStatus === '5' ">已取消</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteItem(scope.row, scope.$index)">
            <el-button size="mini" slot="reference">删除</el-button>
          </el-popconfirm>
          <el-popconfirm v-if="scope.row.orderStatus === '3'" title="确认退款回给该用户吗？" @onConfirm="confirmRefund(scope.row, scope.$index)">
            <el-button style="margin-top: 8px;" size="mini" slot="reference">同意退款</el-button>
          </el-popconfirm>
          <el-popconfirm v-if="scope.row.orderStatus === '3'" title="确认否决退款吗？" @onConfirm="cancelRefund(scope.row, scope.$index)">
            <el-button style="margin-top: 8px;" size="mini" slot="reference">否决退款</el-button>
          </el-popconfirm>
          <el-button v-if="scope.row.orderStatus === '0'" style="margin-top: 8px;" size="mini" @click="getDoor(scope.row)">分配维修</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 维修师傅Dialog -->
    <el-dialog title="维修师傅列表" :visible.sync="repair_flag">
      <el-table :data="repair_list">
        <el-table-column property="workerName" label="姓名"></el-table-column>
        <el-table-column property="workerCard" label="身份证号"></el-table-column>
        <el-table-column property="workerPhone" label="手机号码"></el-table-column>

        <el-table-column label="操作" width="110" align="center">
          <template slot-scope="scope">
            <el-popconfirm :title="'确定安排' + scope.row.workerName + '进行维修吗?' " @onConfirm="confirmDoor(scope.row, scope.$index)">
              <el-button size="mini" type="primary" slot="reference">安排</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>

    <el-pagination
      style="text-align: center; margin-top: 24px;"
      background
      @current-change="changePage"
      layout="pager"
      :page-size="8"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
import request from '@/utils/request.js'
export default {
  name: 'Order',
  data(){
    return{
      orderList: [], // 订单列表
      repair_flag: false, // 维修师傅列表开关
      repair_list: [], // 维修师傅列表
      door_orderID: {}, // 安排上门维修的临时订单变量

      page: 1,
      total: 0
    }
  },
  created(){
    this.fetchData()
  },
  methods:{
    changePage(e) {
      this.page = e
      this.fetchData()
    },

    // 同意退款
    confirmRefund(item) {
      request({
        url: `/order/update?order_username=${item.orderUsername}&order_amount=${item.orderAmount}&order_detail=${JSON.stringify(item.orderDetail)}&order_id=${item.orderId}&order_status=4&order_phone=${item.orderPhone}&order_remark=${item.orderRemark}`,
        method: 'put'
      }).then(res => {
        let ajaxNumber = parseFloat(item.orderAmount).toFixed(2)

        return request({
           url:'/user/userCharge',
           method: 'post',
           headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
           data: `username=${item.orderUsername}&money=${ajaxNumber}`
        })
      }).then(res => {
        console.log(res, '=> 结果')
        this.fetchData() // 刷新订单列表
      }).catch(err => {
        console.log(err)
      })
    },

    // 取消退款
    cancelRefund(item) {
      request({
        url: `/order/update?order_username=${item.orderUsername}&order_amount=${item.orderAmount}&order_detail=${JSON.stringify(item.orderDetail)}&order_id=${item.orderId}&order_status=2&order_phone=${item.orderPhone}&order_remark=${item.orderRemark}`,
        method: 'put'
      }).then(res => {
        this.fetchData() // 刷新订单列表
      }).catch(err => {
        console.log(err)
      })
    },

    fetchData() {
      this.listLoading = true

      request({
        url: `/order/pageQueryOrders?page=${this.page}`,
        method: 'get'
      }).then(res => {
        this.total = res.data.total

        //JSON.parse() 方法用于将一个 JSON 字符串转换为对象。
        for(let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].orderDetail = JSON.parse(res.data.list[i].orderDetail)
        }

        this.orderList = res.data.list
        this.listLoading = false
      }).catch(err => {
        console.log(err)
      })

    },

    // 分配维修任务
    getDoor(item){
      this.door_orderID = item // 记录订单ID

      request({
        url: `/worker/list`,
        method: 'get'
      }).then(res => {
        this.repair_list = res.data
        this.repair_flag = true
      }).catch(err => {
        console.log(err)
      })
    },

    // 确认安排此师傅上门
    confirmDoor(item, index) {
      //let 声明的变量只在 let 命令所在的代码块 {} 内有效，在 {} 之外不能访问。
      let jsonInfo = {
        workerId: item.workerId,
        workerName: item.workerName,
        workerPhone: item.workerPhone,
        workerCard: item.workerCard,
      }
      this.door_orderID.orderDetail.repairInfo = jsonInfo // 赋值维修师傅信息

      let detailStr = JSON.stringify(this.door_orderID.orderDetail)

      request({
        url: `/order/update?order_username=${this.door_orderID.orderUsername}&order_amount=${this.door_orderID.orderAmount}&order_detail=${detailStr}&order_id=${this.door_orderID.orderId}&order_status=${'1'}&order_phone=${this.door_orderID.orderPhone}&order_remark=${'测试字符'}`,
        method: 'put'
      }).then(res => {
        this.repair_flag = false
        this.$message({
          message: '安排成功',
          type: 'success'
        })
        this.fetchData()
      }).catch(err => {
        console.log(err)
      })

    },

    deleteItem(item, index) {

      request({
        url: `/order/delete?order_id=${item.orderId}`,
        method: 'get'
      }).then(res => {
        this.orderList.splice(index, 1)
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

<style lang="scss" scope>
.el-form--inline .el-form-item {
  width: 100%;
  display: block;
  margin-right: 0px;
  margin-bottom: 0px;
}
</style>
