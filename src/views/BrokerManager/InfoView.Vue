<template>
    <div class="app-container">
        <div class="mt20">
            <el-form :inline="true" size="mini">
                                <el-form-item label="id">
                    <el-input v-model="search.id" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="title">
                    <el-input v-model="search.title" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="img">
                    <el-input v-model="search.img" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="time">
                    <el-input v-model="search.time" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="type">
                    <el-input v-model="search.type" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="lookSum">
                    <el-input v-model="search.lookSum" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="content">
                    <el-input v-model="search.content" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="el-button-search" @click="searchEvent()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="el-button-search" @click="searchRest()">重置
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="el-button-search" @click="routerToAdd()">添加
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="app-list">
            <div class="app-tab">
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <!--显示的字段 - 英文-->
                        <th>id</th>
                        <th>title</th>
                        <th>img</th>
                        <th>time</th>
                        <th>type</th>
                        <th>lookSum</th>
                        <th>content</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr>
                        <th>序号</th>
                        <!--显示的字段 - 中文-->
                        <th></th>
                        <th>博客标题</th>
                        <th>博客的图片</th>
                        <th>博客时间</th>
                        <th>博客类别</th>
                        <th>博客浏览量</th>
                        <th>博客内容</th>
                        <th>操作</th>
                    </tr>

                    <tbody>
                    <tr v-for="(info,index) in dataList">
                        <td>{{index+1}}</td>
                        <!--显示的字段 - 具体数据-->
                        <td>{{Info.id}}</td>
                        <td>{{Info.title}}</td>
                        <td>{{Info.img}}</td>
                        <td>{{Info.time}}</td>
                        <td>{{Info.type}}</td>
                        <td>{{Info.lookSum}}</td>
                        <td>{{Info.content}}</td>
                        <td>
                            <span @click="routerToView(Info.id)">查看</span>
                            <span @click="routerToEdit(Info.id)">编辑</span>
                            <span @click="deleteByPrimaryKey(Info.id)">删除</span>
                        </td>
                    </tr>
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
                policyIdList: [],
                policyId: '',
                statuses: [{value: 1, title: '生效'}, {value: 2, title: '失效'}, {value: null, title: '全部'}],
                status: '',
                dataList: [],
                total: -1,
                currentPage: 1,
                pageSize: 10,
                start: '',
                end: '',
                plateNo: '',
                exitStation: '',
                exitStationList: [],
                resultDetail: {},
                viewDialogVisible: false,
                startTime: '',
                endTime: '',
                timeRange: [],
                registId: '',
                jsonData: '',
                search:{
                  id:'',
                  title:'',
                  img:'',
                  time:'',
                  type:'',
                  lookSum:'',
                  content:''
                }
            }
        },
        mounted() {
            let self = this;
        },
        created() {
            // this.queryBase();
        },
        watch: {},
        methods: {//获取具体的配置
            queryBase() {
                let self = this;
                var params = new FormData();
                if(self.search.id != null && self.search.id !=''){
                    params.append("id",self.search.id);
                }
                if(self.search.title != null && self.search.title !=''){
                    params.append("title",self.search.title);
                }
                if(self.search.img != null && self.search.img !=''){
                    params.append("img",self.search.img);
                }
                if(self.search.time != null && self.search.time !=''){
                    params.append("time",self.search.time);
                }
                if(self.search.type != null && self.search.type !=''){
                    params.append("type",self.search.type);
                }
                if(self.search.lookSum != null && self.search.lookSum !=''){
                    params.append("lookSum",self.search.lookSum);
                }
                if(self.search.content != null && self.search.content !=''){
                    params.append("content",self.search.content);
                }
                var paramsJson = {};
                params.forEach((value, key) => paramsJson[key] = value);
                self.$http.post(self.api.queryBaseTBlog,
                paramsJson,{

                },function (response) {
                    self.dataList = response.content;
                }, function (response) {
                    //失败回调
                    self.$message({
                        type: 'warning',
                        message: '请求异常',
                        duration: 1000
                    });
                })

            },
            deleteByPrimaryKey(id) {
                let self = this;
                this.$confirm('是否删除该条数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    self.$http.get(self.api.deleteTBlogByPrimaryKey
                        ,{
                     params: {
                       id:id 
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
                            self.queryBase();
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
            routerToView(id) {
                //跳转携带参数
                let queryStr="";
                    queryStr = queryStr + "id=" + id + "";
                window.open("#/TBlogModuleView" + "?"+queryStr, '_self');
            },
            routerToEdit(id) {
                //跳转携带参数
                let queryStr="";
                    queryStr = queryStr + "id=" + id + "";
                //跳转携带参数
                window.open("#/TBlogModuleEdit"+ "?"+queryStr, '_self');
            },
            routerToAdd() {
                window.open("#/TBlogModuleAdd", '_self');
            },
            searchEvent(){
                this.queryBase();
            },
            searchRest(){
                let self = this;
                self.search.id = '';
                self.search.title = '';
                self.search.img = '';
                self.search.time = '';
                self.search.type = '';
                self.search.lookSum = '';
                self.search.content = '';
                this.queryBase();
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
