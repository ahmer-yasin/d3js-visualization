/**
 * Created by rw on 3/25/15.
 */
app.factory('dataFactory',function($http){
    console.log('factory');
    var dataObj = {
        author :[],
        keywords:[],
        section:[]
    };
    var resultObj = {};
    var setData = function(data, result){
        dataObj = data;
        resultObj = result;
    };
    var getData = function(){
        return {
         data:dataObj,
         result:resultObj
        };
    };
    var getCurrentData = function(author){
        angular.forEach(dataObj,function(v,k){
            if(v.author == author){
               console.log(v);
               return v;
            }
        })
    };

    return{
        setData:setData,
        getData:getData,
        getCurrentData:getCurrentData

    }
});