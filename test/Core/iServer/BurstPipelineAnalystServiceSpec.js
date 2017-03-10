require('../../../src/Core/iServer/BurstPipelineAnalystService');

var serviceFailedEventArgsSystem = null,
    serviceCompletedEventArgsSystem = null;
var url = "http://localhost:8090/iserver/services/transportationanalyst-sample/rest/networkanalyst/RoadNet@Changchun";
var options = {
    eventListeners:{
        "processCompleted": analyzeCompleted,
        'processFailed': analyzeFailed
    }};
function initBurstPipelineAnalystService() {
    return new SuperMap.REST.BurstPipelineAnalystService(url, options);
}
function analyzeFailed(serviceFailedEventArgs) {
    serviceFailedEventArgsSystem = serviceFailedEventArgs;
}
function analyzeCompleted(analyseEventArgs) {
    serviceCompletedEventArgsSystem = analyseEventArgs;
}

describe('testBurstPipelineAnalystService_constructor',function(){
    it('constructor_Default',function(){
        var burstPipelineAnalystService = new SuperMap.REST.BurstPipelineAnalystService();
        expect(burstPipelineAnalystService).not.toBeNull();
        expect(burstPipelineAnalystService.CLASS_NAME).toBe("SuperMap.REST.BurstPipelineAnalystService");
        var burstPipelineAnalystParams = new BurstPipelineAnalystParameters();
        expect(burstPipelineAnalystParams.sourceNodeIDs).toBeNull();
        expect(burstPipelineAnalystParams.edgeID).toBeNull();
        expect(burstPipelineAnalystParams.nodeID).toBeNull();
        expect(burstPipelineAnalystParams.isUncertainDirectionValid).toBeFalsy();
    });

    it('constructor and destroy',function(){
        var burstPipelineAnalystService = initBurstPipelineAnalystService();
        burstPipelineAnalystService.events.on({"processCompleted": analyzeCompleted});
        var burstPipelineAnalystParams = new BurstPipelineAnalystParameters();
        burstPipelineAnalystParams.edgeID = 124;
        burstPipelineAnalystParams.isUncertainDirectionValid = true;
        expect(burstPipelineAnalystParams.sourceNodeIDs).toBeNull();
        expect(burstPipelineAnalystParams.edgeID).toEqual(124);
        expect(burstPipelineAnalystParams.nodeID).toBeNull();
        expect(burstPipelineAnalystParams.isUncertainDirectionValid).toBeTruthy();

        burstPipelineAnalystService.destroy();
        expect(burstPipelineAnalystService.EVENT_TYPES).toBeNull();
        expect(burstPipelineAnalystService.events).toBeNull();

        burstPipelineAnalystParams.destroy();
        expect(burstPipelineAnalystParams.sourceNodeIDs).toBeNull();
        expect(burstPipelineAnalystParams.edgeID).toBeNull();
        expect(burstPipelineAnalystParams.nodeID).toBeNull();
        expect(burstPipelineAnalystParams.isUncertainDirectionValid).toBeFalsy();
    })
});

describe('testBurstPipelineAnalystService_processAsync',function(){
    var originalTimeout;
    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        serviceFailedEventArgsSystem = null;
        serviceCompletedEventArgsSystem = null;
    });
    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    //参数不存在
    it('noParams',function(done){
        var burstPipelineAnalystService = initBurstPipelineAnalystService();
        burstPipelineAnalystService.processAsync();

        setTimeout(function(){
            try{
                expect(serviceFailedEventArgsSystem).toBeNull();
                expect(serviceCompletedEventArgsSystem).toBeNull();
                burstPipelineAnalystService.destroy();
                done();
            }catch(exception){
                expect(false).toBeTruthy();
                console.log("BurstPipelineAnalystService_" + exception.name + ":" + exception.message);
                burstPipelineAnalystService.destroy();
                done();
            }
        },6000);
    });

    //正确返回结果
    it('pass',function(done){
        var burstPipelineAnalystService = initBurstPipelineAnalystService();
        var burstPipelineAnalystParams = new BurstPipelineAnalystParameters({
            sourceNodeIDs:[1,2],
            edgeID:3434,
            nodeID:null,
            isUncertainDirectionValid:true
        });
        burstPipelineAnalystService.processAsync(burstPipelineAnalystParams);

            setTimeout(function(){
            try{
                var analystResult = serviceCompletedEventArgsSystem.result ;
                expect(analystResult).not.toBeNull();
                expect(analystResult.succeed).toBeTruthy();
                expect(analystResult.criticalNodes.length).toEqual(1);
                expect(analystResult.edges.length).toBeGreaterThan(0);
                expect(analystResult.normalNodes.length).toEqual(0);
                burstPipelineAnalystService.destroy();
                burstPipelineAnalystParams.destroy();
                done();
            }catch(exception){
                expect(false).toBeTruthy();
                console.log("BurstPipelineAnalystService_" + exception.name + ":" + exception.message);
                burstPipelineAnalystService.destroy();
                burstPipelineAnalystParams.destroy();
                done();
            }
        },6000)
    });
});