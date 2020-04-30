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
                <el-form-item label="topic_pattern">
                    <el-input v-model="topic_pattern" placeholder="请输入topic_pattern"></el-input>
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
                        <td>{{info.sum}}</td>
                        <td>
                            <span @click="routerToDetail(bootstrap.servers,info.topic,info.partition)">查看</span>
                            <span @click="routerToSimpleView(bootstrap.servers,info.topic,info.partition)">简单查看</span>
                            <span @click="routerToSeniorView(bootstrap.servers,info.topic,info.partition)">高级查看</span>
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
                topic_pattern: '.*',
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
                }]
            }
        },
        mounted() {
            let self = this;
        },
        created() {
            // this.getTopicPartitionAndRealOffsetList();
            let self = this;
            self.topicPartitionAndRealOffset = [];
            this.getKafkaBootstrapServers();
        },
        watch: {},
        methods: {//获取具体的配置
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
            }, getTopicPartitionAndRealOffsetList() {
                let self = this;
                self.$http.get(self.api.getTopicPartitionAndRealOffsetList, {
                    params: {
                        'bootstrap.servers': self.bootstrap.servers,
                        'topic_pattern': self.topic_pattern
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
                window.open("#/TopicPartitionOffsetSimpleView" + "?" + queryStr, '_self');
            },
            routerToSeniorView(bootstrap_servers, topic, partition) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "topic=" + topic + "&bootstrap_servers=" + bootstrap_servers + "&partition=" + partition + "";
                window.open("#/TopicPartitionOffsetSeniorView" + "?" + queryStr, '_self');
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
