<template>
    <div class="app-form mt20 ml40">
        <h5 class="form-tit">同步发送</h5>
        <section>
            <el-form :model="postForm" :rules="rules" ref="postForm" label-width="180px" size="mini"
                     :inline-message="true">
                <div class="mt30 ml15">
                    <el-form-item label="bootstrap.servers:">
                        <el-input v-model="postForm.bootstrap.servers" maxlength="100" :disabled=true></el-input>
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
                        <el-input v-model="postForm.key" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="value：">
                        <el-input type="textarea" v-model="postForm.value" maxlength="10000"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </section>
        <div class="mt40 ml40">
            <el-button type="primary" @click="submitEditForm()">确定同步send</el-button>
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
            /**
             * 1.接收外界参数
             */
            const id = this.$route.query && this.$route.query.id
            // self.queryByPrimaryKey(id)
            self.msgReturnData.pop();
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

                self.$http.get(self.api.sendSync, {
                    params: sourceParamsJson
                }, function (response) {
                    if (response.code == 0) {
                        console.log(response)
                        self.$message({
                            type: 'success',
                            message: '修改成功，页面即将跳转至列表页',
                            duration: 500
                        });
                        response.content.timestamp = self.dateFormat("YYYY-mm-dd HH:MM:SS.s", new Date(response.content.timestamp));
                        self.msgReturnData.push(response.content);
                        self.msgReturnData = self.sortByKey(self.msgReturnData, 'timestamp');
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
