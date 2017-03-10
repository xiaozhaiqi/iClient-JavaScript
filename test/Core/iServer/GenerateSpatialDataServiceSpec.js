﻿require('../../../src/Core/iServer/GenerateSpatialDataService');

var completedEventArgsSystem = null;
var failedEventArgsSystem = null;

var url = "http://localhost:8090/iserver/services/spatialanalyst-changchun/restjsr/spatialanalyst";
var options = {
    eventListeners: {
        processCompleted: generateSpatialDataCompleted,
        processFailed: generateSpatialDataFailed
    }
};
function initGenerateSpatialDataService() {
    return new SuperMap.REST.GenerateSpatialDataService(url, options);
}
function generateSpatialDataCompleted(completedEventArgs){
    completedEventArgsSystem = completedEventArgs;
}
function generateSpatialDataFailed(failedEventArgs){
    failedEventArgsSystem = failedEventArgs;
}


describe('testGenerateSpatialDataService_processAsync',function(){
    var originalTimeout;
    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });
    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    //点事件表数据集动态分段,并设置期望返回记录数2
    it('PointEventTable',function(done){
        var dataRtnOption = new DataReturnOption({
            expectCount: 2,
            dataset: "generateSpatialData",
            deleteExistResultDataset: true,
            dataReturnMode: DataReturnMode.RECORDSET_ONLY
        });
        var generateSpatialDataParameters = new GenerateSpatialDataParameters({
            routeTable: "RouteDT_road@Changchun",
            routeIDField: "RouteID",
            eventTable: "PointEventTabDT@Changchun",
            eventRouteIDField: "RouteID",
            measureField: "measure",
            measureStartField: null,
            measureEndField: null,
            measureOffsetField: "",
            errorInfoField: "",
            dataReturnOption: dataRtnOption
        });
        var generateSpatialDataService = initGenerateSpatialDataService();
        generateSpatialDataService.processAsync(generateSpatialDataParameters);

        setTimeout(function(){
            try{
                expect(generateSpatialDataService).not.toBeNull();
                var generateSpatialDataResult = completedEventArgsSystem.result;
                expect(generateSpatialDataResult).not.toBeNull();
                expect(generateSpatialDataResult.type).toBe("FeatureCollection");
                expect(generateSpatialDataResult.features.length).toEqual(2);
                generateSpatialDataService.destroy();
                expect(generateSpatialDataService.EVENT_TYPES).toBeNull();
                expect(generateSpatialDataService.events).toBeNull();
                expect(generateSpatialDataService.eventListeners).toBeNull();
                generateSpatialDataParameters.destroy();
                done();
            }catch (exception){
                expect(false).toBeTruthy();
                console.log("FieldStatisticService_" + exception.name + ":" + exception.message);
                generateSpatialDataService.destroy();
                generateSpatialDataParameters.destroy();
                done();
            }
        },6000)
    });

    //点事件表数据集动态分段,设置deleteExistResultDataset=false，并且设置一个已存在的数据集名称
    it('PointEventTable_deleteExistResultDataset_false',function(done){
        var dataRtnOption = new DataReturnOption({
            expectCount: 2,
            dataset: "generateSpatialData",
            deleteExistResultDataset: false,
            dataReturnMode: DataReturnMode.DATASET_AND_RECORDSET
        });
        var generateSpatialDataParameters = new GenerateSpatialDataParameters({
            routeTable: "RouteDT_road@Changchun",
            routeIDField: "RouteID",
            eventTable: "PointEventTabDT@Changchun",
            eventRouteIDField: "RouteID",
            measureField: "measure",
            measureStartField: null,
            measureEndField: null,
            measureOffsetField: "",
            errorInfoField: "",
            dataReturnOption: dataRtnOption
        });
        var generateSpatialDataService = initGenerateSpatialDataService();
        generateSpatialDataService.processAsync(generateSpatialDataParameters);

        setTimeout(function(){
            try{
                expect(failedEventArgsSystem.error.errorMsg).not.toBeNull();
                expect(failedEventArgsSystem.error.code).toEqual(400);
                generateSpatialDataService.destroy();
                expect(generateSpatialDataService.EVENT_TYPES).toBeNull();
                expect(generateSpatialDataService.events).toBeNull();
                expect(generateSpatialDataService.eventListeners).toBeNull();
                generateSpatialDataParameters.destroy();
                done();
            }catch (exception){
                expect(false).toBeTruthy();
                console.log("FieldStatisticService_" + exception.name + ":" + exception.message);
                generateSpatialDataService.destroy();
                generateSpatialDataParameters.destroy();
                done();
            }
        },6000)
    });

    //线事件表数据集动态分段,并设置期望返回记录数2
    it('LinearEventTable',function(done){
        var generateSpatialDataService = initGenerateSpatialDataService();
        var dataRtnOption = new DataReturnOption({
            expectCount: 2,
            dataset: "generateSpatialData",
            deleteExistResultDataset: true,
            dataReturnMode: DataReturnMode.RECORDSET_ONLY
        });
        var generateSpatialDataParameters = new GenerateSpatialDataParameters({
            routeTable: "RouteDT_road@Changchun",
            routeIDField: "RouteID",
            eventTable: "LinearEventTabDT@Changchun",
            eventRouteIDField: "RouteID",
            measureField: "",
            measureStartField: "LineMeasureFrom",
            measureEndField: "LineMeasureTo",
            measureOffsetField: "",
            errorInfoField: "",
            dataReturnOption: dataRtnOption
        });
        generateSpatialDataService.processAsync(generateSpatialDataParameters);

        setTimeout(function(){
            try{
                var generateSpatialDataResult = completedEventArgsSystem.result;
                expect(generateSpatialDataService).not.toBeNull();
                expect(generateSpatialDataResult).not.toBeNull();
                expect(generateSpatialDataResult.type).toBe("FeatureCollection");
                expect(generateSpatialDataResult.features.length).toEqual(2);
                generateSpatialDataService.destroy();
                expect(generateSpatialDataService.EVENT_TYPES).toBeNull();
                expect(generateSpatialDataService.events).toBeNull();
                expect(generateSpatialDataService.eventListeners).toBeNull();
                generateSpatialDataParameters.destroy();
                done();
            }catch (exception){
                expect(false).toBeTruthy();
                console.log("FieldStatisticService_" + exception.name + ":" + exception.message);
                generateSpatialDataService.destroy();
                generateSpatialDataParameters.destroy();
                done();
            }
        },6000)
    });

    //线事件表数据集动态分段,设置deleteExistResultDataset=false，并且设置一个已存在的数据集名称
    it('LinearEventTable_deleteExistResultDataset_false',function(done){
        var generateSpatialDataService = initGenerateSpatialDataService();
        var dataRtnOption = new DataReturnOption({
            expectCount: 1000,
            dataset: "generateSpatialData",
            deleteExistResultDataset: false,
            dataReturnMode: SuperMap.REST.DataReturnMode.DATASET_AND_RECORDSET
        });
        var generateSpatialDataParameters = new GenerateSpatialDataParameters({
            routeTable: "RouteDT_road@Changchun",
            routeIDField: "RouteID",
            eventTable: "LinearEventTabDT@Changchun",
            eventRouteIDField: "RouteID",
            measureField: "",
            measureStartField: "LineMeasureFrom",
            measureEndField: "",
            measureOffsetField: "",
            errorInfoField: "",
            dataReturnOption: dataRtnOption
        });
        generateSpatialDataService.processAsync(generateSpatialDataParameters);

        setTimeout(function(){
            try{
                expect(failedEventArgsSystem.error.code).toEqual(400);
                expect(failedEventArgsSystem.error.errorMsg).not.toBeNull();
                generateSpatialDataService.destroy();
                expect(generateSpatialDataService.EVENT_TYPES).toBeNull();
                expect(generateSpatialDataService.events).toBeNull();
                expect(generateSpatialDataService.eventListeners).toBeNull();
                generateSpatialDataParameters.destroy();
                done();
            }catch (exception){
                expect(false).toBeTruthy();
                console.log("FieldStatisticService_" + exception.name + ":" + exception.message);
                generateSpatialDataService.destroy();
                generateSpatialDataParameters.destroy();
                done();
            }
        },6000)
    });
});

