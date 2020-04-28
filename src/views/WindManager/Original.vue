<template>
    <div class="app-form mt20 ml40">
        <h5 class="form-tit">资源添加</h5>
        <section>
            <el-form :model="postForm" :rules="rules" ref="postForm" label-width="180px" size="mini"
                     :inline-message="true">
                <div class="mt30 ml15">
                    <el-form-item label="bootstrap.servers">
                        <el-select v-model="postForm.bootstrap.servers" placeholder="请输入kafka地址:">
                            <el-option v-for="(item,index) in bootstrap_servers" :key="item" :label="index"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="topic：">
                        <el-input v-model="postForm.topic" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="partition：">
                        <el-input v-model="postForm.partition" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="policyID：">
                        <el-input v-model="postForm.policyID" maxlength="100"></el-input>
                    </el-form-item>
                    <el-upload
                            class="upload-file"
                            multiple
                            drag
                            :limit=10
                            :before-upload="beforeUpload"
                            :auto-upload="false"
                            :action="postForm.action"
                            :on-change="onchange"
                            :on-success="onSuccess"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </div>
            </el-form>
        </section>
        <div class="mt40 ml40">
            <el-button type="primary" @click="submitForm()">确定</el-button>
            <el-button @click="resetForm('postForm')">取消</el-button>
        </div>
    </div>

</template>
<script>
    import axios from 'axios';

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
                bootstrap_servers: {
                    "home": "192.168.0.105:9092"
                },
                postForm: {
                    bootstrap:
                        {
                            servers: ''
                        },
                    topic: '',
                    partition: '',
                    policyID: '',
                    files: [],
                    file: null,
                    action: ''
                }
            };
        },
        created() {
            let self = this;
            self.bootstrap_servers = {};
            this.getKafkaBootstrapServers();
        },
        watch: {},
        methods: {
            /**
             * 监控文件的变化 添加 ， 移除...
             * @param file
             * @param fileList
             */
            onchange(file, fileList) {
                let self = this;
                self.postForm.files = fileList;
                self.postForm.file = file;
                console.info(file);
            },


            async beforeUpload(file) {
                console.info("111111111")
                let self = this;
                // console.info(file)
                // self.postForm.files = file;
                // console.info(files)


            }
            ,
            routerToList() {
                window.open("#/ResourceManagerList", '_self');
            }
            ,
            onSuccess(response, file, fileList) {
                let self = this;

                if (response.code == 0) {
                    if (response.content == true) {
                        self.$message({
                            type: 'success',
                            message: '上传成功',
                            duration: 500,
                        });
                    } else {
                        self.$message({
                            type: 'warning',
                            message: '请求异常',
                            duration: 500,
                        });
                    }
                } else {
                    self.$message({
                        type: 'warning',
                        message: '请求异常',
                        duration: 500,
                    });
                }
                /**
                 * 获取上传之后的数据信息
                 */
                let fileName = file.name;
                this.getResourceFileDetailByFileName(fileName);
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
            submitForm() {
                let self = this;
                var params = new FormData();

                params.append('bootstrap.servers', self.postForm.bootstrap.servers);
                params.append('topic', self.postForm.topic);
                params.append('partition', self.postForm.partition);
                params.append('policyID', self.postForm.policyID);

                let param = "?";
                params.forEach((value, key) => param = param + key + "=" + value + "&");

                var form = new FormData();

                form.append('file', self.postForm.file.raw);

                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
                self.$http.post(self.api.sendFile + param, form, config, function (response) {
                    if (response.code == 0) {
                        console.log(response)
                        self.$message({
                            type: 'success',
                            message: 'send成功',
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


            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
