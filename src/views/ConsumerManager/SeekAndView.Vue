<template>
    <div class="app-container">
        <div class="app-list">
            <div class="app-tab">
                <h5 class="form-tit">Consumer偏移量挑拨</h5>
                <hr>
                <div class="mt20">
                    <el-form :inline="true" size="mini">
                        <el-form-item label="bootstrap.servers">
                            <el-input v-model="bootstrap.servers"
                                      maxlength="100"
                                      :style="{width:text(bootstrap.servers)}"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="group_id">
                            <el-input v-model="group_id"
                                      maxlength="100"
                                      :style="{width:text(group_id)}"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="topic">
                            <el-input v-model="topic"
                                      maxlength="100"
                                      :style="{width:text(topic)}"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="partition">
                            <el-input v-model="partition"
                                      maxlength="100"
                                      :style="{width:text(partition)}"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </el-form>
                </div>

                <div class="mt20">
                    <el-form :inline="true" size="mini">
                        <el-form-item label="timeStart">
                            <el-date-picker
                                    v-model="search.timeStart"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期的start时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="timeEnd">
                            <el-date-picker
                                    v-model="search.timeEnd"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期的end时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="search.level" placeholder="选择level:">
                                <el-option v-for=" item in level" :key="item" :label="item"
                                           :value="item">
                                </el-option>
                            </el-select>
                            <el-button type="primary" class="el-button-search" @click="charts()">柱状图
                            </el-button>
                            <el-button type="primary" class="el-button-search" @click="lineCharts()">折线图
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>Topic-Partition</th>
                        <th>offset</th>
                        <th>startOffset</th>
                        <th>endOffset</th>
                        <th>effectOffset</th>
                        <th>设置偏移量</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>消费的Topic分区</th>
                        <th>消费的offset</th>
                        <th>最早有效的offset</th>
                        <th>最新的offset</th>
                        <th>有效的offset数量</th>
                        <th>设置偏移量</th>
                        <th>操作</th>
                    </tr>

                    <tbody>
                    <template v-for="(value,key,index) in consumerGroupOffsetsAndRealOffset">
                        <tr>
                            <td>{{index+1}}</td>
                            <td>{{key}}</td>
                            <td>{{value.offsetAndMetadata.offset}}</td>
                            <td>{{value.startOffset}}</td>
                            <td>{{value.endOffset}}</td>
                            <td>{{value.endOffset - value.startOffset}}</td>
                            <td>
                                <el-form :inline="true" size="mini">
                                    <el-input v-model="value.seekOffset" placeholder="请输入offset"></el-input>
                                </el-form>
                            </td>
                            <td>
                                <span @click="updatePartitionToOffset(value.topic,value.partition,value.seekOffset)">执行seek</span>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
                <hr>
                <h5 class="form-tit">柱状图</h5>
                <div id="main" style="width: 1600px;height:400px;"></div>
                <hr>
                <h5 class="form-tit">折线图</h5>
                <div id="line" style="width: 1600px;height:400px;"></div>
            </div>
        </div>

    </div>

</template>

