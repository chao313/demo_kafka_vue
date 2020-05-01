<template>
    <div class="app-form mt20 ml40">
        <h5 class="form-tit">注册配置编辑</h5>
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
                    <el-form-item label="numPartitions:">
                        <el-input v-model="postForm.numPartitions" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="replicationFactor:">
                        <el-input v-model="postForm.replicationFactor" maxlength="100"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </section>
        <div class="mt40 ml40">
            <el-button type="primary" @click="submitAddForm('postForm')">确定添加</el-button>
            <el-button type="primary" class="el-button-search" @click="routerToList()">返回列表</el-button>
        </div>
    </div>

</template>
<script>
    export default {
        name: 'moduleDetail',
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                postForm: {
                    bootstrap: {servers: '192.168.0.105:9092'},
                    topic: '',
                    numPartitions: 1,
                    replicationFactor: 1
                },
                bootstrap_servers: {
                    "home": "192.168.0.105:9092"
                }
            }
        },
        created() {
            this.getKafkaBootstrapServers();
        },
        watch: {},
        methods: {
            submitAddForm(formName) {
                let self = this;
                let params = new FormData();

                params.append('bootstrap.servers', self.postForm.bootstrap.servers);
                params.append('topic', self.postForm.topic);
                params.append('numPartitions', self.postForm.numPartitions);
                params.append('replicationFactor', self.postForm.replicationFactor);
                /**
                 * 转json
                 */

                self.$http.post(self.api.addTopic, params, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                }, function (response) {
                    if (response.code == 0) {
                        if (response.content == true) {
                            self.$message({
                                type: 'success',
                                message: '添加成功，页面即将跳转至列表页',
                                duration: 500,
                                onClose: function () {
                                    self.$router.push({
                                        path: '/TopicManagerList'
                                    })
                                }
                            });

                        } else {
                            self.$message({
                                type: 'warning',
                                message: '添加失败',
                                duration: 2000
                            });
                        }
                    } else {
                        self.$message({
                            type: 'warning',
                            message: response.msg,
                            duration: 2000
                        });
                    }
                }, function (response) {
                    //失败回调
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
            routerToList() {
                //跳转回List
                window.open("#/TBlogModuleList", '_self');
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
