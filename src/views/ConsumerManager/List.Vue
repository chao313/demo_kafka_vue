<template>
    <div class="app-container">
        <div class="mt20">
            <el-form :inline="true" size="mini">
                <el-form-item label="bootstrap.servers">
                    <el-input v-model="bootstrap.servers" placeholder="请输入"></el-input>
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
                        <th>group.id</th>
                        <th>isSimpleConsumerGroup</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <th>consumer的group.id</th>
                        <th>是否是简单消费者</th>
                        <th>操作</th>
                    </tr>

                    <tbody>
                    <tr v-for="(info,index) in consumers">
                        <td>{{index+1}}</td>
                        <td>{{info.groupId}}</td>
                        <td>{{info.isSimpleConsumerGroup}}</td>
                        <td>
                            <span @click="routerToView(bootstrap.servers,info.groupId)">查看</span>
                            <span @click="deleteConsumerGroup(bootstrap.servers,info.groupId)">删除</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <p v-show="total == 0" class="no-data-tip">没有找到相关数据！</p>
                <div>
                    <pre>{{jsonData}}</pre>
                </div>
            </div>
            <div class="mt20" v-show="total > 0">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage"
                               :page-size="pageSize" layout="total,prev, pager, next" :total="total">
                </el-pagination>
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
                consumers:
                    [{
                        groupId: "KMOffsetCache-localhost.localdomain",
                        isSimpleConsumerGroup: false
                    }]
            }
        },
        mounted() {
            let self = this;
        },
        created() {
            this.getConsumerGroups();
        },
        watch: {},
        methods: {//获取具体的配置
            getConsumerGroups() {
                let self = this;
                self.$http.get(self.api.getConsumerGroups, {
                    params: {
                        'bootstrap.servers': self.bootstrap.servers
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.consumers = response.content.all.value;
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
            deleteConsumerGroup(bootstrap_servers, group) {
                let self = this;
                this.$confirm('是否删除该条数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    self.$http.delete(self.api.deleteConsumerGroup
                        , {
                            params: {
                                'bootstrap.servers': bootstrap_servers,
                                'group': group
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
                                    self.getConsumerGroups();
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
            routerToView(bootstrap_servers, group_id) {
                //跳转携带参数
                let queryStr = "";
                queryStr = queryStr + "group_id=" + group_id + "&bootstrap_servers=" + bootstrap_servers + "";
                window.open("#/ConsumerManagerView" + "?" + queryStr, '_self');
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
                this.getConsumerGroups();
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
