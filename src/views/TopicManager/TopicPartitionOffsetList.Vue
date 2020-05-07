<template>
    <div class="app-container">
        <div class="mt10">
            <el-form :inline="true" size="mini">
                <el-form-item label="bootstrap.servers">
                    <el-select v-model="bootstrap.servers" placeholder="请输入kafka地址:">
                        <el-option v-for="(item,index) in bootstrap_servers" :key="item" :label="index"
                                   :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="topicContain">
                    <el-input v-model="topicContain" placeholder="请输入topicContain"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="el-button-search" @click="searchEvent()">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="app-list">
            <div class="app-tab">
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>topic</th>
                        <th>partition</th>
                        <th>earliestOffset</th>
                        <th>lastOffset</th>
                        <th>sum</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>topic</th>
                        <th>分区</th>
                        <th>最早有效的offset</th>
                        <th>最新的offset</th>
                        <th>有效的记录数量</th>
                        <th>操作</th>
                    </tr>
                    <tbody>
                    <tr v-for="(info,index) in topicPartitionAndRealOffset">
                        <td>{{index+1}}</td>
                        <td>{{info.topic}}</td>
                        <td>{{info.partition}}</td>
                        <td>{{info.earliestOffset}}</td>
                        <td>{{info.lastOffset}}</td>
                        <template v-if="info.sum > 0">
                            <td class="span_blue">{{info.sum}}</td>
                        </template>
                        <template v-else>
                            <td>{{info.sum}}</td>
                        </template>
                        <td>
                            <span @click="routerToDetail(bootstrap.servers,info.topic,info.partition)">查看</span>
                            <span @click="routerToSimpleView(bootstrap.servers,info.topic,info.partition)">简单查看</span>
                            <span @click="routerToSeniorView(bootstrap.servers,info.topic,info.partition)">高级查看</span>
                            <span @click="routerProducerManagerSendSync(bootstrap.servers,info.topic,info.partition)">发送消息</span>
                            <span @click="routerWindManagerOriginal(bootstrap.servers,info.topic)">原始批量</span>
                            <span @click="routerWindManagerBusiness(bootstrap.servers,info.topic)">业务批量</span>
                            <span @click="routerToConsumerView(bootstrap.servers,info.topic)">查看消费者</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mt10">
                <!--/** */:page-size  数一页的数量！！！-->
                <el-pagination v-show="pageInfo.list.length > 0"
                               background
                               @current-change="handleCurrentChange"
                               :current-page.sync="pageInfo.pageNum"
                               :page-size="pageInfo.pageSize"
                               layout="total, prev, pager, next, jumper"
                               :total="pageInfo.total">
                </el-pagination>
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
                topicContain: '',
                topicRegex: '',
                bootstrap_servers: {
                    "home": "192.168.0.105:9092"
                },
                topicPartitionAndRealOffset: [{
                    "topic": "Test",
                    "partition": 0,
                    "earliestOffset": 0,
                    "lastOffset": 53,
                    "sum": 53,
                    "earliestTimestamp": null,
                    "lastTimestamp": null
                }],
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
        created() {
            let self = this;
            self.topicPartitionAndRealOffset = [];
            const bootstrap_servers = self.$route.query && self.$route.query.bootstrap_servers;
            const topicRegex = self.$route.query && self.$route.query.topicRegex;
            if (bootstrap_servers) {
                if (topicRegex) {
                    /**精确查询*/
                    self.bootstrap.servers = bootstrap_servers;
                    self.topicRegex = topicRegex;
                    self.getTopicPartitionAndRealOffsetListByTopicRegex();
                } else {
                    self.bootstrap.servers = bootstrap_servers;
                    self.getTopicPartitionAndRealOffsetList();
                }


            } else {
                this.getKafkaBootstrapServers();
            }
        },
        watch: {},
        methods: {//获取具体的配置
            getKafkaBootstrapServers() {
                let self = this;
                self.$http.get(self.api.getKafkaBootstrapServers, {}, function (response) {
                    if (response.code == 0) {
                        self.bootstrap_servers = response.content;
                        for (var key in self.bootstrap_servers) {
                            self.bootstrap.servers = self.bootstrap_servers[key]
                        }
                        self.getTopicPartitionAndRealOffsetList();
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
            getTopicPartitionAndRealOffsetList() {
                let self = this;
                self.$http.get(self.api.getTopicPartitionAndRealOffsetList, {
                    params: {
                        'bootstrap.servers': self.bootstrap.servers,
                        'topicContain': self.topicContain
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.pageInfo = response.content;
                        self.topicPartitionAndRealOffset = response.content.list;
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
            getTopicPartitionAndRealOffsetListByTopicRegex() {
                let self = this;
                self.$http.get(self.api.getTopicPartitionAndRealOffsetListByTopicRegex, {
                    params: {
                        'bootstrap.servers': self.bootstrap.servers,
                        'topicRegex': self.topicRegex
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.topicPartitionAndRealOffset = response.content;
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
            deleteConsumerGroup(bootstrap_servers, group) {
                let self = this;
                this.$confirm('是否删除该条数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    self.$http.delete(self.api.deleteConsumerGroup
                        , {
                            params: {
                                'bootstrap.servers': bootstrap_servers,
                                'group': group
                            }
                        },
                        function (response) {
                            if (response.code == 0) {
                                if (response.content == true) {
                                    self.$message({
                                        type: 'success',
                                        message: '删除成功',
                                        duration: 2000
                                    });
                                    self.getAliveConsumerGroupByTopicAndGroupNameContain();
                                } else {
                                    self.$message({
                                        type: 'warning',
                                        message: '删除失败',
                                        duration: 2000
                                    });

                                }
                            } else {
                                self.$message({
                                    type: 'error',
                                    message: response.msg,
                                    duration: 2000
                                });
                            }
                        },
                        function (response) {
                            console.log(response);
                            //失败回调
                            self.$message({
                                type: 'error',
                                message: "请求异常",
                                duration: 2000
                            });
                        }
                    )

                })
            },
            routerToDetail(bootstrap_servers, topic, partition) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "&partition=" + partition + "";
                window.open("#/TopicPartitionOffsetDetail" + "?" + queryStr, '_self');
            },
            routerToSimpleView(bootstrap_servers, topic, partition) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "&partition=" + partition + "";
                window.open("#/TopicPartitionSimpleView" + "?" + queryStr, '_self');
            },
            routerToSeniorView(bootstrap_servers, topic, partition) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "&partition=" + partition + "";
                window.open("#/TopicPartitionSeniorView" + "?" + queryStr, '_self');
            },
            routerToConsumerView(bootstrap_servers, topic) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/ConsumerManagerList" + "?" + queryStr, '_self');
            },
            routerProducerManagerSendSync(bootstrap_servers, topic, partition) {
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "&partition=" + partition + "";
                window.open("#/ProducerManagerSendSync" + "?" + queryStr, '_self');
            },
            routerWindManagerOriginal(bootstrap_servers, topic) {
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/WindManagerOriginal" + "?" + queryStr, '_self');
            },
            routerWindManagerBusiness(bootstrap_servers, topic) {
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/WindManagerBusiness" + "?" + queryStr, '_self');
            },
            routerToEdit(id) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "id=" + id + "";
                //跳转携带参数
                window.open("#/TBlogModuleEdit" + "?" + queryStr, '_self');
            },
            routerToAdd() {
                window.open("#/TBlogModuleAdd", '_self');
            },
            searchEvent() {
                this.getTopicPartitionAndRealOffsetList();
            },
            handleCurrentChange(currentChange) {
                let self = this;
                // self.topicPartitionAndRealOffset = [];
                self.$http.get(self.api.getRecordByScrollId, {
                    params: {
                        'scrollId': self.pageInfo.orderBy,
                        'pageNum': currentChange,
                        'pageSize': self.pageInfo.pageSize,
                    }
                }, function (response) {

                    if (response.code == 0) {
                        self.pageInfo = response.content;
                        self.topicPartitionAndRealOffset = response.content.list;
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

    .span_blue {
        color: #007bff !important;
    }
</style>
