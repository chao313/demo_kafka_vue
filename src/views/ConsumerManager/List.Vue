<template>
    <div class="app-container">
        <div class="mt20">
            <el-form :inline="true" size="mini">
                <el-form-item label="bootstrap.servers">
                    <el-select v-model="bootstrap.servers" placeholder="请输入kafka地址:">
                        <el-option v-for="(item,index) in bootstrap_servers" :key="item" :label="index"
                                   :value="item">
                        </el-option>
                    </el-select>
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
                        <th>isSimpleConsumerGroup</th>
                        <th>members</th>
                        <th>status</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>consumer的group.id</th>
                        <th>是否是简单消费者</th>
                        <th>成员数量</th>
                        <th>消费者状态</th>
                        <th>操作</th>
                    </tr>

                    <tbody>
                    <tr v-for="(info,index) in consumers">
                        <td>{{index+1}}</td>
                        <td>{{info.groupId}}</td>
                        <td>{{info.isSimpleConsumerGroup}}</td>
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
                <p v-show="total == 0" class="no-data-tip">没有找到相关数据！</p>
                <div>
                    <pre>{{jsonData}}</pre>
                </div>
            </div>
            <div class="mt20" v-show="total > 0">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage"
                               :page-size="pageSize" layout="total,prev, pager, next" :total="total">
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
                bootstrap_servers: {
                    "home": "192.168.0.105:9092"
                },
                consumers:
                    [{
                        "groupId": "consumer",
                        "members": '',
                        "state": "EMPTY",
                        "isSimpleConsumerGroup": false
                    }]
            }
        },
        mounted() {
            let self = this;
            self.consumers = [];
        },
        created() {
            // this.getConsumerGroups();
            this.getKafkaBootstrapServers();
        },
        watch: {},
        methods: {//获取具体的配置
            getConsumerGroups() {
                let self = this;
                self.$http.get(self.api.getConsumerGroups, {
                    params: {
                        'bootstrap.servers': self.bootstrap.servers
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.consumers = [];
                        response.content.forEach(value => {
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
                                    self.getConsumerGroups();
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
                window.open("#/ConsumerManagerSeekList" + "?" + queryStr, '_blank');
            },
            routerToOffsetView(bootstrap_servers, group_id) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "group_id=" + group_id + "&bootstrap_servers=" + bootstrap_servers + "";
                //跳转携带参数
                window.open("#/ConsumerManagerOffsetView" + "?" + queryStr, '_blank');
            },
            routerToAdd() {
                window.open("#/TBlogModuleAdd", '_self');
            },
            searchEvent() {
                this.getConsumerGroups();
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
