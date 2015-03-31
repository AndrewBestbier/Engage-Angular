var app = angular.module("Andrew", ["firebase","ngMaterial","ngAnimate","angularMoment"]);


app.controller("TestController", ["$scope", "$firebaseArray","$firebaseObject", "$mdToast","$mdDialog", 
  function($scope, $firebaseArray,$firebaseObject,$mdToast,$mdDialog) {
     
    var list = $firebaseArray(new Firebase("https://engaged.firebaseio.com/messages"));


    var date = new Date();
    var milliSeconds = date.getTime();
     

    

     $scope.showAlert = function() {
        $mdDialog.show({
           templateUrl: 'test.html',
           controller: DialogController
         })
        .then(function(question) {
              $scope.alert = list.$add({text: question, count : 1, time: milliSeconds  });
              $mdToast.showSimple('Your question has been submitted for moderation');

            }, function() {
              $scope.alert = 'You cancelled the dialog.';
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
       
       var ref = new Firebase("https://engaged.firebaseio.com/messages/"+item.$id );
       ref.transaction(function(current_val) {
        current_val['count']++;
        return current_val;
     })}



  }
]);