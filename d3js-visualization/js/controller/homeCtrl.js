/**
 * Created by rw on 3/24/15.
 */
app.controller('homeCtrl',function($scope, $http){
    $scope.title = "Office of Information Technology";
    $scope.question = "Q17. Would you recommend the company?";

    $scope.getData = function(){
        $http.get('../servlet/SearchServlet?facet=on&pagesize=3&query=*')
            .success(function(data){
                console.log(data);
            })
            .error(function(err){
                console.log(err);
            })
    };



    $scope.config = {
        visible: true, // default: true
        extended: false, // default: false
        disabled: false, // default: false
        autorefresh: true, // default: true
        refreshDataOnly: false // default: false
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

});