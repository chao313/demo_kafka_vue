<template>
    <div class="app-container">
        <div class="app-list">
            <div class="app-tab">
                <h5 class="form-tit">TopicPartition基础信息</h5>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>topic</th>
                        <th>partition</th>
                        <th>earliestOffset</th>
                        <th>lastOffset</th>
                        <th>sum</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>topic</th>
                        <th>分区</th>
                        <th>最早有效的offset</th>
                        <th>最新的offset</th>
                        <th>有效的记录数量</th>
                    </tr>

                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>{{topicPartitionAndRealOffsetDetail.topic}}</td>
                        <td>{{topicPartitionAndRealOffsetDetail.partition}}</td>
                        <td>{{topicPartitionAndRealOffsetDetail.earliestOffset}}</td>
                        <td>{{topicPartitionAndRealOffsetDetail.lastOffset}}</td>
                        <td>{{topicPartitionAndRealOffsetDetail.sum}}</td>
                    </tr>
                    </tbody>
                </table>
                <hr>
                <h5 class="form-tit">第一条有效offset</h5>
                <table>
                    <thead>
                    <tr>
                        <th>offset</th>
                        <th>topic</th>
                        <th>partition</th>
                        <th>key</th>
                        <th>value</th>
                        <th>timestampType</th>
                        <th>timestamp</th>
                        <th>leaderEpoch.value</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>msg偏移量</th>
                        <th>msg所在的topic</th>
                        <th>msg所在的partition</th>
                        <th>key</th>
                        <th>value</th>
                        <th>msg的时间type</th>
                        <th>msg的时间(创建/接收)</th>
                        <th>水位</th>
                    </tr>

                    <tbody>
                    <template v-if="topicPartitionAndRealOffsetDetail.earliestConsumerRecord">
                        <tr>
                            <td>{{topicPartitionAndRealOffsetDetail.earliestConsumerRecord.offset}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.earliestConsumerRecord.topic}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.earliestConsumerRecord.partition}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.earliestConsumerRecord.key}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.earliestConsumerRecord.value}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.earliestConsumerRecord.timestampType}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.earliestConsumerRecord.timestamp}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.earliestConsumerRecord.leaderEpoch.value}}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
                <hr>
                <h5 class="form-tit">最新的offset</h5>
                <table>
                    <thead>
                    <tr>
                        <th>offset</th>
                        <th>topic</th>
                        <th>partition</th>
                        <th>key</th>
                        <th>value</th>
                        <th>timestampType</th>
                        <th>timestamp</th>
                        <th>leaderEpoch.value</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>msg偏移量</th>
                        <th>msg所在的topic</th>
                        <th>msg所在的partition</th>
                        <th>key</th>
                        <th>value</th>
                        <th>msg的时间type</th>
                        <th>msg的时间(创建/接收)</th>
                        <th>水位</th>
                    </tr>

                    <tbody>
                    <template v-if="topicPartitionAndRealOffsetDetail.lastConsumerRecord">
                        <tr>
                            <td>{{topicPartitionAndRealOffsetDetail.lastConsumerRecord.offset}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.lastConsumerRecord.topic}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.lastConsumerRecord.partition}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.lastConsumerRecord.key}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.lastConsumerRecord.value}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.lastConsumerRecord.timestampType}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.lastConsumerRecord.timestamp}}</td>
                            <td>{{topicPartitionAndRealOffsetDetail.lastConsumerRecord.leaderEpoch.value}}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
                <hr>
                <h5 class="form-tit">最新的10条offset</h5>
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
                        <th>leaderEpoch.value</th>
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
                        <th>水位</th>
                    </tr>
                    <tbody>
                    <template v-if="topicPartitionAndRealOffsetDetail.lastTenConsumerRecords">
                        <tr v-for="(info,index) in topicPartitionAndRealOffsetDetail.lastTenConsumerRecords">
                            <td>{{index+1}}</td>
                            <td>{{info.offset}}</td>
                            <td>{{info.topic}}</td>
                            <td>{{info.partition}}</td>
                            <td>{{info.key}}</td>
                            <td>{{info.value}}</td>
                            <td>{{info.timestampType}}</td>
                            <td>{{info.timestamp}}</td>
                            <td>{{info.leaderEpoch.value}}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
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
                    servers: '192.168.0.105:9092'
                },
                topicPartitionAndRealOffsetDetail: {
                    partition: 1,
                    earliestOffset: 0,
                    topic: "xxxxx",
                    lastOffset: 400,
                    sum: 400,
                    lastConsumerRecord: {
                        "offset": 399,
                        "topic": "Test",
                        "partition": 1,
                        "serializedKeySize": 3,
                        "serializedValueSize": 7,
                        "key": "key",
                        "value": "value11",
                        "timestampType": "CREATE_TIME",
                        "timestamp": 1586700464576,
                        "leaderEpoch": {
                            "value": 0
                        }
                    },
                    earliestConsumerRecord: {
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
                        "timestamp": 1586598100479
                    },
                    lastTenConsumerRecords: [{
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
                        "timestamp": 1586598100479
                    }
                    ]
                },
                level: ['YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTES', 'SECONDS', 'MILLISECOND'],
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
                    level: 'DAY'

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
                ]
            }
        },
        mounted() {
            let self = this;
        }
        ,
        created() {
            let self = this;
            self.consumerRecords = [];
            self.topicPartitionAndRealOffsetDetail = [];
            const bootstrap_servers = self.$route.query && self.$route.query.bootstrap_servers;
            const topic = self.$route.query && self.$route.query.topic;
            const partition = self.$route.query && self.$route.query.partition;
            self.search.bootstrap.servers = bootstrap_servers;
            self.search.topic = topic;
            self.search.partition = partition;
            this.getTopicPartitionAndRealOffsetDetail(bootstrap_servers, topic, partition);

        }
        ,
        watch: {}
        ,
        methods: {
            getTopicPartitionAndRealOffsetDetail(bootstrap_servers, topic, partition) {
                let self = this;
                self.$http.get(self.api.getTopicPartitionAndRealOffsetDetail, {
                    params: {
                        'bootstrap.servers': bootstrap_servers,
                        'topic': topic,
                        'partition': partition,
                    }
                }, function (response) {

                    if (response.code == 0) {
                        self.topicPartitionAndRealOffsetDetail = response.content;

                        response.content.lastTenConsumerRecords.forEach(record => {
                            record.timestamp = self.dateFormat("YYYY-mm-dd HH:MM:SS.s", new Date(record.timestamp))
                        });
                        /**
                         * 最早的
                         */
                        if (response.content.earliestConsumerRecord) {
                            response.content.earliestConsumerRecord.timestamp = self.dateFormat("YYYY-mm-dd HH:MM:SS.s", new Date(response.content.earliestConsumerRecord.timestamp));
                            self.search.startOffset = response.content.earliestConsumerRecord.offset;
                        }
                        /**
                         * 最新的
                         */
                        if (response.content.lastConsumerRecord) {
                            response.content.lastConsumerRecord.timestamp = self.dateFormat("YYYY-mm-dd HH:MM:SS.s", new Date(response.content.lastConsumerRecord.timestamp));
                            self.search.endOffset = response.content.lastConsumerRecord.offset;
                        }
                        /**
                         * 为了查询
                         */


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
            /**
             * 获取指定的 record
             */
            getRecordByTopicPartitionOffset() {
                let self = this;
                self.consumerRecords = [];
                self.$http.get(self.api.getRecordByTopicPartitionOffset, {
                    params: {
                        'bootstrap.servers': self.search.bootstrap.servers,
                        'topic': self.search.topic,
                        'partition': self.search.partition,
                        'startOffset': self.search.startOffset,
                        'endOffset': self.search.endOffset,
                        'keyRegex': self.search.keyRegex,
                        'valueRegex': self.search.valueRegex,
                        'timeStart': self.search.timeStart,
                        'timeEnd': self.search.timeEnd
                    }
                }, function (response) {

                    if (response.code == 0) {
                        response.content.forEach(record => {
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
            routerToView(id) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "id=" + id + "";
                window.open("#/TBlogModuleView" + "?" + queryStr, '_self');
            }
            ,
            routerToEdit(id) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "id=" + id + "";
                //跳转携带参数
                window.open("#/TBlogModuleEdit" + "?" + queryStr, '_self');
            }
            ,
            routerToAdd() {
                window.open("#/TBlogModuleAdd", '_self');
            }
            ,
            searchEvent() {
                this.getRecordByTopicPartitionOffset();
            }
            ,
            searchRest() {
                let self = this;
                self.search.id = '';
                self.search.title = '';
                self.search.img = '';
                self.search.time = '';
                self.search.type = '';
                self.search.lookSum = '';
                self.search.content = '';
                this.queryBase();
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
            charts() {
                let self = this;
                self.$http.get(self.api.getRecordEChartsByTopicPartitionOffset, {
                    params: {
                        'bootstrap.servers': self.search.bootstrap.servers,
                        'topic': self.search.topic,
                        'partition': self.search.partition,
                        'startOffset': self.search.startOffset,
                        'endOffset': self.search.endOffset,
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
