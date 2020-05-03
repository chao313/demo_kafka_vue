<template>
    <div class="app-form mt20 ml40">
        <h5 class="form-tit">原始zip包上传，可以选择多个zip包</h5>
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
                            accept=".zip"
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
                    file: '',
                    action: ''
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
            if (bootstrap_servers) {
                self.postForm.bootstrap.servers = bootstrap_servers;
                self.postForm.topic = topic;
                if (partition) {
                    self.postForm.partition = partition;
                }
            }

            self.bootstrap_servers = {};
            self.msgReturnData = [];
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
                        for (var key in self.bootstrap_servers) {
                            self.postForm.bootstrap.servers = self.bootstrap_servers[key]
                        }
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

                self.postForm.files.forEach(file => form.append('files', file.raw, file.raw.name));

                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
                self.$http.post(self.api.sendOriginalFile + param, form, config, function (response) {
                    if (response.code == 0) {

                        response.content.forEach(value => {
                            value.timestamp = self.dateFormat("YYYY-mm-dd HH:MM:SS.s", new Date(value.timestamp));
                            self.msgReturnData.push(value);
                        });

                        self.msgReturnData = self.sortByKey(self.msgReturnData, 'timestamp');
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


            },
            sortByKey(array, key) {
                return array.sort(function (a, b) {
                    var x = a[key];
                    var y = b[key];
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                })
            },
            dateFormat(fmt, date) {
                let ret;
                const opt = {
                    "Y+": date.getFullYear().toString(),        // 年
                    "m+": (date.getMonth() + 1).toString(),     // 月
                    "d+": date.getDate().toString(),            // 日
                    "H+": date.getHours().toString(),           // 时
                    "M+": date.getMinutes().toString(),         // 分
                    "S+": date.getSeconds().toString(),         // 秒
                    "s+": this.dealMilliseconds(date.getMilliseconds().toString())          // 毫秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                };
                for (let k in opt) {
                    ret = new RegExp("(" + k + ")").exec(fmt);
                    if (ret) {
                        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                    }
                    ;
                }
                ;
                return fmt;
            },
            /**
             * 补全长度
             * @param milliseconds
             * @returns {*}
             */
            dealMilliseconds(milliseconds) {
                if (milliseconds.length == 1) {
                    return milliseconds + '00';
                } else if (milliseconds.length == 2) {
                    return milliseconds + '0';
                } else {
                    return milliseconds;
                }


            }

        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
