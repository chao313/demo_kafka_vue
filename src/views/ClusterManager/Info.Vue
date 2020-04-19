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
                <h5 class="form-tit">cluster的信息</h5>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <!--显示的字段 - 英文-->
                        <th>ClusterId</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>集群id</th>
                    </tr>

                    <tbody>
                    <tr>
                        <template v-if="clusterInfo.clusterId">
                            <td>1</td>
                            <!--显示的字段 - 具体数据-->
                            <td>{{clusterInfo.clusterId}}</td>
                        </template>
                    </tr>
                    </tbody>
                </table>
                <hr>
                <h5 class="form-tit">controller(kafka控制器,多个broker中选举一个)</h5>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <!--显示的字段 - 英文-->
                        <th>port</th>
                        <th>idString</th>
                        <th>host</th>
                        <th>id</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>端口号</th>
                        <th>idString</th>
                        <th>host</th>
                        <th>id</th>
                        <th>操作</th>
                    </tr>

                    <tbody>
                    <tr>
                        <template v-if="clusterInfo.controller.host">
                            <td>1</td>
                            <td>{{clusterInfo.controller.port}}</td>
                            <td>{{clusterInfo.controller.idString}}</td>
                            <td>{{clusterInfo.controller.host}}</td>
                            <td>{{clusterInfo.controller.id}}</td>
                            <td>
                                <span @click="routerToConfigsView(bootstrap.servers)">查看Config</span>
                                <span @click="routerToTopicManagerList(bootstrap.servers)">查看Topic</span>
                            </td>
                        </template>
                    </tr>
                    </tbody>
                </table>
                <hr>
                <h5 class="form-tit">Nodes(kafka的所有broker节点)</h5>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <!--显示的字段 - 英文-->
                        <th>port</th>
                        <th>idString</th>
                        <th>host</th>
                        <th>id</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>端口号</th>
                        <th>idString</th>
                        <th>host</th>
                        <th>id</th>
                        <th>操作</th>
                    </tr>

                    <tbody>
                    <template v-if="clusterInfo.nodes">
                        <tr v-for="(info,index) in clusterInfo.nodes">
                            <td>{{index+1}}</td>
                            <td>{{info.port}}</td>
                            <td>{{info.idString}}</td>
                            <td>{{info.host}}</td>
                            <td>{{info.id}}</td>
                            <td>
                                <span @click="routerToConfigsView(bootstrap.servers)">查看Config</span>
                                <span @click="routerToTopicManagerList(bootstrap.servers)">查看Topic</span>
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

    export default {
        data() {
            return {
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
                }
            }
        },
        mounted() {
            let self = this;
        },
        created() {
            // this.queryBase();
            let self = this;
            self.clusterInfo.controller = {};
            self.clusterInfo.nodes = {};
            self.clusterInfo.clusterId = '';
            self.bootstrap = {};
            self.bootstrap_servers = {};
            this.getKafkaBootstrapServers();
        },
        watch: {},
        methods: {//获取具体的配置
            queryBase() {
                let self = this;
                self.$http.get(self.api.getCluster, {
                    params: {
                        'bootstrap.servers': self.bootstrap.servers
                    }
                }, function (response) {

                    if (response.code == 0) {
                        self.clusterInfo = response.content;
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
            },
            routerToConfigsView(bootstrap_servers) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/BrokerManagerConfigsView" + "?" + queryStr, '_blank');
            },
            routerToTopicManagerList(bootstrap_servers) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/TopicManagerList" + "?" + queryStr, '_blank');
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
