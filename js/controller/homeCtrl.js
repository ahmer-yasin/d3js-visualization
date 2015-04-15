/**
 * Created by rw on 3/24/15.
 */
(function(){
    'use strict';

    app.controller('homeCtrl',function($scope, $http, dataFactory, ngTableParams, $timeout){
        $http.get('config.json')
            .success(function(data){
                $scope.jsonData = data;
                $scope.title = "Division";
                $scope.question = "Question";
                $scope.index = 0;
                $scope.dataObj = {
                    "author":[],
                    "section":[],
                    "keywords":[]
                };
                $scope.result ={};
                $scope.index = 0;
                $scope.words;
                $scope.Search = '';
                $scope.listData  = [];
                $scope.devisions = [];
                $scope.questions = [];
                $scope.result    = [];
                $scope.tags      = [];
                $scope.changeIndex= function(index){
                    $scope.getFilter();
                };
                var conditions = {};
                var sentiments = {};
                $scope.paginationFunc = function(){
                    if (angular.isObject($scope.result) && Object.keys($scope.result).length) {
                                $scope.tableParams = new ngTableParams({
                                    page: 1,            // show first page
                                    count: 10           // count per page
                                },{
                                    total: $scope.result.length, // length of data
                                    getData: function($defer, params) {
                                        $defer.resolve($scope.result.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                    }
                                });
                            }
                };
                $scope.getFirstTime = function(){
                    $http.get($scope.jsonData.devisions+$scope.jsonData.pageSize)
                        .success(function(res){
                            if(res.facets.facet['@name'] == 'division'){
                                angular.forEach(res.facets.facet.int,function(value,key){
                                    $scope.devisions.push(value['@name']);
                                })
                            }
                            angular.forEach(res.results.result,function(v,k){
                                $scope.result.push(v)
                            });
                            angular.forEach($scope.result,function(v,key){
                                if(angular.isObject(v)){
                                    var obj = {};
                                    angular.forEach(v,function(v,k){
                                        if(k.startsWith('Q')){
                                            if(k.indexOf('sentiment') != -1 && k.indexOf('sentiment') == 3 ){
                                                sentiments[k] = v;
                                                conditions[key] = sentiments;
                                            }else{
                                                obj[k] = v;
                                            }
                                        }
                                    });
                                    $scope.questions.push(obj);
                                }
                            });
                            if (angular.isObject($scope.result) && Object.keys($scope.result).length) {
                                $scope.tableParams = new ngTableParams({
                                    page: 1,            // show first page
                                    count: 10           // count per page
                                },{
                                    total: $scope.result.length, // length of data
                                    getData: function($defer, params) {
                                        $defer.resolve($scope.result.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                    }
                                });
                            }
                            $scope.questionArr =$scope.jsonData.questionArray;
                        })
                        .error(function(err){
                            console.log(err)
                        });
                };
                $scope.getFirstTime();
                $scope.config = {
                    visible: true, // default: true
                    extended: false, // default: false
                    disabled: false, // default: false
                    autorefresh: true, // default: true
                    refreshDataOnly: true // default: false
                };
                $scope.labels = [];
                $scope.word = [];
                $scope.data = [];
                $scope.colors = ["#bb4e11", "#52041b", "#ba7b18", "#a13a17", "#4e0310", "#bb2b11","#a1191a"];
                $scope.wordCloudObj = function(obj){
                    $scope.word = [];
                    angular.forEach(obj,function(v,k){
                        if(v){
                            $scope.word.push({'text': v['@name'],weight: v['#text'] ,
                                handlers : {click: function() {
                                    if(!containsObject({text:v['@name']},$scope.tags)){
                                        $scope.tags.push({text:v['@name']});
                                        $scope.getFilter(v['@name'],'&f.Q4.filter=');
                                    }else{
                                        console.log('filter already exists');
                                    }
                                }
                                }
                            });
                        }
                    });
                };
                $scope.loadTags = function(item){
                    $scope.getFilter();
                };
                $scope.pieChartFunc = function(obj,amount){
                    $scope.labels = [];
                    $scope.data = [];
                    if(angular.isArray(obj)) {
                        angular.forEach(obj, function (val, k) {
                            $scope.data.push(val['#text'] / amount * 100);
                            $scope.labels.push(val['@name']);

                        });
                    }
                    else{
                        $scope.data.push(obj['#text']/amount * 100);
                        $scope.labels.push(obj['@name']);
                    }
                };
                $scope.onClick = function (points, evt) {
                    if(points[0].label){

                        if(!containsObject({text:points[0].label},$scope.tags)){
                           $scope.tags.push({text:points[0].label});
                            $scope.getFilter(points[0].label, '&f.Q4.sentiment.filter=');
                        }else{
                            console.log('filter already exist');
                        }
                    }
                    else{
                        console.log('please chose right keywords');
                    }
                };
                $scope.getFilter = function(fil,type){
                    var facetFilter='';
                    if($scope.tags.length){
                        angular.forEach($scope.tags,function(val,key){
                            if(val['text'] == 'positive'||val['text'] == 'negative'||val['text'] == 'neutral'){
                                facetFilter += '&f.'+$scope.q+'.sentiment.filter='+val['text'];
                            }else{
                                facetFilter += '&f.'+$scope.q+'.filter='+val['text'];
                            }
                        });
                    }
                    var filter = '';
                    var facet;
                    $scope.result = [];
                    if($scope.author){
                        facet = 'division:'+$scope.author;
                    }else{
                        facet = '*';
                    }
                    if(type && fil){
                        filter = type+fil;
                    }

                    if($scope.q  == 'Q4'){
                        facet += $scope.jsonData.q4;
                    }
                    if($scope.q  == 'Q5'){
                        facet += $scope.jsonData.q5;
                    }
                    $http.get($scope.jsonData.filterDivisionUrl+facet+$scope.jsonData.pageSize+'&f.'+$scope.q+'.size='+$scope.jsonData.facetSize+filter+facetFilter)
                        .success(function(res){
                            console.log(Object.keys(res.results.result).length);
                            if(res.results.result)
                            angular.forEach(res.results.result,function(v){
                                $scope.result.push(v);
                            });
                            angular.forEach(res.facets,function(val){
                                if(val['@name'] == "Q4.sentiment" || val['@name'] == "Q5.sentiment"){
                                    $scope.pieChartFunc(val.int,val['@count']);
                                }
                                if(val["@name"] == "Q4" || val["@name"] == "Q5"){
                                    $scope.wordCloudObj(val.int);
                                }
                            });
                            if (angular.isObject($scope.result) && Object.keys($scope.result).length) {
                                $scope.tableParams = new ngTableParams({
                                    page: 1,            // show first page
                                    count: 10           // count per page
                                },{
                                    total: $scope.result.length, // length of data
                                    getData: function($defer, params) {
                                        $defer.resolve($scope.result.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                    }
                                });
                            }
                         })
                        .error(function(err){
                            console.log(err)
                        });
                };

                var conditions = {};

                $scope.QuestionFilter = function(){
                    $scope.result = [];
                    var facetFilter='';
                    if($scope.tags.length){
                        angular.forEach($scope.tags,function(val,key){
                            facetFilter += '&f.'+$scope.q+'.filter='+val['text'];
                        });
                        console.log(facetFilter);
                    }

                    var facet;
                    if($scope.author){
                        facet = 'division:'+$scope.author;
                    }else{
                        facet = '*';
                    }
                    if(this.q == 'Q4'){
                        facet += $scope.jsonData.q4;
                    }
                    if(this.q == 'Q5'){
                        facet += $scope.jsonData.q5;
                    }
                    $http.get($scope.jsonData.filterDivisionUrl+facet +$scope.jsonData.pageSize+facetFilter)
                        .success(function(res){
                            angular.forEach(res.facets,function(val){
                                if(val['@name'] == "Q4.sentiment" || val['@name'] == "Q5.sentiment"){
                                    $scope.pieChartFunc(val.int,val['@count']);
                                }
                                if(val["@name"] == "Q4" ||val["@name"] == "Q5"){
                                    $scope.wordCloudObj(val.int);
                                }
                            });
                            angular.forEach(res.results.result,function(v,k){
                                $scope.result.push(v);
                            });
                            $scope.questions = [];
                            angular.forEach($scope.result,function(v,key){
                                if(angular.isObject(v)){
                                    var obj = {};
                                    angular.forEach(v,function(v,k){
                                        if(k.startsWith('Q')){
                                            if(k.indexOf('sentiment') != -1 && k.indexOf('sentiment') == 3 ){
                                                sentiments[k] = v;
                                                conditions[key] = sentiments;
                                            }else{
                                                obj[k] = v;
                                            }
                                        }
                                    });
                                    $scope.questions.push(obj);
                                }
                            });
                            if (angular.isObject($scope.result) && Object.keys($scope.result).length) {
                                $scope.tableParams = new ngTableParams({
                                    page: 1,            // show first page
                                    count: 10           // count per page
                                },{
                                    total: $scope.result.length, // length of data
                                    getData: function($defer, params) {
                                        $defer.resolve($scope.result.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                    }
                                });
                            }
                        })
                        .error(function(err){
                            console.log(err)
                        });
                };
            })
            .error(function(err){
                console.log(err);
            });
        if (typeof String.prototype.startsWith != 'function') {
            // see below for better implementation!
            String.prototype.startsWith = function (str){
                return this.indexOf(str) === 0;
            };
        }
        function containsObject(obj, list) {
            for (var x in list) {
                if (list.hasOwnProperty(x) && list[x]['text'] === obj['text']) {
                    return true;
                }
            }

            return false;
        }
    });
}());



