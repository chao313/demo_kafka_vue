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
                <h5 class="form-tit">Consumer members(成员 alive,已经停止的无法展示)</h5>
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
