<template>
    <div class="app-container">
        <div class="mt20">
            <el-form :inline="true" size="mini">
                <el-form-item label="bootstrap.servers">
                    <!--<el-input v-model="bootstrap.servers" placeholder="请输入"></el-input>-->
                </el-form-item>
                <el-form-item>
                    <!--<el-button type="primary" class="el-button-search" @click="searchEvent()">查询</el-button>-->
                </el-form-item>
            </el-form>
        </div>
        <div class="app-list">
            <div class="app-tab">
                <h5 class="form-tit">Topic基础信息</h5>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <!--显示的字段 - 英文-->
                        <th>name</th>
                        <th>internal</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>Topic的name</th>
                        <th>是否是内部</th>
                    </tr>

                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>{{topicDescription.name}}</td>
                        <td>{{topicDescription.internal}}</td>
                    </tr>
                    </tbody>
                </table>
                <hr>
                <h5 class="form-tit">Topic partitions信息</h5>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <!--显示的字段 - 英文-->
                        <th>partition</th>
                        <th>idString</th>
                        <th>host</th>
                        <th>id</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>Topic的Partition</th>
                        <th>Topic的leader</th>
                        <th>Topic的isr</th>
                        <th>Topic的replicas</th>
                    </tr>

                    <tbody>
                    <template v-for="(value,index) in topicDescription.partitions">
                        <tr>
                            <td>{{index+1}}</td>
                            <td>{{value.partition}}</td>
                            <td>{{value.leader}}</td>
                            <td>{{value.isr}}</td>
                            <td>{{value.replicas}}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
                <hr>
                <h5 class="form-tit">Topic 配置信息</h5>
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
                topicDescription: {
                    partitions: [
                        {
                            "leader": {
                                "port": 9092,
                                "idString": "0",
                                "host": "192.168.0.105",
                                "id": 0
                            },
                            "partition": 0,
                            "replicas": [
                                {
                                    "port": 9092,
                                    "idString": "0",
                                    "host": "192.168.0.105",
                                    "id": 0
                                }
                            ],
                            "isr": [
                                {
                                    "port": 9092,
                                    "idString": "0",
                                    "host": "192.168.0.105",
                                    "id": 0
                                }
                            ]
                        }
                    ],
                    internal: false,
                    name: "Test",
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
            let self = this;
            const bootstrap_servers = self.$route.query && self.$route.query.bootstrap_servers;
            const topic = self.$route.query && self.$route.query.topic;
            this.getTopicDescription(bootstrap_servers, topic);
            this.getTopicConfigs(bootstrap_servers, topic);
        },
        watch: {},
        methods: {
            getTopicDescription(bootstrap_servers, topic) {
                let self = this;
                self.$http.get(self.api.getTopicDescription, {
                    params: {
                        'bootstrap.servers': bootstrap_servers,
                        'topic': topic
                    }
                }, function (response) {

                    if (response.code == 0) {
                        self.clusterInfo = response.content;
                        self.$message({
                            type: 'success',
                            message: '查询成功',
                            duration: 1000
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
            /**
             * 获取配置
             * @param bootstrap_servers
             * @param topic
             */
            getTopicConfigs(bootstrap_servers, topic) {
                let self = this;
                self.$http.get(self.api.getTopicConfigs, {
                    params: {
                        'bootstrap.servers': bootstrap_servers,
                        'topic': topic
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.configs = response.content.entries;
                        self.$message({
                            type: 'success',
                            message: '查询成功',
                            duration: 1000
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
