<template>
    <div class="app-form mt20 ml40">
        <h5 class="form-tit">发送忘记</h5>
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
                    <el-form-item label="topic">
                        <el-input v-model="postForm.topic" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="partition:">
                        <el-input v-model="postForm.partition" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="timestamp:">
                        <el-input v-model="postForm.timestamp" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="key:">
                        <el-input v-model="postForm.key" ></el-input>
                    </el-form-item>
                    <el-form-item label="value：">
                        <el-input type="textarea" v-model="postForm.value" ></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </section>
        <div class="mt40 ml40">
            <el-button type="primary" @click="submitEditForm()">确定send忘记</el-button>
            <el-button type="primary" class="el-button-search" @click="routerToList()">返回列表</el-button>
        </div>
        <div class="app-container">
            <div class="app-list">
                <div class="app-tab">
                    <table>
                        <thead>
                        <tr>
                            <th>offset</th>
                            <th>topic</th>
                            <th>partition</th>
                            <th>serializedKeySize</th>
                            <th>serializedValueSize</th>
                            <th>timestamp</th>
                        </tr>
                        </thead>
                        <tr>
                            <th>msg偏移量</th>
                            <th>msg所在的topic</th>
                            <th>msg所在的partition</th>
                            <th>msg的key序列化大小</th>
                            <th>msg的value序列化大小</th>
                            <th>msg的时间(创建/接收)</th>
                        </tr>

                        <tbody>
                        <tr v-for="(info,index) in msgReturnData">
                            <td>{{info.offset}}</td>
                            <td>{{info.topic}}</td>
                            <td>{{info.partition}}</td>
                            <td>{{info.serializedKeySize}}</td>
                            <td>{{info.serializedValueSize}}</td>
                            <td>{{info.timestamp}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

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
                    bootstrap:
                        {
                            servers: '192.168.0.105:9092'
                        },
                    topic: 'Test',
                    partition: '',
                    timestamp: '',
                    key: 'key',
                    value: 'value',
                },
                bootstrap_servers: {
                    "home": "192.168.0.105:9092"
                },
                msgReturnData: [
                    {
                        offset: 0,
                        timestamp: '2020-04-11 23:17:17.783',
                        serializedKeySize: 3,
                        serializedValueSize: 5,
                        partition: 1,
                        topic: "Test"
                    }]
            };
        },
        created() {
            let self = this;
            const bootstrap_servers = self.$route.query && self.$route.query.bootstrap_servers;
            const topic = self.$route.query && self.$route.query.topic;
            const partition = self.$route.query && self.$route.query.partition;
            const key = self.$route.params && self.$route.params.key;
            const value = self.$route.params && self.$route.params.value;
            if (bootstrap_servers) {
                if (bootstrap_servers) {
                    self.postForm.bootstrap.servers = bootstrap_servers;
                }
                if (topic) {
                    self.postForm.topic = topic;
                }
                if (partition) {
                    self.postForm.partition = partition;
                }
                if (key) {
                    self.postForm.key = key;
                }
                if (value) {
                    self.postForm.value = value;
                }
            }
            self.msgReturnData.pop();
            this.getKafkaBootstrapServers();
        },
        watch: {},
        methods: {

            submitEditForm() {
                let self = this;
                var params = new FormData();

                params.append('bootstrap.servers', self.postForm.bootstrap.servers);
                params.append('topic', self.postForm.topic);
                params.append('partition', self.postForm.partition);
                params.append('timestamp', self.postForm.timestamp);
                params.append('key', self.postForm.key);
                params.append('value', self.postForm.value);

                var sourceParamsJson = {};
                params.forEach((value, key) => sourceParamsJson[key] = value);

                var ParamsJson = {};
                ParamsJson[params] = sourceParamsJson;

                self.$http.post(self.api.sendForget, params,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }, function (response) {
                        if (response.code == 0) {
                            console.log(response)
                            self.$message({
                                type: 'success',
                                message: '发送成功',
                                duration: 500
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

            }, getKafkaBootstrapServers() {
                let self = this;
                self.$http.get(self.api.getKafkaBootstrapServers, {}, function (response) {
                    if (response.code == 0) {
                        self.bootstrap_servers = response.content;
                        // self.$message({
                        //     type: 'success',
                        //     message: '查询成功',
                        //     duration: 1000
                        // });
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
