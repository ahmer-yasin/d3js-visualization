/**
 * Created by rw on 3/24/15.
 */
app.controller('homeCtrl',function($scope, $http, dataFactory){
    if (typeof String.prototype.startsWith != 'function') {
        // see below for better implementation!
        String.prototype.startsWith = function (str){
            return this.indexOf(str) === 0;
        };
    }
    $scope.title = "Devision";
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
    $scope.changeIndex= function(index){
        $scope.index = index
    };
    var Questions = function(){
        $http.get(url)
            .success(function(d){console.log(d)})
            .error(function(e){console.log(e)})
    };
    var devisionUrl = 'http://119.81.106.34/searchblox/servlet/SearchServlet?facet=true&col=1&query=*&facet.field=division';
    var url = ' http://119.81.106.34/searchblox/servlet/SearchServlet?facet=true&col=1&query=*';
    var Api_domain = 'http://119.81.106.34/searchblox/servlet/SearchServlet?facet=on&pagesize=3&query=*&facet.field=keywords&f.keywords.size=100&facet.field=section&&f.section.size=5&facet.field=author&&f.author.size=100&xsl=json'
    $http.get(Api_domain)
        .success(function(data){
            console.log(data);
        })
        .error(function(err){
            console.log(err);
        });
    var conditions = {};
    var sentiments = {};
    $scope.getFirstTime = function(){
        $http.get(url)
            .success(function(res){
                console.log(res);
                $scope.result = res.results.result;
                angular.forEach($scope.result,function(v,key){
                    if(v.division){
                        $scope.devisions.push(v.division);
                    }
                    if(angular.isObject(v)){
                        var obj = {};
                        angular.forEach(v,function(v,k){
                            if(k.startsWith('Q')){
                                console.log(k.indexOf('sentiment'));
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
                console.log($scope.questions);


//            $scope.words =  res.facets[0].int;
//            $scope.pieChartFunc(res.facets[1].int,res.facets[1]['@count']);
//            console.log($scope.words);
//            angular.forEach(res.results.result,function(v,k){
//                if(v){
//                    $scope.dataObj.section.push(v.section);
//                    $scope.dataObj.keywords.push(v.keywords);
//                }
//            });
//            $scope.wordCloudObj($scope.words);
            })
            .error(function(err){
                console.log(err)
            });
    };
    $scope.getFirstTime();
        console.log($scope.result);
        $scope.config = {
            visible: true, // default: true
            extended: false, // default: false
            disabled: false, // default: false
            autorefresh: true, // default: true
            refreshDataOnly: true // default: false
        };
        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 450,
                donut: true,
                x: function(d){return d.key; },
                y: function(d){return d.y;},
                showLabels: true,

                transitionDuration: 500,
                legend: {
                    margin: {
                        top: 0,
                        right: 70,

                        left: 0
                    }
                }
            }
        };
        $scope.labels = [];
        $scope.word = [];
        $scope.data = [];
        $scope.colors = ["#bb4e11", "#52041b", "#ba7b18", "#a13a17", "#4e0310", "#bb2b11","#a1191a"];
        $scope.wordCloudObj = function(obj){
            $scope.word = [];
            angular.forEach(obj,function(v,k){
                if(v){
                    $scope.word.push({'text': v['@name'],weight: v['#text']/*10 + Math.random() * 90*/ , handlers : {click: function() { $scope.getFilter(v['@name'],'&f.keywords.filter=')}}});
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
            console.log($scope.labels);
            console.log($scope.data);
        };
    $scope.onClick = function (points, evt) {
        if(points[0].label){
            console.log(points[0].label);
            $scope.getFilter(points[0].label, '&f.section.filter=');
        }
        else{
            console.log('please chose right keywords');
        }
    };
    $scope.getFilter = function(filter,type){
        var filter = type+filter;
        console.log(filter);
        $http.get('http://119.81.106.34/searchblox/servlet/SearchServlet?facet=on&pagesize=3&query=*&facet.field=keywords&f.keywords.size=100'+filter+'&facet.field=section&&f.section.size=5&facet.field=author&&f.author.size=100&xsl=json')
            .success(function(res){
                console.log(res);
                $scope.result = res.results.result;
                $scope.words =  res.facets[0].int;
                if(res.facets[0].int){
                    $scope.wordCloudObj($scope.words);
                }
                if(res.facets[1].int){
                   $scope.pieChartFunc(res.facets[1].int,res.facets[1]['@count']);
                }
            })
            .error(function(err){
                console.log(err)
            });
    };

    $scope.fetchData = function(filter){
        $('#loading').show();
        $http.get("http://119.81.106.34/searchblox/servlet/SearchServlet?facet=true&col=1&query="+filter)
            .success(function(data){
                $('#loading').hide();
                $scope.dataFilter = data;
                console.log($scope.dataFilter);
            })
            .error(function(err){
                $('#loading').hide();
                console.log(err);
            })
    };
    var conditions = {};

    $scope.QuestionFilter = function(){
        var facet = '';
        if(conditions[$scope.index][this.q +'.sentiment']){
            facet = conditions[$scope.index][this.q +'.sentiment'];
        }
      $http.get('http://119.81.106.34/searchblox/servlet/SearchServlet?facet=true&col=1&query='+this.q+':'+$scope.questions[$scope.index][this.q]+'&facet.field='+this.q+'&facet.field='+facet)
            .success(function(res){
                console.log(res);
                if(res.facets[0].int){
                    $scope.words =  res.facets[0].int;
                    $scope.wordCloudObj($scope.words);
                }
                if(res.facets[1].int){
                    $scope.pieChartFunc(res.facets[1].int,res.facets[1]['@count']);
                }
                $scope.result = res.results.result;
                $scope.devisions = [];
                $scope.questions = [];
                angular.forEach($scope.result,function(v,key){
                    if(v.division){
                        $scope.devisions.push(v.division);
                    }
                    if(angular.isObject(v)){
                        var obj = {};
                        angular.forEach(v,function(v,k){
                            if(k.startsWith('Q')){
                                console.log(k.indexOf('sentiment'));
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
                })
            .error(function(err){
                console.log(err)
            });
    }
});