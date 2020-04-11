/* 设置后台项目名称 */
const BASE_URL = '/demo_kafka';
export default {

    "getCluster": BASE_URL + '/AdminClusterController/getCluster',


    "getBrokerConfigs": BASE_URL + '/AdminBrokerController/getBrokerConfigs',

    "getTopicsResults": BASE_URL + '/AdminTopicController/getTopicsResults',
    "addTopic": BASE_URL + '/AdminTopicController/addTopic',
    "deleteTopic": BASE_URL + '/AdminTopicController/deleteTopic',
    "getTopicConfigs": BASE_URL + '/AdminTopicController/getTopicConfigs',


    /*后台的URL*/
    /** 资源管理 */

    "addResourceFile": BASE_URL + '/ResourceController/addFile',
    "existResourceFileByName": BASE_URL + '/ResourceController/existFileByName',
    "deleteResourceFileByName": BASE_URL + '/ResourceController/deleteFileByName',
    "getResourceFiles": BASE_URL + '/ResourceController/getFiles',
    "getResourceFileDetails": BASE_URL + '/ResourceController/getFileDetails',
    "getResourceFileDetailByFileName": BASE_URL + '/ResourceController/getFileDetailByFileName',
    "downloadByResourceFileName": BASE_URL + '/ResourceController/downloadByFileName',
    "preByResourceFileName": BASE_URL + '/ResourceController/preByFileName',


    /* TBlog */
    /* 根据主键更新TBlog */
    "updateTBlogByPrimaryKey": BASE_URL + '/TBlogController/updateByPrimaryKey',
    /* 单条插入TBlog */
    "insertTBlog": BASE_URL + '/TBlogController/insert',
    /* 根据主键删除TBlog */
    "deleteTBlogByPrimaryKey": BASE_URL + '/TBlogController/deleteByPrimaryKey',
    /* 分页查询TBlog */
    "queryBasePageHelperTBlog": BASE_URL + '/TBlogController/queryBasePageHelper',
    /* 根据主键查询TBlog */
    "queryTBlogByPrimaryKey": BASE_URL + '/TBlogController/queryByPrimaryKey',
    /* 多条件查询TBlog */
    "queryBaseTBlog": BASE_URL + '/TBlogController/queryBase',
    /* 批量插入TBlog */
    "insertsTBlog": BASE_URL + '/TBlogController/inserts',
    /* 多条件更新TBlog */
    "updateBaseTBlog": BASE_URL + '/TBlogController/updateBase'


}