<script>
    import {getPreDay} from '@/utils/index.js'

    export default {
        data() {
            return {
                bootstrap: {
                    servers: ''
                },
                group_id: '',
                topic: '',
                partition: '',
                consumerGroupOffsetsAndRealOffset: {
                    "Test-3": {
                        seekOffset: '',
                        "endOffset": 7,
                        "startOffset": 0,
                        "partition": 3,
                        "topic": "Test",
                        "offsetAndMetadata": {
                            "metadata": "",
                            "offset": 3,
                            "leaderEpoch": 0
                        }
                    }
                },
                level: ['YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTES', 'SECONDS', 'MILLISECOND'],
                search: {
                    bootstrap: {servers: '192.168.0.105:9092'},
                    topic: {},
                    partition: 0,
                    timeStart: null,
                    timeEnd: null,
                    level: 'DAY'

                },
            }
        },
        mounted() {
            let self = this;
        },

        computed: {
            text() {
                return function (value) {
                    if (value == '' || value == 0 || value == 1 || typeof(value) == 'number') {
                        return '100%'
                    } else {
                        if (isNaN(value) == true) {
                            return String(value).length * 1 + 'rem'
                        } else {
                            return String(value).length * 2 + 'rem'
                        }
                    }
                }
            }
        }
        ,
        created() {
            let self = this;
            const bootstrap_servers = self.$route.query && self.$route.query.bootstrap_servers;
            const group_id = self.$route.query && self.$route.query.group_id;
            const topic = self.$route.query && self.$route.query.topic;
            const partition = self.$route.query && self.$route.query.partition;
            console.log(self.$route.query)
            self.bootstrap.servers = bootstrap_servers;
            self.search.bootstrap.servers = bootstrap_servers;
            self.group_id = group_id;
            self.topic = topic;
            self.search.topic = topic;
            self.search.partition = partition;
            self.partition = partition;
            this.getConsumerGroupOffsetsAndRealOffsetByTopicAndPartition(bootstrap_servers, group_id, topic, partition);
        }
        ,
        watch: {}
        ,
        methods: {

            getConsumerGroupOffsetsAndRealOffsetByTopicAndPartition(bootstrap_servers, group_id, topic, partition) {
                let self = this;
                self.$http.get(self.api.getConsumerGroupOffsetsAndRealOffsetByTopicAndPartition, {
                    params: {
                        'bootstrap.servers': bootstrap_servers,
                        'group': group_id,
                        'topic': topic,
                        'partition': partition
                    }
                }, function (response) {

                    if (response.code == 0) {
                        self.consumerGroupOffsetsAndRealOffset = response.content;
                        self.$message({
                            type: 'success',
                            message: '查询成功',
                            duration: 1000
                        });
                    } else {
                        self.$message({
                            type: 'error',
                            message: response.msg,
                            duration: 2000
                        });
                    }
                }, function (response) {
                    //失败回调
                    self.$message({
                        type: 'warning',
                        message: '请求异常',
                        duration: 1000
                    });
                })

            }
            ,
            /**
             *设置偏移量
             */
            updatePartitionToOffset(topic, partition, seekOffset) {
                let self = this;
                self.$http.get(self.api.updatePartitionToOffset, {
                    params: {
                        'bootstrap.servers': self.bootstrap.servers,
                        'group.id': self.group_id,
                        'topic': topic,
                        'partition': partition,
                        'seekOffset': seekOffset
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.$message({
                            type: 'success',
                            message: 'seek成功',
                            duration: 2000
                        });
                        self.getConsumerGroupOffsetsAndRealOffsetByTopicAndPartition(self.bootstrap.servers, self.group_id, topic, partition);
                    } else {
                        self.$message({
                            type: 'error',
                            message: response.msg,
                            duration: 2000
                        });
                    }
                }, function (response) {
                    //失败回调
                    self.$message({
                        type: 'warning',
                        message: '请求异常',
                        duration: 1000
                    });
                });
                self.getConsumerGroupOffsetsAndRealOffset(self.bootstrap.servers, self.group_id);
            },
            charts() {
                let self = this;
                self.$http.get(self.api.getRecordSimpleEChartsByTopicPartitionOffset, {
                    params: {
                        'bootstrap.servers': self.search.bootstrap.servers,
                        'topic': self.search.topic,
                        'partition': self.search.partition,
                        'timeStart': self.search.timeStart,
                        'timeEnd': self.search.timeEnd,
                        'level': self.search.level,
                    }
                }, function (response) {

                    if (response.code == 0) {
                        var echarts = require('echarts');
                        // 基于准备好的dom，初始化echarts实例
                        var myChart = echarts.init(document.getElementById('main'));
                        // 绘制图表
                        myChart.setOption(response.content);
                        self.$message({
                            type: 'success',
                            message: '查询成功',
                            duration: 1000
                        });
                    } else {
                        self.$message({
                            type: 'error',
                            message: response.msg,
                            duration: 2000
                        });
                    }
                }, function (response) {
                    //失败回调
                    self.$message({
                        type: 'warning',
                        message: '请求异常',
                        duration: 1000
                    });
                })

            },
            /**
             * 折线图
             */
            lineCharts() {
                let self = this;
                self.$http.get(self.api.getRecordLineEChartsByTopicPartitionOffset, {
                    params: {
                        'bootstrap.servers': self.search.bootstrap.servers,
                        'topic': self.search.topic,
                        'partition': self.search.partition,
                        'timeStart': self.search.timeStart,
                        'timeEnd': self.search.timeEnd,
                        'level': self.search.level,
                    }
                }, function (response) {

                    if (response.code == 0) {
                        var echarts = require('echarts');
                        // 基于准备好的dom，初始化echarts实例
                        var myChart = echarts.init(document.getElementById('line'));
                        // 绘制图表
                        myChart.setOption(response.content);
                        self.$message({
                            type: 'success',
                            message: '查询成功',
                            duration: 1000
                        });
                    } else {
                        self.$message({
                            type: 'error',
                            message: response.msg,
                            duration: 2000
                        });
                    }
                }, function (response) {
                    //失败回调
                    self.$message({
                        type: 'warning',
                        message: '请求异常',
                        duration: 1000
                    });
                })

            }
        }

    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .video-detail {

        p {
            display: inline-block;
            width: 40%;
            vertical-align: top;
        }

        label {
            width: 120px;
            display: inline-block;
        }

        span {
            color: #888;
        }

    }
</style>
