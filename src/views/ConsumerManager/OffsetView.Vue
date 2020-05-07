<template>
    <div class="app-container">
        <div class="app-list">
            <div class="app-tab">
                <h5 class="form-tit">Consumer偏移量挑拨</h5>
                <hr>
                <el-form :inline="true" size="mini">
                    <el-form-item label="bootstrap.servers">
                        <el-input v-model="bootstrap.servers"
                                  maxlength="100"
                                  :style="{width:text(bootstrap.servers)}"
                                  :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="group_id">
                        <el-input v-model="group_id"
                                  maxlength="100"
                                  :style="{width:text(group_id)}"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-form>

                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>Topic-Partition</th>
                        <th>startOffset</th>
                        <th>endOffset</th>
                        <th>offset</th>
                        <th>NoConsumerOffset</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>消费的Topic分区</th>
                        <th>最早有效的offset</th>
                        <th>最新的offset</th>
                        <th>消费的offset</th>
                        <th>剩余的offset</th>
                    </tr>
                    <tbody>
                    <template v-for="(value,key,index) in consumerGroupOffsetsAndRealOffset">
                        <tr>
                            <td>{{index+1}}</td>
                            <td>{{key}}</td>
                            <td>{{value.startOffset}}</td>
                            <td>{{value.endOffset}}</td>
                            <td>{{value.offsetAndMetadata.offset}}</td>
                            <td>{{value.endOffset  - value.offsetAndMetadata.offset}}</td>
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
                    servers: ''
                },
                group_id: '',
                consumerGroupOffsetsAndRealOffset: {
                    "Test-3": {
                        seekOffset: '',
                        "endOffset": 7,
                        "startOffset": 0,
                        "partition": 3,
                        "topic": "Test",
                        "offsetAndMetadata": {
                            "metadata": "",
                            "offset": 3,
                            "leaderEpoch": 0
                        }
                    }
                }
            }
        },
        mounted() {
            let self = this;
        },

        computed: {
            text() {
                return function (value) {
                    if (value == '' || value == 0 || value == 1 || typeof(value) == 'number') {
                        return '100%'
                    } else {
                        if (isNaN(value) == true) {
                            return String(value).length * 1 + 'rem'
                        } else {
                            return String(value).length * 2 + 'rem'
                        }
                    }
                }
            }
        }
        ,
        created() {
            let self = this;
            const bootstrap_servers = self.$route.query && self.$route.query.bootstrap_servers;
            const group_id = self.$route.query && self.$route.query.group_id;
            self.bootstrap.servers = bootstrap_servers;
            self.group_id = group_id;
            self.consumerGroupOffsetsAndRealOffset = {};
            this.getConsumerGroupOffsetsAndRealOffset(bootstrap_servers, group_id);
        }
        ,
        watch: {}
        ,
        methods: {

            getConsumerGroupOffsetsAndRealOffset(bootstrap_servers, group_id) {
                let self = this;
                self.$http.get(self.api.getConsumerGroupOffsetsAndRealOffset, {
                    params: {
                        'bootstrap.servers': bootstrap_servers,
                        'group': group_id
                    }
                }, function (response) {

                    if (response.code == 0) {
                        self.consumerGroupOffsetsAndRealOffset = response.content;
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
