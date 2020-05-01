<template>
    <div class="app-form mt20 ml40">
        <h5 class="form-tit">查看</h5>
        <section>
            <el-form :model="postForm" ref="postForm" label-width="180px" size="mini" :inline-message="true">
                <div class="mt30 ml15">
                    <el-form-item label="id：">
                        <el-input v-model="postForm.id" maxlength="100" :disabled=true></el-input>
                    </el-form-item>
                    <el-form-item label="title：">
                        <el-input v-model="postForm.title" maxlength="100" :disabled=true></el-input>
                    </el-form-item>
                    <el-form-item label="img：">
                        <el-input v-model="postForm.img" maxlength="100" :disabled=true></el-input>
                    </el-form-item>
                    <el-form-item label="time：">
                        <el-input v-model="postForm.time" maxlength="100" :disabled=true></el-input>
                    </el-form-item>
                    <el-form-item label="type：">
                        <el-input v-model="postForm.type" maxlength="100" :disabled=true></el-input>
                    </el-form-item>
                    <el-form-item label="lookSum：">
                        <el-input v-model="postForm.lookSum" maxlength="100" :disabled=true></el-input>
                    </el-form-item>
                    <el-form-item label="content：">
                        <el-input v-model="postForm.content" maxlength="100" :disabled=true></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </section>
        <div class="mt40 ml40">
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
                    id: '',
                    title: '',
                    img: '',
                    time: '',
                    type: '',
                    lookSum: '',
                    content: ''
                }
            };
        },
        created() {
            let self = this;
            /**
             * 1.接收外界参数
             */
            const id = this.$route.query && this.$route.query.id
            self.queryByPrimaryKey(id)
        },
        watch: {},
        methods: {
            //获取具体的配置
            queryByPrimaryKey(id) {
                let self = this;
                self.$http.get(self.api.queryTBlogByPrimaryKey, {
                    params: {
                        id: id
                    }
                }, function (response) {
                    if (response.code == 0) {
                        self.postForm = response.content;
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
