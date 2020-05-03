<template>
    <div class="app-form mt20 ml40">
        <h5 class="form-tit">更新partition数量</h5>
        <section>
            <el-form :model="postForm" ref="postForm" label-width="180px" size="mini"
                     :inline-message="true">
                <div class="mt30 ml15">
                    <el-form-item label="bootstrap.servers">
                        <el-select v-model="postForm.bootstrap.servers" placeholder="请输入kafka地址:">
                            <el-option v-for="(item,index) in bootstrap_servers" :key="item" :label="index"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="topic:">
                        <el-input v-model="postForm.topic" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="numPartitions -> old :">
                        <template v-if="topicDescription.partitions">
                            <el-input v-model="topicDescription.partitions.length" maxlength="100"
                                      :disabled="true"></el-input>
                        </template>
                        <template v-else>
                            <el-input maxlength="100"
                                      :disabled="true"></el-input>
                        </template>
                    </el-form-item>
                    <el-form-item label="numPartitions -> new :">
                        <el-input v-model="postForm.numPartitionsNew" maxlength="100"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </section>
        <div class="mt40 ml40">
            <el-button type="primary" @click="getTopicDescriptionClick()">查询</el-button>
            <el-button type="primary" @click="submitAddForm()">确定更新</el-button>
        </div>
    </div>

</template>
<script>
    export default {
        data() {
            return {
                postForm: {
                    bootstrap: {servers: '192.168.0.105:9092'},
                    topic: '',
                    numPartitionsNew: null,
                },
                bootstrap_servers: {
                    "home": "192.168.0.105:9092"
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
                }
            }
        },
        created() {
            let self = this;
            self.topicDescription = {};
            const bootstrap_servers = self.$route.query && self.$route.query.bootstrap_servers;
            const topic = self.$route.query && self.$route.query.topic;
            if (bootstrap_servers) {
                self.postForm.bootstrap.servers = bootstrap_servers;
                self.postForm.topic = topic;
                self.getTopicDescription(bootstrap_servers, topic);
            } else {
                self.getKafkaBootstrapServers();
            }
        },
        watch: {},
        methods: {
            submitAddForm() {
                let self = this;
                self.increasePartitions(self.postForm.bootstrap.servers, self.postForm.topic, self.postForm.numPartitionsNew)
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
            routerToList() {
                //跳转回List
                window.open("#/TBlogModuleList", '_self');
            },
            getTopicDescriptionClick() {
                let self = this;
                self.getTopicDescription(self.postForm.bootstrap.servers, self.postForm.topic);
            },
            getTopicDescription(bootstrap_servers, topic) {
                let self = this;
                self.$http.get(self.api.getTopicDescription, {
                    params: {
                        'bootstrap.servers': bootstrap_servers,
                        'topic': topic
                    }
                }, function (response) {

                    if (response.code == 0) {
                        self.topicDescription = response.content;
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
            increasePartitions(bootstrap_servers, topic, totalPartition) {
                console.log(bootstrap_servers)
                console.log(topic)
                console.log(totalPartition)
                let self = this;
                self.$http.get(self.api.increasePartitions, {
                    params: {
                        'bootstrap.servers': bootstrap_servers,
                        'topic': topic,
                        'totalPartition': totalPartition
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.getTopicDescription(self.postForm.bootstrap.servers, self.postForm.topic)
                        if (response.code == true) {
                            self.$message({
                                type: 'success',
                                message: '修改成功',
                                duration: 2000
                            });
                        } else {
                            self.$message({
                                type: 'success',
                                message: '修改失败',
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
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
