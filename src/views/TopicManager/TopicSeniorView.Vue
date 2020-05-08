<template>
    <div class="app-container">
        <div class="app-list">
            <div class="app-tab">
                <h5 class="form-tit">Topic(包含所有的Partition)高级查看（可以过滤，可以查看内容，注意消耗性能，是逐条过滤）</h5>
                <hr>
                <div class="mt20">
                    <el-form :inline="true" size="mini">
                        <el-form-item label="bootstrap.servers">
                            <el-input v-model="bootstrap.servers"
                                      maxlength="100"
                                      :style="{width:text(bootstrap.servers)}"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="topic">
                            <el-input v-model="topic"
                                      maxlength="100"
                                      :style="{width:text(topic)}"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </el-form>
                    <table>
                        <thead>
                        <tr>
                            <th>id</th>
                            <th>Topic</th>
                            <th>partitions</th>
                            <th>sum</th>
                            <th>total</th>
                        </tr>
                        </thead>
                        <tr>
                            <th>序号</th>
                            <th>消费的Topic</th>
                            <th>分区数量</th>
                            <th>有效offset</th>
                            <th>total</th>
                        </tr>

                        <tbody>
                        <template v-if="topicEffectOffset.topic">
                            <tr>
                                <td>1</td>
                                <td>{{topicEffectOffset.topic}}</td>
                                <td>{{topicEffectOffset.partitions}}</td>
                                <td>{{topicEffectOffset.sum}}</td>
                                <td>{{topicEffectOffset.total}}</td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                    <el-form :inline="true" size="mini">
                        <br>
                        <el-form-item label="keyRegex">
                            <el-input v-model="search.keyRegex" placeholder="请输入key的正则"></el-input>
                        </el-form-item>
                        <el-form-item label="valueRegex">
                            <el-input v-model="search.valueRegex" placeholder="请输入value的正则"></el-input>
                        </el-form-item>
                        <br>
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
                            <el-button type="primary" class="el-button-search" @click="searchEvent()">查询</el-button>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" size="mini">
                        <el-form-item>
                            <el-form-item label="quickNumber">
                                <el-input v-model="search.quickNumber" placeholder="请输入数量"></el-input>
                            </el-form-item>
                            <el-button type="primary" class="el-button-search" @click="searchEvent()">按照最新数量查询
                            </el-button>
                            <br>
                            <el-form-item label="quickTime">
                                <el-input v-model="search.quickTime" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-select v-model="search.quickTimeLevel" placeholder="选择level:">
                                <el-option v-for=" item in quickTimeLevel" :key="item" :label="item"
                                           :value="item">
                                </el-option>
                            </el-select>
                            <el-button type="primary" class="el-button-search" @click="searchEvent()">按照最新时间查询
                            </el-button>
                            <hr>
                            <el-select v-model="search.level" placeholder="选择level:">
                                <el-option v-for=" item in level" :key="item" :label="item"
                                           :value="item">
                                </el-option>
                            </el-select>
                            <el-button type="primary" class="el-button-search" @click="charts()">柱状图
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>offset</th>
                        <th>topic</th>
                        <th>partition</th>
                        <th>key</th>
                        <th>value</th>
                        <th>timestampType</th>
                        <th>timestamp</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>msg偏移量</th>
                        <th>msg所在的topic</th>
                        <th>msg所在的partition</th>
                        <th>key</th>
                        <th>value</th>
                        <th>msg的时间type</th>
                        <th>msg的时间(创建/接收)</th>
                        <th>操作</th>
                    </tr>
                    <tbody>

                    <template v-if="consumerRecords">
                        <tr v-for="(info,index) in consumerRecords">
                            <td>{{index+1}}</td>
                            <td>{{info.offset}}</td>
                            <td>{{info.topic}}</td>
                            <td>{{info.partition}}</td>
                            <td>
                                <template v-if="info.key">
                                    <template>
                                        {{info.key.substr(0, 30)}}
                                    </template>
                                    <template v-if="info.key.length > 30">
                                        ...
                                    </template>
                                </template>
                            </td>
                            <td>
                                <template v-if="info.value">
                                    <template>
                                        {{info.value.substr(0, 30)}}
                                    </template>
                                    <template v-if="info.value.length > 30">
                                        ...
                                    </template>
                                </template>
                            </td>
                            <td>{{info.timestampType}}</td>
                            <td>{{info.timestamp}}</td>
                            <td>
                                <span @click="showValue(info.key,info.value)">展示全部</span>
                                <span @click="sendToSelf(bootstrap.servers,info.topic,info.partition,info.key,info.value)">转发到自己</span>
                                <span @click="routerProducerManagerSendSync(bootstrap.servers,info.key,info.value)">转发到其他</span>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
            <div class="mt20">
                <!--/** */:page-size 数一页的数量！！！-->
                <el-pagination v-show="pageInfo.list.length > 0"
                               background
                               @current-change="handleCurrentChange"
                               :current-page.sync="pageInfo.pageNum"
                               :page-size="pageInfo.pageSize"
                               layout="total, prev, pager, next, jumper"
                               :total="pageInfo.total">
                </el-pagination>
            </div>
            <hr>
            <h5 class="form-tit">柱状图</h5>
            <div id="main" style="width: 1400px;height:400px;"></div>
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
                topic: '',
                partition: '',
                partitionEffectOffset: {
                    earliestOffset: 59556,
                    lastOffset: 68870,
                    partition: 0,
                    topic: null
                },
                topicEffectOffset: {
                    topic: null,
                    partitions: 0,
                    sum: 0,
                    total: 0
                },
                level: ['YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTES', 'SECONDS'],
                quickTimeLevel: ['YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTES', 'SECONDS'],
                search: {
                    bootstrap: {servers: '192.168.0.105:9092'},
                    topic: {},
                    partition: 0,
                    startOffset: 0,
                    endOffset: 0,
                    keyRegex: null,
                    valueRegex: null,
                    timeStart: null,
                    timeEnd: null,
                    level: 'DAY',
                    quickNumber: null,
                    quickTime: null,
                    quickTimeLevel: 'MINUTES'

                },
                consumerRecords: [{
                    "partition": 1,
                    "serializedKeySize": 3,
                    "offset": 0,
                    "leaderEpoch": {
                        "value": 0
                    },
                    "topic": "Test",
                    "timestampType": "CREATE_TIME",
                    "serializedValueSize": 5,
                    "value": "value",
                    "key": "key",
                    "timestamp": 15865981004791
                }
                ],
                pageInfo: {
                    "endRow": 10,
                    "firstPage": 1,
                    "hasNextPage": true,
                    "hasPreviousPage": false,
                    "isFirstPage": true,
                    "isLastPage": false,
                    "lastPage": 8,
                    "list": [],
                    "navigatePages": 8,
                    "navigatepageNums": [1, 2, 3, 4, 5, 6, 7, 8],
                    "nextPage": 2,
                    "orderBy": "18ff48aa-258e-40ef-b555-0843dfad462c",
                    "pageNum": 1,
                    "pageSize": 10,
                    "pages": 1810,
                    "prePage": 0,
                    "size": 10,
                    "startRow": 1,
                    "total": 18100
                }
            }
        },
        mounted() {
            let self = this;
        },

        computed: {
            text() {

                return function (value) {
                    if (value == '' || value == 0 || value == 1 || typeof (value) == 'number') {
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
            const topic = self.$route.query && self.$route.query.topic;
            const partition = self.$route.query && self.$route.query.partition;
            console.log(self.$route.query)
            self.topic = topic;
            self.bootstrap.servers = bootstrap_servers;
            self.search.bootstrap.servers = bootstrap_servers;
            self.search.topic = topic;
            self.search.partition = partition;
            self.partitionEffectOffset = {};
            self.consumerRecords = [];
            this.getTopicEffectOffset(bootstrap_servers, topic, partition);
        }
        ,
        watch: {}
        ,
        methods: {
            getTopicEffectOffset(bootstrap_servers, topic) {
                let self = this;
                self.$http.get(self.api.getTopicEffectOffset, {
                    params: {
                        'bootstrap.servers': bootstrap_servers,
                        'topic': topic
                    }
                }, function (response) {

                    if (response.code == 0) {
                        self.topicEffectOffset = response.content;
                        self.$message({
                            type: 'success',
                            message: '查询成功',
                            duration: 2000
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
            searchEvent() {
                this.getRecordByTopic();
            },
            /**
             * 获取指定的 record
             */
            getRecordByTopic() {
                let self = this;
                self.consumerRecords = [];
                self.$http.get(self.api.getRecordByTopic, {
                    params: {
                        'bootstrap.servers': self.search.bootstrap.servers,
                        'topic': self.search.topic,
                        'startOffset': self.search.startOffset,
                        'endOffset': self.search.endOffset,
                        'keyRegex': self.search.keyRegex,
                        'valueRegex': self.search.valueRegex,
                        'timeStart': self.search.timeStart,
                        'timeEnd': self.search.timeEnd,
                        'quickNumber': self.search.quickNumber,
                        'quickTime': self.search.quickTime,
                        'quickTimeLevel': self.search.quickTimeLevel
                    }
                }, function (response) {

                    if (response.code == 0) {
                        self.pageInfo = response.content;
                        response.content.list.forEach(record => {
                            record.timestamp = self.dateFormat("YYYY-mm-dd HH:MM:SS.s", new Date(record.timestamp))
                            self.consumerRecords.push(record);
                        });
                        self.$message({
                            type: 'success',
                            message: '查询成功',
                            duration: 2000
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
            charts() {
                let self = this;
                self.$http.get(self.api.getRecordEChartsByTopic, {
                    params: {
                        'bootstrap.servers': self.search.bootstrap.servers,
                        'topic': self.search.topic,
                        'keyRegex': self.search.keyRegex,
                        'valueRegex': self.search.valueRegex,
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
                            duration: 2000
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
            dateFormat(fmt, date) {
                let ret;
                const opt = {
                    "Y+": date.getFullYear().toString(),        // 年
                    "m+": (date.getMonth() + 1).toString(),     // 月
                    "d+": date.getDate().toString(),            // 日
                    "H+": date.getHours().toString(),           // 时
                    "M+": date.getMinutes().toString(),         // 分
                    "S+": date.getSeconds().toString(),         // 秒
                    "s+": this.dealMilliseconds(date.getMilliseconds().toString())          // 毫秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                };
                for (let k in opt) {
                    ret = new RegExp("(" + k + ")").exec(fmt);
                    if (ret) {
                        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                    }
                    ;
                }
                ;
                return fmt;
            },
            /**
             * 补全长度
             * @param milliseconds
             * @returns {*}
             */
            dealMilliseconds(milliseconds) {
                if (milliseconds.length == 1) {
                    return milliseconds + '00';
                } else if (milliseconds.length == 2) {
                    return milliseconds + '0';
                } else {
                    return milliseconds;
                }


            },
            showValue(key, value) {
                this.$confirm(value, key, {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    center: true
                }).then(() => {


                })
            },
            routerProducerManagerSendSync(bootstrap_servers, key, value) {
                let self = this;
                self.$router.push({
                    name: 'ProducerManagerSendSync',
                    query: {
                        bootstrap_servers: bootstrap_servers
                    },
                    params: {
                        bootstrap_servers: bootstrap_servers,
                        key: key,
                        value: value,
                    }
                })
            },
            /**
             * 发送到自身
             */
            sendToSelf(bootstrap_servers, topic, partition, key, value) {
                let self = this;
                var params = new FormData();
                params.append('bootstrap.servers', bootstrap_servers);
                params.append('topic', topic);
                params.append('partition', partition);
                params.append('key', key);
                params.append('value', value);

                var sourceParamsJson = {};
                params.forEach((value, key) => sourceParamsJson[key] = value);

                var ParamsJson = {};
                ParamsJson[params] = sourceParamsJson;

                self.$http.post(self.api.sendSync, params,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }, function (response) {
                        if (response.code == 0) {
                            console.log(response)
                            self.$message({
                                type: 'success',
                                message: '转发成功',
                                duration: 500
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
            handleCurrentChange(currentChange) {
                let self = this;
                self.consumerRecords = [];
                self.$http.get(self.api.getRecordByScrollId, {
                    params: {
                        'scrollId': self.pageInfo.orderBy,
                        'pageNum': currentChange,
                        'pageSize': self.pageInfo.pageSize,
                    }
                }, function (response) {

                    if (response.code == 0) {
                        self.pageInfo = response.content;
                        response.content.list.forEach(record => {
                            record.timestamp = self.dateFormat("YYYY-mm-dd HH:MM:SS.s", new Date(record.timestamp))
                            self.consumerRecords.push(record);
                        });
                        self.$message({
                            type: 'success',
                            message: '查询成功',
                            duration: 2000
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
