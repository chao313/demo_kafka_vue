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
                        <th>name</th>
                        <th>partitions</th>
                        <th>total</th>
                        <th>sum</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>Topic的name</th>
                        <th>分区数量</th>
                        <th>total</th>
                        <th>有效offset数量</th>
                        <th>操作</th>
                    </tr>

                    <tbody>
                    <tr v-for="(info,index) in topicsResults">
                        <td>{{index+1}}</td>
                        <td>{{info.topic}}</td>
                        <td>{{info.partitions}}</td>
                        <td>{{info.total}}</td>
                        <template v-if="info.sum > 0">
                            <td class="span_blue">{{info.sum}}</td>
                        </template>
                        <template v-else>
                            <td>{{info.sum}}</td>
                        </template>
                        <td>
                            <span @click="routerToTopicSimpleView(bootstrap.servers,info.topic)">简单查看</span>
                            <span @click="routerToTopicSeniorView(bootstrap.servers,info.topic)">高级查看</span>
                            <span @click="routerProducerManagerSendSync(bootstrap.servers,info.topic)">发送消息</span>
                            <span @click="routerWindManagerOriginal(bootstrap.servers,info.topic)">原始批量</span>
                            <span @click="routerWindManagerBusiness(bootstrap.servers,info.topic)">业务批量</span>
                            <span @click="routerToConsumerView(bootstrap.servers,info.topic)">查看消费者</span>
                            <span @click="routerToTopicPartitionOffsetList(bootstrap.servers,info.topic)">查看分区</span>
                            <span @click="clearTopic(bootstrap.servers,info.topic)">清空</span>
                            <span @click="deleteByTopicName(bootstrap.servers,info.topic)">删除</span>
                            <span @click="routerToView(bootstrap.servers,info.topic)">配置查看</span>
                            <span @click="routerTopicEditPartitionNum(bootstrap.servers,info.topic)">新增分区数量</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mt10">
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
        </div>

    </div>

</template>

<script>
    import {getPreDay} from '@/utils/index.js'

    export default {
        data() {
            return {
                topicContain: '',
                bootstrap: {
                    servers: '192.168.0.105:9092'
                },
                bootstrap_servers: {
                    "home": "192.168.0.105:9092"
                },
                clusterInfo: {
                    controller: {
                        port: 9092,
                        idString: "xx",
                        host: "192.168.0.105",
                        id: 0
                    },
                    nodes: [
                        {
                            port: 9092,
                            idString: "xx",
                            host: "192.168.0.105",
                            id: 0
                        }
                    ],
                    clusterId: "1",
                    authorizedOperations: []
                },
                topicsResults: [
                    {
                        "topic": null,
                        "partitions": 0,
                        "sum": 0,
                        "total": 0,
                        "earliestTimestamp": null
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
        created() {
            let self = this;
            self.topicsResults = [];
            /**
             * 处理外界参数
             */
            const bootstrap_servers = self.$route.query && self.$route.query.bootstrap_servers;
            const topicContain = self.$route.query && self.$route.query.topicContain;
            if (bootstrap_servers) {
                self.bootstrap.servers = bootstrap_servers;
                if (topicContain) {
                    self.topicContain = topicContain;
                }
                self.queryBase();
            } else {
                this.getKafkaBootstrapServers();
            }
        },
        watch: {},
        methods: {
            queryBase() {
                let self = this;
                self.$http.get(self.api.getTopicRealOffsetList, {
                    params: {
                        'bootstrap.servers': self.bootstrap.servers,
                        'topicContain': self.topicContain
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.pageInfo = response.content;
                        self.topicsResults = response.content.list;
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
            deleteByTopicName(bootstrap_servers, topic) {
                let self = this;
                this.$confirm('是否删除该条数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    self.$http.delete(self.api.deleteTopic
                        , {
                            params: {
                                'bootstrap.servers': bootstrap_servers,
                                'topic': topic
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
                                    self.queryBase();
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
            clearTopic(bootstrap_servers, topic) {
                let self = this;
                this.$confirm('是否清空该条数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    self.$http.delete(self.api.clearTopic
                        , {
                            params: {
                                'bootstrap.servers': bootstrap_servers,
                                'topic': topic
                            }
                        },
                        function (response) {
                            if (response.code == 0) {
                                if (response.content == true) {
                                    self.$message({
                                        type: 'success',
                                        message: '清空成功',
                                        duration: 2000
                                    });
                                    self.queryBase();
                                } else {
                                    self.$message({
                                        type: 'warning',
                                        message: '清空失败',
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
            getKafkaBootstrapServers() {
                let self = this;
                self.$http.get(self.api.getKafkaBootstrapServers, {}, function (response) {
                    if (response.code == 0) {
                        self.bootstrap_servers = response.content;
                        for (var key in self.bootstrap_servers) {
                            self.bootstrap.servers = self.bootstrap_servers[key]
                        }
                        self.queryBase();
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
            routerToView(bootstrap_servers, topic) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/TopicManagerView" + "?" + queryStr, '_self');
            },
            routerToConsumerView(bootstrap_servers, topic) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/ConsumerManagerList" + "?" + queryStr, '_self');
            },
            routerToTopicPartitionOffsetList(bootstrap_servers, topic) {
                let queryStr = "";
                queryStr = queryStr + "topicRegex=" + topic + "&bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/TopicPartitionOffsetList" + "?" + queryStr, '_self');
            },
            routerToTopicSimpleView(bootstrap_servers, topic) {
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/TopicSimpleView" + "?" + queryStr, '_self');
            },
            routerToTopicSeniorView(bootstrap_servers, topic) {
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/TopicSeniorView" + "?" + queryStr, '_self');
            },
            routerProducerManagerSendSync(bootstrap_servers, topic) {
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "";
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
            routerTopicEditPartitionNum(bootstrap_servers, topic) {
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/TopicEditPartitionNum" + "?" + queryStr, '_self');
            },
            routerToAdd() {
                window.open("#/TBlogModuleAdd", '_self');
            },
            searchEvent() {
                this.queryBase();
            },
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
                        self.topicsResults = response.content.list;
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
