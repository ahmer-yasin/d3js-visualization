/**
 * Created by rw on 3/24/15.
 */
var app =  angular.module('app',['nvd3', 'angular-jqcloud']);

app.config(function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    console.log('config');
});
app.run(function($http, dataFactory){
    console.log('run');
});
