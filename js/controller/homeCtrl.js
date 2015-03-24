/**
 * Created by rw on 3/24/15.
 */
app.controller('homeCtrl',function($scope){
    $scope.title = "Office of Information Technology";
    $scope.question = "Q17. Would you recommend the company?";

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
            key: "po",
            y: 5
        },
        {
            key: "Two",
            y: 2
        },
        {
            key: "Three",
            y: 9
        }
    ];

});