/**
 * Created by rw on 3/24/15.
 */
app.controller('homeCtrl',function($scope, $http){
    $scope.title = "Office of Information Technology";
    $scope.question = "Q17. Would you recommend the company?";
    $scope.index = 0;
    $scope.dataObj = {
        "author":[],
        "section":[],
        "keywords":[]
    };
    $scope.result ={};
    $scope.index = 0;
    $scope.words;
    $scope.listData = [];
    $http.get('http://119.81.106.34/searchblox/servlet/SearchServlet?facet=on&pagesize=3&query=*&facet.field=keywords&f.keywords.size=100&facet.field=section&&f.section.size=5&facet.field=author&&f.author.size=100&xsl=json')
        .success(function(res){
            console.log(res);
            $scope.result = res.results.result;
            $scope.words =  res.facets[0].int;
            //$scope.dataObj.author = res.facets[2].int;
            //$scope.listData = res.facets[1].int;
            $scope.pieChartFunc(res.facets[1].int,res.facets[1]['@count']);
            console.log($scope.words);
            angular.forEach(res.results.result,function(v,k){
                if(v){
                    $scope.dataObj.section.push(v.section);
                    $scope.dataObj.keywords.push(v.keywords);
                }
            });
            $scope.wordCloudObj($scope.words);
        })
        .error(function(err){
            console.log(err)
        });

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
            //$scope.getFilter(points[0].label, '&f.keywords.filter=');
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
    }


});