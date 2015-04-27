/**
 * Created by asad on 4/18/15.
 */
(function(){
    'use strict';

    app.controller('homeController',function($scope, $http, ngTableParams, $timeout, searchService, _, CONFIG){

      function init() {
        initializeQuestions();
        initializeDivisions();
      }

      function initializeQuestions() {
        $scope.listOfQuestions = CONFIG.QUESTIONS;
      }

      function initializeDivisions() {
        searchService.getAllDivisions()
        .success(function(res){
          angular.forEach(res.facets,function(val){
            if(val['@name'] === 'division'){
              $scope.divisions = _.pluck(val.int,'@name');
            }
          });
        })
        .error(function(err){
          console.log(err);
        });
      }

      $scope.selectQuestion = function() {
        getResponses(1);
      };
      
      $scope.selectDivision = function() {
        if ( !_.isEmpty($scope.questionSelected)){
          getResponses(1);
        }
      };

      $scope.clearQuestionFilter = function() {
        $scope.filterQuestion = '';
        getResponses(1);
      };

      $scope.clearSentimentFilter = function() {
        $scope.filterSentiment = '';
        getResponses(1);
      };

      function getResponses(pageNumber) {
        
        searchService.getResponses($scope.questionSelected, $scope.divisionSelected, pageNumber, CONFIG.PAGE_SIZE, $scope.filterQuestion, $scope.filterSentiment)
        .success(function(response){
          $scope.result = response.results.result;
          setWordCloudAndPieChart(response);
          $scope.responseTableParams.page(1);
          $scope.responseTableParams.reload();
        })
        .error(function(err){
          console.log('Error:' + err);
        });
      }

      $scope.responseTableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10           // count per page
        },{
          $scope: $scope,
          total: 0, // length of data
          getData: function($defer, params) {
            if ( angular.isDefined($scope.result) && $scope.result.length > 0) {
              params.total($scope.result.length);
              var pageData = $scope.result.slice((params.page() - 1) * params.count(), params.page() * params.count());
              $defer.resolve(_.pluck(pageData,$scope.questionSelected));
            }
          }
      });

      function setWordCloudAndPieChart(response) {
        angular.forEach(response.facets,function(val){
          if(val['@name'] === $scope.questionSelected + '.sentiment'){
            pieChartFunc(val.int,val['@count']);
          }
          if(val['@name'] === $scope.questionSelected){
            wordCloudObj(val.int);
          }
        });
      }
      
      var pieChartFunc = function(obj,amount){
        $scope.options = {};
        $scope.data = [];
        /* Chart data */
        if(angular.isArray(obj)) {
          angular.forEach(obj, function (val, k) {
            $scope.data.push({ key: val['@name'], y: val['#text'] / amount * 100});
          });
        }else if (angular.isDefined(obj)) {
            $scope.data.push({ key: obj['@name'], y: obj['#text'] / amount * 100});
        }
        var getColors = function(data){
          var colors = [];
          angular.forEach(data,function(obj){
            if(obj['key'] === 'positive'){
              colors.push('green');
            }
            if(obj['key'] === 'negative'){
              colors.push('#f44');
            }
            if(obj['key'] === 'neutral'){
              colors.push('#c7c7c7');
            }
          });
          return colors;
        };
        /* Chart options */
        $scope.options = {
            chart: {

                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                color: getColors($scope.data),
                showLabels: true,
                transitionDuration: 500,
                labelThreshold: 0.01,
                legend: {
                    margin: {
                        top: 50,
                        right: 35,
                        bottom: 50,
                        left: 50
                    }
                },
                pie: {
                  dispatch: {
                    elementClick: function(e) {
                      $scope.filterSentiment = e.label;
                      $scope.$apply();
                      getResponses(1);
                    }
                  }
                }
            }
        };

      };

      var wordCloudObj = function(obj){
        $scope.word = [];
        $scope.colors = ["#bb4e11", "#52041b", "#ba7b18", "#a13a17", "#4e0310", "#bb2b11","#a1191a"];
        angular.forEach(obj,function(v,k){
          if(v){
            $scope.word.push({'text': v['@name'],weight: v['#text'] ,
              handlers : {click: function() {
                $scope.filterQuestion = v['@name'];
                getResponses(1);
              }
            }
            });
          }
        });
      };

      $scope.exportPieChartAsImage = function() {

        var nodesToRecover = [];
        var nodesToRemove = [];

        console.log($('#chart'));

        var targetElement = $('#chart').clone(true, true);

        console.log(targetElement);
        var svgElem = targetElement.find('svg');

        console.log(svgElem);

        svgElem.each(function(index, node) {
          var parentNode = node.parentNode;
          var svg = parentNode.innerHTML;

          var canvas = document.createElement('canvas');

          canvg(canvas, svg);

          nodesToRecover.push({
            parent: parentNode,
            child: node
          });
          parentNode.removeChild(node);

          nodesToRemove.push({
            parent: parentNode,
            child: canvas
          });

          parentNode.appendChild(canvas);
        });


        html2canvas(targetElement).then(function (canvas) {
          document.body.appendChild(canvas);
          //Canvas2Image.saveAsJPEG(canvas, 300, 300);
        }, function (error) {
          console.log(error);
        });
      };

      $scope.exportWordCloudAsImage = function() {
        html2canvas($('#wordCloud')).then(function (canvas) {
          Canvas2Image.saveAsJPEG(canvas, 300, 300);
        }, function (error) {
          console.log(error);
        });
      };

      init();
    });
}());
