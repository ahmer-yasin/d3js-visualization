/**
 * Created by rw on 3/24/15.
 */
app.controller('homeCtrl',function($scope, $http, dataFactory){
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
    $scope.data = [];
    $http.get('http://119.81.106.34/searchblox/servlet/SearchServlet?facet=on&pagesize=3&query=*&facet.field=keywords&f.keywords.size=100&facet.field=section&&f.section.size=5&facet.field=author&&f.author.size=100&xsl=json')
        .success(function(res){
            console.log(res);
            $scope.result = res.results.result;
            $scope.words =  res.facets[0].int;
            $scope.dataObj.author = res.facets[2].int;
            $scope.pieChartFunc(res.facets[1].int,res.facets[1]['@count']);
            console.log($scope.words);
            angular.forEach(res.results.result,function(v,k){
                if(v){
                    $scope.dataObj.section.push(v.section);
                    $scope.dataObj.keywords.push(v.keywords);
                }
            });
            $scope.wordCloudObj($scope.words);
           // $scope.wordCloud(0);
            /*var arr = listToAray($scope.dataObj.keywords[1], ',');
            console.log(arr);
            $scope.dataObj.keywords[1] = [];
            for (var i = 0; i < arr.length; i += 1) {
                $scope.dataObj.keywords[1].push({
                    text: arr[i],
                    weight: arr[i].length
                });
            }*/
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
            x: function(d){return d.key;},
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
    $scope.pieChartFunc = function(obj,amount){
      angular.forEach(obj,function(val,k){
          $scope.data.push({'key':val['@name'],'y':val['#text']/amount * 100});
      })
    };
    $scope.colors = ["#bb4e11", "#52041b", "#ba7b18", "#a13a17", "#4e0310", "#bb2b11","#a1191a"];
    $scope.word = [];
    $scope.wordCloudObj = function(obj){
      angular.forEach(obj,function(v,k){
          if(v){
            $scope.word.push({'text': v['@name'],weight:v['#text']});
          }
      });
        console.log($scope.word);
    };
    /*$scope.words = [
        {text: "Lorem", weight: 13},
        {text: "Ipsum", weight: 10.5},
        {text: "Dolor", weight: 9.4},
        {text: "Sit", weight: 8},
        {text: "Amet", weight: 6.2},
        {text: "Consectetur", weight: 5},
        {text: "Adipiscing", weight: 5},
        {text: "Elit", weight: 5},
        {text: "Nam et", weight: 5},
        {text: "Leo", weight: 4},
        {text: "Sapien", weight: 4},
        {text: "Pellentesque", weight: 3},
        {text: "habitant", weight: 3},
        {text: "morbi", weight: 3},
        {text: "tristisque", weight: 3},
        {text: "senectus", weight: 3},
        {text: "et netus", weight: 3},
        {text: "et malesuada", weight: 3},
        {text: "fames", weight: 2},
        {text: "ac turpis", weight: 2},
        {text: "egestas", weight: 2},
        {text: "Aenean", weight: 2},
        {text: "vestibulum", weight: 2},
        {text: "elit", weight: 2},
        {text: "sit amet", weight: 2},
        {text: "metus", weight: 2},
        {text: "adipiscing", weight: 2},
        {text: "ut ultrices", weight: 2}
    ];*/
    function listToAray(fullString, separator) {
        var fullArray = [];
        if(fullString[0] && angular.isObject(fullString[0])){
            return  fullString;

        }
        if (fullString !== undefined) {
            if (fullString.indexOf(separator) == -1) {
                fullArray.push(fullString);
            } else {
                fullArray = fullString.split(separator);
            }
        }

        return fullArray;
    }
//    $scope.wordCloud =  function(index){
//        var arr = listToAray($scope.dataObj.keywords[index], ',');
//        console.log(arr);
//        $scope.dataObj.keywords[index] = [];
//        if(arr[0] && angular.isObject(arr[0])){
//            $scope.dataObj.keywords[index] = arr;
//            return;
//        }
//        for (var i = 0; i < arr.length; i += 1) {
//            if(arr[i][0].length && angular.isObject(arr[i][0])){
//                $scope.dataObj.keywords[index] = arr;
//                break;
//            }
//            $scope.dataObj.keywords[index].push({
//                text: arr[i],
//                weight: arr[i].length
//            });
//        }
//    }

});