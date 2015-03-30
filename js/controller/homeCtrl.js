/**
 * Created by rw on 3/24/15.
 */
app.controller('homeCtrl',function($scope, $http, dataFactory){
    $scope.title = "Office of Information Technology";
    $scope.question = "Q17. Would you recommend the company?";
    $scope.index = 0;
//    $scope.getCurrentData = function(index){
//        $scope.index  = index
//    };
    $scope.dataObj = {
        "author":[],
        "section":[],
        "keywords":[]
    };
    $scope.result ={};
    $scope.index = 0;
    $http.get('http://119.81.106.34/searchblox/servlet/SearchServlet?query=*&facet=on&xsl=json&f.keywords.filter=travel&f.section.filter=business&f.author.filter=mark')
        .success(function(res){
            console.log(res);
            $scope.result = res.results.result;
            angular.forEach(res.results.result,function(v,k){
                if(v){
                    $scope.dataObj.author.push(v.author);
                    $scope.dataObj.section.push(v.section);
                    $scope.dataObj.keywords.push(v.keywords);
                }
            });
            $scope.wordCloud(0);
            /*var arr = listToAray($scope.dataObj.keywords[1], ',');
            console.log(arr);
            $scope.dataObj.keywords[1] = [];
            for (var i = 0; i < arr.length; i += 1) {
                $scope.dataObj.keywords[1].push({
                    text: arr[i],
                    weight: arr[i].length
                });
            }*/
            dataFactory.setData($scope.dataObj,$scope.result);
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

    $scope.data = [
        {
            key: "p",
            y: 1
        },
        {
            key: "n",
            y: 5
        },
        {
            key: "d",
            y: 5
        }
    ];
    $scope.colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976"];
    $scope.words = [
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
    ];
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
    $scope.wordCloud =  function(index){
        var arr = listToAray($scope.dataObj.keywords[index], ',');
        console.log(arr);
        $scope.dataObj.keywords[index] = [];
        if(arr[0] && angular.isObject(arr[0])){
            $scope.dataObj.keywords[index] = arr;
            return;
        }
        for (var i = 0; i < arr.length; i += 1) {
            if(arr[i][0].length && angular.isObject(arr[i][0])){
                $scope.dataObj.keywords[index] = arr;
                break;
            }
            $scope.dataObj.keywords[index].push({
                text: arr[i],
                weight: arr[i].length
            });
        }
    }

});