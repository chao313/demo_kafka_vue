<template>
    <div class="app-form mt20 ml40">
        <h5 class="form-tit">注册配置编辑</h5>
        <el-table :data="tableData3" tooltip-effect="dark" style="width: 100%"  
                  @select="selectionChange"   @selection-change="handleSelectionChange">

               
            <el-table-column type="selection" width="55">

                   
            </el-table-column>

               
            <el-table-column label="日期" width="120">

                     
                <template slot-scope="scope">{{ scope.row.date }}</template>

                   
            </el-table-column>

               
            <el-table-column prop="name" label="姓名" width="120">

                   
            </el-table-column>

               
            <el-table-column prop="address" label="地址" show-overflow-tooltip>

                   
            </el-table-column>

             
        </el-table>

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

                tableData3: [{

                    date: '2016-05-03',

                    name: '王小虎',

                    address: '上海市普陀区金沙江路 1518 弄'

                }, {

                    date: '2016-05-02',

                    name: '王小虎',

                    address: '上海市普陀区金沙江路 1518 弄'

                }, {

                    date: '2016-05-04',

                    name: '王小虎',

                    address: '上海市普陀区金沙江路 1518 弄'

                }, {

                    date: '2016-05-01',

                    name: '王小虎',

                    address: '上海市普陀区金沙江路 1518 弄'

                }, {

                    date: '2016-05-08',

                    name: '王小虎',

                    address: '上海市普陀区金沙江路 1518 弄'

                }, {

                    date: '2016-05-06',

                    name: '王小虎',

                    address: '上海市普陀区金沙江路 1518 弄'

                }, {

                    date: '2016-05-07',

                    name: '王小虎',

                    address: '上海市普陀区金沙江路 1518 弄'

                }],

                multipleSelection: [],

                a: [],

                b: [],

            }

        },

        methods: {

            toggleSelection(rows) {

                if (rows) {

                    rows.forEach(row => {

                        this.$refs.multipleTable.toggleRowSelection(row);

                    });

                } else {

                    this.$refs.multipleTable.clearSelection();

                }

            },

            selectionChange(selection, row) {

                this.a = selection;

                this.b = row;

                //console.log(selection, row);

                //  console.log(JSON.stringify( this.a[this.a.length-1]));

                if (this.a.length === 0) {

                    console.log("Un-check");

                } else {

                    console.log("checked");

                    //console.log(this.b);

                    // console.log(JSON.stringify( this.b));

                    console.log("date: " + this.b.date);

                    console.log();

                    console.log();

                    console.log();

                    console.log();

                }

            },


            handleSelectionChange(val) {

                this.multipleSelection = val;

                // console.log(JSON.stringify( this.multipleSelection[this.multipleSelection.length-1]));

            }

        }

    }
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
