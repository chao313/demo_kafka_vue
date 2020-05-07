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
                <el-form-item label="订阅的topic">
                    <el-input v-model="topic" placeholder="请输入topic"></el-input>
                </el-form-item>
                <el-form-item label="groupNameContain">
                    <el-input v-model="groupNameContain" placeholder="请输入groupNameContain"></el-input>
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
                        <th>group.id</th>
                        <th>members</th>
                        <th>status</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>consumer的group.id</th>
                        <th>成员数量</th>
                        <th>消费者状态</th>
                        <th>操作</th>
                    </tr>

                    <tbody>
                    <tr v-for="(info,index) in consumers">
                        <td>{{index+1}}</td>
                        <td>{{info.groupId}}</td>
                        <td>{{info.members}}</td>
                        <td>{{info.state}}</td>
                        <td>
                            <span @click="routerToView(bootstrap.servers,info.groupId)">消费者详情</span>
                            <span @click="routerToOffsetView(bootstrap.servers,info.groupId)">Offset详情</span>
                            <template v-if="info.state!='EMPTY'">
                                <span @click="routerToSeek(bootstrap.servers,info.groupId,info.state)">
                                    <span class="red">seek</span></span>
                            </template>
                            <template v-else>
                                <span class="redSpan" @click="routerToSeek(bootstrap.servers,info.groupId,info.state)">seek</span>
                            </template>
                            <span @click="deleteConsumerGroup(bootstrap.servers,info.groupId)">删除</span>
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
                topic: null,
                groupNameContain: null,
                bootstrap: {
                    servers: ''
                },
                bootstrap_servers: {
                    "home": "192.168.0.105:9092"
                },
                consumers:
                    [{
                        "groupId": "consumer",
                        "members": '',
                        "state": "EMPTY",
                        "isSimpleConsumerGroup": false
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
            self.consumers = [];
        },
        created() {
            let self = this;
            const bootstrap_servers = self.$route.query && self.$route.query.bootstrap_servers;
            const topic = self.$route.query && self.$route.query.topic;
            const groupNameContain = self.$route.query && self.$route.query.groupNameContain;
            if (bootstrap_servers) {
                self.bootstrap.servers = bootstrap_servers;
                self.topic = topic;
                self.groupNameContain = groupNameContain;
                self.searchEvent();
            } else {
                self.getKafkaBootstrapServers();
            }
        },
        watch: {},
        methods: {//获取具体的配置
            getAliveConsumerGroupByTopicAndGroupNameContain() {
                let self = this;
                self.$http.get(self.api.getAliveConsumerGroupByTopicAndGroupNameContain, {
                    params: {
                        'bootstrap.servers': self.bootstrap.servers,
                        'groupNameContain': self.groupNameContain
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.consumers = [];
                        self.pageInfo = response.content;
                        response.content.list.forEach(value => {
                            let vo = {};
                            vo['groupId'] = value.groupId;
                            vo.members = value.members.length;
                            vo.state = value.state;
                            vo.isSimpleConsumerGroup = value.isSimpleConsumerGroup;
                            self.consumers.push(vo);
                        })

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
            getConsumerGroupByTopicAndGroupNameContain() {
                let self = this;
                self.$http.get(self.api.getConsumerGroupByTopicAndGroupNameContain, {
                    params: {
                        'bootstrap.servers': self.bootstrap.servers,
                        'topic': self.topic,
                        'groupNameContain': self.groupNameContain
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.consumers = [];
                        self.pageInfo = response.content;
                        response.content.list.forEach(value => {
                            let vo = {};
                            vo['groupId'] = value.groupId;
                            vo.members = value.members.length;
                            vo.state = value.state;
                            vo.isSimpleConsumerGroup = value.isSimpleConsumerGroup;
                            self.consumers.push(vo);
                        })

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
            getKafkaBootstrapServers() {
                let self = this;
                self.$http.get(self.api.getKafkaBootstrapServers, {}, function (response) {
                    if (response.code == 0) {
                        self.bootstrap_servers = response.content;
                        for (var key in self.bootstrap_servers) {
                            self.bootstrap.servers = self.bootstrap_servers[key]
                        }
                        self.searchEvent();
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
            routerToView(bootstrap_servers, group_id) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "group_id=" + group_id + "&bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/ConsumerManagerView" + "?" + queryStr, '_self');
            },
            routerToSeek(bootstrap_servers, group_id, state) {
                let self = this;
                if (state !== 'EMPTY') {
                    self.$message({
                        type: 'warning',
                        message: '消费者状态不为EMPTY，无法seek',
                        duration: 3000
                    });
                    return;
                }
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "group_id=" + group_id + "&bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/ConsumerManagerSeekList" + "?" + queryStr, '_self');
            },
            routerToOffsetView(bootstrap_servers, group_id) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "group_id=" + group_id + "&bootstrap_servers=" + bootstrap_servers + "";
                //跳转携带参数
                window.open("#/ConsumerManagerOffsetView" + "?" + queryStr, '_self');
            },
            routerToAdd() {
                window.open("#/TBlogModuleAdd", '_self');
            },
            searchEvent() {
                let self = this;
                /**
                 * !!! 如果不为空,调用消耗性能多的
                 */
                if (self.topic) {
                    self.getConsumerGroupByTopicAndGroupNameContain();
                } else {
                    self.getAliveConsumerGroupByTopicAndGroupNameContain();
                }

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
                        self.consumers = [];
                        self.pageInfo = response.content;
                        response.content.list.forEach(value => {
                            let vo = {};
                            vo['groupId'] = value.groupId;
                            vo.members = value.members.length;
                            vo.state = value.state;
                            vo.isSimpleConsumerGroup = value.isSimpleConsumerGroup;
                            self.consumers.push(vo);
                        })
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

        redSpan {
            color: #b21f2d;
        }

    }

    .red {
        color: #b21f2d !important;
        /*font-size: 100px;*/
    }
</style>
