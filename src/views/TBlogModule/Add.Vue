<template>
    <div class="app-form mt20 ml40">
        <h5 class="form-tit">注册配置编辑</h5>
        <section>
            <el-form :model="postForm" ref="postForm" label-width="180px" size="mini" :inline-message="true">
                <div class="mt30 ml15">
                    <el-form-item label="id：">
                        <el-input v-model="postForm.id" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="title：">
                        <el-input v-model="postForm.title" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="img：">
                        <el-input v-model="postForm.img" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="time：">
                        <el-input v-model="postForm.time" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="type：">
                        <el-input v-model="postForm.type" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="lookSum：">
                        <el-input v-model="postForm.lookSum" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="content：">
                        <el-input v-model="postForm.content" maxlength="100"></el-input>
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
                    id: '',
                    title: '',
                    img: '',
                    time: '',
                    type: '',
                    lookSum: '',
                    content: ''
                }
            }
                ;
        },
        created() {

        },
        watch: {},
        methods: {
            submitAddForm(formName) {
                let self = this;
                let params = new FormData();

                params.append('id', self.postForm.id);
                params.append('title', self.postForm.title);
                params.append('img', self.postForm.img);
                params.append('time', self.postForm.time);
                params.append('type', self.postForm.type);
                params.append('lookSum', self.postForm.lookSum);
                params.append('content', self.postForm.content);
                /**
                 * 转json
                 */
                var paramsJson = {};
                params.forEach((value, key) => paramsJson[key] = value);

                self.$http.post(self.api.insertTBlog, paramsJson, {
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
                                        path: '/TBlogModuleList'
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
                            type: 'error',
                            message: response.msg,
                            duration: 2000
                        });
                    }
                }, function (response) {
                    //失败回调
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
