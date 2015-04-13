/**
 * Created by rw on 3/24/15.
 */
(function(){
    'use strict';

    app.controller('homeCtrl',function($scope, $http, dataFactory, ngTableParams){

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
                $scope.listData  = [];
                $scope.devisions = [];
                $scope.questions = [];
                $scope.result    = [];
                $scope.changeIndex= function(index){
                    $scope.questionArr =$scope.jsonData.questionArray;
                    $scope.index = index;
//                    angular.forEach($scope.result,function(v,k){
//                        if(v.division.toLowerCase() == $scope.devisions[index]){
//                            angular.forEach($scope.questions[k],function(v,key){
//                                if(key == 'Q4' ||key == 'Q5'){
//                                    $scope.questionArr[key] = v;
//                                };
//                            });
//                        }
//                    })
                };
                var conditions = {};
                var sentiments = {};
                $scope.getFirstTime = function(){
                    $http.get($scope.jsonData.devisions)
                        .success(function(res){
                            if(res.facets.facet['@name'] == 'division'){
                                angular.forEach(res.facets.facet.int,function(value,key){
                                    $scope.devisions.push(value['@name']);
                                })
                            }
                            angular.forEach(res.results.result,function(v,k){
                                $scope.result.push(v)
                            });
                            if (angular.isObject($scope.result) && Object.keys($scope.result).length) {
                                console.log(Object.keys($scope.result).length);
                                $scope.tableParams = new ngTableParams({
                                    page: 1,            // show first page
                                    count: 3           // count per page
                                },{
                                    total: $scope.result.length, // length of data
                                    getData: function($defer, params) {
                                        $defer.resolve($scope.result.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                    }
                                });
                            }
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
                            $scope.changeIndex(0);
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
                            $scope.word.push({'text': v['@name'],weight: v['#text']/*10 + Math.random() * 90*/ , handlers : {click: function() { $scope.getFilter(v['@name'],'&f.Q4.filter=')}}});
                        }
                    });
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
                        console.log(points[0].label);
                        $scope.getFilter(points[0].label, '&f.Q4.sentiment.filter=');
                    }
                    else{
                        console.log('please chose right keywords');
                    }
                };
                $scope.getFilter = function(filter,type){
                    var facet;
                    var filter = type+filter;
                    if($scope.q  == 'Q4'){
                        facet = $scope.jsonData.q4;
                    }
                    if($scope.q  == 'Q5'){
                        facet = $scope.jsonData.q5;
                    }
                    $http.get($scope.jsonData.api_domain+facet+filter)
                        .success(function(res){
                            console.log(res);
                            angular.forEach(res.facets,function(val,key){
                                if(val['@name'] == "Q4.sentiment" || val['@name'] == "Q5.sentiment"){
                                    $scope.pieChartFunc(val.int,val['@count']);
                                }
                                if(val["@name"] == "Q4" || val["@name"] == "Q5"){
                                    $scope.wordCloudObj(val.int);
                                }
                            });
                            angular.forEach(res.results.result,function(v,k){
                                $scope.result.push(v)
                            });
                            if (angular.isObject($scope.result) && Object.keys($scope.result).length) {
                                $scope.tableParams = new ngTableParams({
                                    page: 1,            // show first page
                                    count: 3           // count per page
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
                $scope.divisionFilter = function(){
                    console.log(this.author);
                };
                var conditions = {};

                $scope.QuestionFilter = function(){
                    var facet;
                    if(this.q == 'Q4'){
                        facet = $scope.jsonData.q4;
                    }
                    if(this.q == 'Q5'){
                        facet = $scope.jsonData.q5;
                    }
                    $http.get($scope.jsonData.api_domain+facet)
                        .success(function(res){
                            console.log(res);
                            angular.forEach(res.facets,function(val,key){
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
                            $scope.changeIndex(0);
                        })
                        .error(function(err){
                            console.log(err)
                        });
                }

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
    });
}());



