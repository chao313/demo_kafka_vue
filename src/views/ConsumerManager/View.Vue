<template>
    <div class="app-container">
        <div class="app-list">
            <div class="app-tab">
                <h5 class="form-tit">Consumer基础信息</h5>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>groupId</th>
                        <th>state</th>
                        <th>isSimpleConsumerGroup</th>
                        <th>partitionAssignor</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>Consumer的groupId</th>
                        <th>Consumer的状态</th>
                        <th>Consumer是否是简单消费者</th>
                        <th>Consumer的分区分配器</th>
                    </tr>

                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>{{consumerInfo.groupId}}</td>
                        <td>{{consumerInfo.state}}</td>
                        <td>{{consumerInfo.isSimpleConsumerGroup}}</td>
                        <td>{{consumerInfo.partitionAssignor}}</td>
                    </tr>
                    </tbody>
                </table>
                <hr>
                <h5 class="form-tit">Consumer coordinator(均衡器)</h5>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>id</th>
                        <th>idString</th>
                        <th>port</th>
                        <th>host</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>coordinator的id</th>
                        <th>coordinator的idString</th>
                        <th>coordinator的端口</th>
                        <th>coordinator的主机</th>
                    </tr>

                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>{{consumerInfo.coordinator.id}}</td>
                        <td>{{consumerInfo.coordinator.idString}}</td>
                        <td>{{consumerInfo.coordinator.port}}</td>
                        <td>{{consumerInfo.coordinator.host}}</td>
                    </tr>
                    </tbody>
                </table>
                <hr>
                <h5 class="form-tit">Consumer members(成员)</h5>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>client.id</th>
                        <th>host</th>
                        <th>memberId</th>
                        <th>assignment</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>Consumer的客户端id</th>
                        <th>Consumer的主机</th>
                        <th>Consumer的成员id</th>
                        <th>assignment(被分配的分区)</th>
                    </tr>

                    <tbody>
                    <template v-for="(value,index) in consumerInfo.members">
                        <tr>
                            <td>{{index+1}}</td>
                            <td>{{value.clientId}}</td>
                            <td>{{value.host}}</td>
                            <td>{{value.memberId}}</td>
                            <td>{{value.assignment.topicPartitions}}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
                <hr>
                <h5 class="form-tit">Consumer 消费情况(偏移量)</h5>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>Topic-Partition</th>
                        <th>offset</th>
                        <th>leaderEpoch</th>
                        <th>metadata</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>消费的Topic分区</th>
                        <th>消费的offset</th>
                        <th>水位?</th>
                        <th>元数据</th>
                    </tr>

                    <tbody>
                    <template v-for="(value,key,index) in consumerGroupOffsets">
                        <tr>
                            <td>{{index+1}}</td>
                            <td>{{key}}</td>
                            <td>{{value.offset}}</td>
                            <td>{{value.leaderEpoch}}</td>
                            <td>{{value.metadata}}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
                <hr>
                <h5 class="form-tit">Consumer 消费情况和真实的偏移量</h5>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>Topic-Partition</th>
                        <th>offset</th>
                        <th>leaderEpoch</th>
                        <th>startOffset</th>
                        <th>endOffset</th>
                        <th>设置偏移量</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>消费的Topic分区</th>
                        <th>消费的offset</th>
                        <th>水位?</th>
                        <th>最早有效的offset</th>
                        <th>最新的offset</th>
                        <th>设置偏移量</th>
                        <th>操作</th>
                    </tr>

                    <tbody>
                    <template v-for="(value,key,index) in consumerGroupOffsetsAndRealOffset">
                        <tr>
                            <td>{{index+1}}</td>
                            <td>{{key}}</td>
                            <td>{{value.offsetAndMetadata.offset}}</td>
                            <td>{{value.offsetAndMetadata.leaderEpoch}}</td>
                            <td>{{value.startOffset}}</td>
                            <td>{{value.endOffset}}</td>
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
                group_id: '',
                consumerInfo: {
                    groupId: "consumer-test33",
                    state: "STABLE",
                    isSimpleConsumerGroup: false,
                    partitionAssignor: "range",
                    coordinator: {
                        "port": 9092,
                        "idString": "0",
                        "host": "192.168.0.105",
                        "id": 0
                    },
                    members: [
                        {
                            clientId: "consumer-2",
                            host: "/192.168.0.100",
                            memberId: "consumer-2-ad6a63cb-b3cb-4fee-a5dd-fdc421d44a2e",
                            assignment: {
                                topicPartitions: [
                                    {
                                        "partition": 0,
                                        "topic": "Test",
                                        "hash": 2604147
                                    }
                                ]
                            }
                        }
                    ],

                    authorizedOperations: []
                },
                consumerGroupOffsets: {
                    "Test-0": {
                        "metadata": "",
                        "offset": 28,
                        "leaderEpoch": 0
                    }
                },
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
                }
            }
        },
        mounted() {
            let self = this;
        }
        ,
        created() {
            let self = this;
            const bootstrap_servers = self.$route.query && self.$route.query.bootstrap_servers;
            const group_id = self.$route.query && self.$route.query.group_id;
            self.bootstrap.servers = bootstrap_servers;
            self.group_id = group_id;
            this.getConsumerGroupDescribe(bootstrap_servers, group_id);
            this.getConsumerGroupOffsets(bootstrap_servers, group_id);
            this.getConsumerGroupOffsetsAndRealOffset(bootstrap_servers, group_id);
        }
        ,
        watch: {}
        ,
        methods: {
            getConsumerGroupDescribe(bootstrap_servers, group_id) {
                let self = this;
                self.$http.get(self.api.getConsumerGroupDescribe, {
                    params: {
                        'bootstrap.servers': bootstrap_servers,
                        'group': group_id
                    }
                }, function (response) {

                    if (response.code == 0) {
                        self.consumerInfo = response.content;
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
            getConsumerGroupOffsetsAndRealOffset(bootstrap_servers, group_id) {
                let self = this;
                self.$http.get(self.api.getConsumerGroupOffsetsAndRealOffset, {
                    params: {
                        'bootstrap.servers': bootstrap_servers,
                        'group': group_id
                    }
                }, function (response) {

                    if (response.code == 0) {
                        self.consumerGroupOffsetsAndRealOffset = response.content;
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
             *偏移量
             */
            getConsumerGroupOffsets(bootstrap_servers, group) {
                let self = this;
                self.$http.get(self.api.getConsumerGroupOffsets, {
                    params: {
                        'bootstrap.servers': bootstrap_servers,
                        'group': group
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.consumerGroupOffsets = response.content;
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


            }

            ,

            deleteByPrimaryKey(id) {
                let self = this;
                this.$confirm('是否删除该条数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    self.$http.get(self.api.deleteTBlogByPrimaryKey
                        , {
                            params: {
                                id: id
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
                this.queryBase();
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
