<template>
    <div class="app-form mt20 ml40">
        <h5 class="form-tit">资源添加</h5>
        <section>
            <el-form :model="postForm" :rules="rules" ref="postForm" label-width="180px" size="mini"
                     :inline-message="true">
                <div class="mt30 ml15">
                    <el-form-item label="文件名称：">
                        <el-input v-model="postForm.fileName" maxlength="100" :disabled=true></el-input>
                    </el-form-item>
                    <el-form-item label="文件类型：">
                        <el-input v-model="postForm.type" maxlength="100" :disabled=true></el-input>
                    </el-form-item>
                    <el-upload
                            class="upload-file"
                            drag
                            :limit=10
                            :action="doUploadUrl"
                            :data="doUploadData"
                            :before-upload="beforeUpload"
                            :auto-upload="false"
                            :on-success="onSuccess"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                    <el-form-item label="文件时间：">
                        <el-input v-model="postForm.createTime" maxlength="100" :disabled=true></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </section>
        <div class="mt40 ml40">
            <el-button type="primary" @click="submitEditForm('postForm')">确定</el-button>
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
                postForm: {
                    fileName: '',
                    type: '',
                    createTime: '',
                    preRelationViewUrl: '',
                },
                status: [{value: 'TRUE', title: 'TRUE'}, {value: 'FALSE', title: 'FALSE'}]
                , doUploadUrl: ''
                , doUploadData: {
                    id: ''
                }
            };
        },
        created() {
            let self = this;
            // self.doUploadData.id = id;
            // self.getResourceFileDetailByFileName(fileName)
        },
        watch: {},
        methods: {

            async beforeUpload(file) {
                let fileName = file.name;
                let self = this;
                let result = true;


                return new Promise((resolve, reject) => {
                    if (result == true) {
                        return resolve(true);
                    } else {
                        return reject(false)
                    }

                });

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
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
