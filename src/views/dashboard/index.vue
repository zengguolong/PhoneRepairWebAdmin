<template>
  <div class="dashboard-container">
    <div style="display: flex; justify-content: space-between;">
      <div style="width: 58%;">
        <div class="number-wrapper">
          <div class="number-box" style="background-color: #79ace9;">
            <ICountUp
              :delay="2000"
              :endVal="orderTotal"
              :options="ProductOptions"
            />
            <div class="number-font">总订单量</div>
          </div>

          <div class="number-box" style="background-color: #e3858a;">
            <ICountUp
              :delay="2000"
              :endVal="orderAmount"
              :options="ProductOptions"
            />
            <div class="number-font">总销售总额</div>
          </div>
        </div>

        <div class="line-wrapper">
          <div class="canvas-title">APP销售统计</div>
          <div id="lineChart" ref="lineChart"></div>
        </div>

      </div>

      <div class="pie-wrapper">
        <div class="canvas-title">各类手机订单情况</div>
        <div id="pieChart" ref="pieChart"></div>
      </div>


    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/request'

import ICountUp from 'vue-countup-v2';
import echarts from "@/libs/echarts"; //这个引入是自定义引入(在src/libs下的js文件)

export default {
  name: 'Dashboard',
  components: {
    ICountUp
  },
  data() {
    return {
      orderTotal: 0,
      orderAmount: 0,
      ProductOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: '',
      },
    }
  },

  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.initData()
    this.drawLineChart()
    this.drawPieChart()
  },
  methods: {
    initData() {
      request({
        url: `/business/queryAllBusiness`,
        method: 'post'
      }).then(res => {
        this.orderTotal = res.data.orderTotal
        this.orderAmount = res.data.orderAmount
      }).catch(err => {
        console.log(err)
      })
    },

    drawLineChart() {
      this.lineChart = echarts.init(this.$refs.lineChart);
      this.lineChart.setOption({
        color: ["#0f5cff", "#f6b9b3"],
        legend: {
          data: ["订单量", "销售金额"],
          top: 0,
          itemGap: 18
        },

        grid: {
          left: '5%',
          right: '4%',
          bottom: '2%',
          top: '10%',
          containLabel: true
        },

        tooltip: {
          trigger: "axis",
          axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
          }
        },

        // X轴
        xAxis: {
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周天"],
          boundaryGap: false,
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            textStyle: { color: '#777', fontSize: '12' },
          }

        },

        // Y轴
        yAxis: {
          type: "value",
          boundaryGap: ['0%', '5%'],
          axisLabel: {
            textStyle: { color: '#777', fontSize: '12' },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#ddd",
              type: "solid",
              width: 2
            }
          },
          axisTick: { show: false },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ddd",
              type: "solid",
              width: 2
            }
          }
        },

        series: [
          {
            name: "订单量",
            type: "line",
            // Y 轴数据
            data: [120, 100, 440, 320, 210, 240, 200],
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#f7faff" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#fff" // 100% 处的颜色
                  }
                ])
              }
            }
          },

          {
            name: "销售金额",
            type: "line",
            data: [200, 120, 240, 330, 410, 152, 200],
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#f6b9b3"
                  },
                  {
                    offset: 1,
                    color: "#fff"
                  }
                ])
              }
            }
          }
        ]
      });
    },

    drawPieChart() {
      this.pieChart = echarts.init(this.$refs.pieChart);
      this.pieChart.setOption({
        color: ['#79ace9', '#e3858a', '#7ce0c2', '#9193f0'],
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/>{a} : {c} ({d}%)"
        },
        legend: {
          center: '50%',
          bottom: '10%',

          itemGap: 14,
          icon: 'circle',
          type: 'scroll',
          data: ['苹果', 'OPPOP', '华为', 'Vivo', '魅族', '小米', '坚果', '三星']
        },
        series: [
          {
            name: "订单量",
            type: "pie",
            radius: "70%",
            center: ["50%", "40%"],
            data: [
              { value: 335, name: "苹果" },
              { value: 310, name: "OPPOP" },
              { value: 234, name: "华为" },
              { value: 123, name: "Vivo" },
              { value: 456, name: "魅族" },
              { value: 121, name: "小米" },
              { value: 89, name: "坚果" },
              { value: 200, name: "三星" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    }
  }
}
</script>

<style lang="scss" scoped>

.canvas-title {
  padding: 14px 30px;
  font-size: 20px;
  border-left: 8px solid rgb(121, 172, 233);;
  margin-left: 20px;
  padding: 0px 12px;
  margin-top: 20px;
  margin-bottom: 14px;
}

.line-wrapper {
  margin-top: 24px;
  width: 100%;
  height: 63vh;
  box-shadow: 1px 1px 20px #ccc;
  display: inline-block;
  // 折线图
  #lineChart {
    width: 100%;
    height: 80%;
  }
}

.pie-wrapper {
  width: 40%;
  height: 80vh;
  box-shadow: 1px 1px 20px #ccc;
  #pieChart {
    width: 100%;
    height: 100%;
  }
}



// #lineChart::before {
//   content: 'APP销售统计';
//   display: block;
//   padding: 14px 30px;
//   font-size: 20px;
//   border-left: 8px solid rgb(121, 172, 233);;
//   margin-left: 20px;
//   padding: 0px 12px;
//   margin-top: 20px;
//   margin-bottom: 14px;
// }

// #pieChart::before {
//   content: '各类手机订单情况';
//   display: block;
//   padding: 14px 30px;
//   font-size: 20px;
//   border-left: 8px solid rgb(121, 172, 233);;
//   margin-left: 20px;
//   padding: 0px 12px;
//   margin-top: 20px;
//   margin-bottom: 14px;
// }


.dashboard-container {
  padding: 16px;
  .number-wrapper {
    display: flex;
    justify-content: space-between;
    .number-box {
      width: 49%;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 24px;
      color: #fff;
      font-weight: 700;
      border-radius: 8px;
      padding: 14px 0px;
      > span {
        font-size: 30px;
        font-weight: 700;
      }
      > .number-font {
        margin: 10px 0px;
      }
    }
  }
}
</style>
