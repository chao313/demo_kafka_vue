/* 设置后台项目名称 */
const BASE_URL = '/demo_kafka';
export default {

    "getCluster": BASE_URL + '/AdminClusterController/getCluster',


    "getBrokerConfigs": BASE_URL + '/AdminBrokerController/getBrokerConfigs',

    "getTopicsResults": BASE_URL + '/AdminTopicController/getTopicsResults',
    "addTopic": BASE_URL + '/AdminTopicController/addTopic',
    "getTopicSize": BASE_URL + '/AdminTopicController/getTopicSize',
    "deleteTopic": BASE_URL + '/AdminTopicController/deleteTopic',
    "getTopicConfigs": BASE_URL + '/AdminTopicController/getTopicConfigs',
    "getTopicDescription": BASE_URL + '/AdminTopicController/getTopicDescription',
    "getAllTopicDescription": BASE_URL + '/AdminTopicController/getAllTopicDescription',
    "clearTopic": BASE_URL + '/AdminTopicController/clearTopic',


    "getAliveConsumerGroupByTopicAndGroupNameContain": BASE_URL + '/AdminConsumerGroupController/getAliveConsumerGroupByTopicAndGroupNameContain',
    "getConsumerGroupDescribe": BASE_URL + '/AdminConsumerGroupController/getConsumerGroupDescribe',
    "deleteConsumerGroup": BASE_URL + '/AdminConsumerGroupController/deleteConsumerGroup',
    "getConsumerGroupOffsets": BASE_URL + '/AdminConsumerGroupController/getConsumerGroupOffsets',
    "getConsumerGroupSize": BASE_URL + '/AdminConsumerGroupController/getConsumerGroupSize',


    "sendForget": BASE_URL + '/ProduceController/sendForget',
    "sendAsync": BASE_URL + '/ProduceController/sendAsync',
    "sendSync": BASE_URL + '/ProduceController/sendSync',


    "getTopicPartitionAndRealOffsetList": BASE_URL + '/ConsumeController/getTopicPartitionAndRealOffsetList',
    "getTopicRealOffsetList": BASE_URL + '/ConsumeController/getTopicRealOffsetList',
    "getTopicPartitionAndRealOffsetListByTopicRegex": BASE_URL + '/ConsumeController/getTopicPartitionAndRealOffsetListByTopicRegex',
    "getTopicPartitionAndRealOffsetDetail": BASE_URL + '/ConsumeController/getTopicPartitionAndRealOffsetDetail',
    "getRecordByTopicPartitionOffset": BASE_URL + '/ConsumeController/getRecordByTopicPartitionOffset',//高级查询(Partition级别)
    "getRecordByScrollId": BASE_URL + '/RedisController/getRecordByScrollId',//高级查询(Partition级别)(添加分页)
    "getRecordByTopic": BASE_URL + '/ConsumeController/getRecordByTopic',//高级查询(Topic级别)
    "updatePartitionToOffset": BASE_URL + '/ConsumeController/updatePartitionToOffset',
    "getRecordEChartsByTopicPartitionOffset": BASE_URL + '/ConsumeController/getRecordEChartsByTopicPartitionOffset',//高级查询柱状图(Partition级别)
    "getRecordEChartsByTopic": BASE_URL + '/ConsumeController/getRecordEChartsByTopic',//高级查询柱状图(Topic级别)
    "getRecordSimpleEChartsByTopicPartitionOffset": BASE_URL + '/ConsumeController/getRecordSimpleEChartsByTopicPartitionOffset',//简单柱状图
    "getRecordTopicSimpleEChartsByTopicOffset": BASE_URL + '/ConsumeController/getRecordTopicSimpleEChartsByTopicOffset',//简单柱状图(Topic级别)
    "getRecordLineEChartsByTopicPartitionOffset": BASE_URL + '/ConsumeController/getRecordLineEChartsByTopicPartitionOffset',//折线图
    "getRecordLineEChartsByTopic": BASE_URL + '/ConsumeController/getRecordLineEChartsByTopic',//折线图(topic级别的)


    "getKafkaBootstrapServers": BASE_URL + '/CommonController/getKafkaBootstrapServers',
    "getAllKafkaBootstrapServers": BASE_URL + '/CommonController/getAllKafkaBootstrapServers',


    "getConsumerGroupOffsetsAndRealOffset": BASE_URL + '/AdminController/getConsumerGroupOffsetsAndRealOffset',
    "getConsumerGroupOffsetsAndRealOffsetByTopicAndPartition": BASE_URL + '/AdminController/getConsumerGroupOffsetsAndRealOffsetByTopicAndPartition',
    "getConsumerGroupByTopicAndGroupNameContain": BASE_URL + '/AdminController/getConsumerGroupByTopicAndGroupNameContain',


    /**
     * ConsumeNoGroupController
     */
    "getTopicPartitionEffectOffset": BASE_URL + '/ConsumeNoGroupController/getTopicPartitionEffectOffset',
    "getTopicEffectOffset": BASE_URL + '/ConsumeNoGroupController/getTopicEffectOffset',//获取topic的有效数据
    /**
     * wind专用
     */
    "sendOriginalFile": BASE_URL + '/WindController/sendOriginalFile',
    "sendBusinessFile": BASE_URL + '/WindController/sendBusinessFile',


    /**
     * AdminPartitionController
     */
    "increasePartitions": BASE_URL + '/AdminPartitionController/increasePartitions',//提高分区数量

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
