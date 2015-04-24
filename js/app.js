/**
 * Created by rw on 3/24/15.
 */
var app =  angular.module('app',['nvd3' , 'angular-jqcloud' , 'ngTable', 'search.service', 'app.constants', 'underscore']);

app.config(function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
app.run(function(){
});
