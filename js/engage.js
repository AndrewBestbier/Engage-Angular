var app = angular.module("Andrew", ["firebase","ngMaterial","ngAnimate","angularMoment","ngCookies"]);


app.controller("TestController", ["$scope", "$firebaseArray","$firebaseObject", "$mdToast","$mdDialog", '$cookieStore',
  function($scope, $firebaseArray,$firebaseObject,$mdToast,$mdDialog,$cookieStore) {
     
    var list = $firebaseArray(new Firebase("https://engaged.firebaseio.com/messages"));


    var date = new Date();
    var milliSeconds = date.getTime();
     
    




     $scope.showQuestionDialog = function() {
        $mdDialog.show({
           templateUrl: 'test.html',
           controller: DialogController
         })
        .then(function(question) {
              $scope.alert = list.$add({text: question, count : 1, time: milliSeconds  });
              $mdToast.showSimple('Your question has been submitted for moderation');

            }, function() {
            });
     }




     function DialogController($scope, $mdDialog) {
       $scope.hide = function() {
         $mdDialog.hide();
       };
       $scope.cancel = function() {
         $mdDialog.cancel();
       };
       $scope.ask = function(answer) {
         $mdDialog.hide(answer);
       }};


     
     
         

      

    
    
      
     $scope.sorter = '-count';
     $scope.list = list;


     $scope.vote = function(item){

      var voted = $cookieStore.get(item.$id);

      if(voted != undefined){
        $mdToast.showSimple('You have already voted on this question.');
      } else {
        $cookieStore.put(item.$id, 'voted');
         var ref = new Firebase("https://engaged.firebaseio.com/messages/"+item.$id );
         ref.transaction(function(current_val) {
         current_val['count']++;
         return current_val;
        })
      }
      }
  }
]);