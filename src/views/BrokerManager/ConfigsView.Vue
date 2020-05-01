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
                        <th>source</th>
                        <th>isReadOnly</th>
                        <th>isSensitive</th>
                        <th>name</th>
                        <th>value</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>配置来源</th>
                        <th>是否只读</th>
                        <th>是否敏感</th>
                        <th>配置key</th>
                        <th>配置value</th>
                        <th>操作</th>
                    </tr>

                    <tbody>
                    <template v-for="(value,key,index) in configs">
                        <tr>
                            <td>{{index+1}}</td>
                            <td>{{value.source}}</td>
                            <td>{{value.isReadOnly}}</td>
                            <td>{{value.isSensitive}}</td>
                            <td>{{value.name}}</td>
                            <td>{{value.value}}</td>
                            <td>
                                <span @click="routerToView(value.name)">查看</span>
                                <span v-if="value.isReadOnly == false"
                                      @click="routerToEdit(value.name,value.value)">编辑</span>
                                <span v-if="value.isReadOnly == false" @click="deleteByPrimaryKey(value.name)">删除</span>
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
                bootstrap_servers: {
                    "home": "192.168.0.105:9092"
                },
                broker: {
                    id: 0
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
                configs: {
                    first: {
                        isReadOnly: true,
                        isSensitive: false,
                        synonyms: [],
                        name: "advertised.host.name",
                        source: "DEFAULT_CONFIG"
                    }
                }
            }
        },
        mounted() {
            let self = this;
        },
        created() {
            // this.queryBase();
            let self = this;
            self.configs = {};
            self.bootstrap.servers = {};
            this.getKafkaBootstrapServers();
            /**
             * 处理外界参数
             */
            const bootstrap_servers = self.$route.query && self.$route.query.bootstrap_servers;
            if (bootstrap_servers) {
                self.bootstrap.servers = bootstrap_servers;
                self.queryBase();
            }
        },
        watch: {},
        methods: {//获取具体的配置
            queryBase() {
                let self = this;
                self.$http.get(self.api.getBrokerConfigs, {
                    params: {
                        'bootstrap.servers': self.bootstrap.servers,
                        'broker.id': self.broker.id
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.configs = response.content.entries;
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
            routerToView(id) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "id=" + id + "";
                window.open("#/TBlogModuleView" + "?" + queryStr, '_self');
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
