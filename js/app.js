/**
 * Created by rw on 3/24/15.
 */
var app =  angular.module('app',['nvd3' , 'angular-jqcloud' , 'chart.js' , 'ngTable', 'ngTagsInput']);

app.config(function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
app.run(function(){
});
