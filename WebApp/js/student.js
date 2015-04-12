var app = angular.module("Andrew", ["firebase","ngMaterial","ngAnimate","angularMoment","ngCookies"]);
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange');
});

app.controller("QuestionsController", ["$scope", "$firebaseArray","$firebaseObject", "$mdToast","$mdDialog", '$cookieStore',
  function($scope, $firebaseArray,$firebaseObject,$mdToast,$mdDialog,$cookieStore) {
     
    var roomCode = 0;

    angular.element(document).ready(function () {

            roomCode = $cookieStore.get("roomCode");

            var list = $firebaseArray(new Firebase("https://engaged.firebaseio.com/"+roomCode+"/questions"));
            $scope.list = list;

            var moderationObject = $firebaseObject(new Firebase("https://engaged.firebaseio.com/"+roomCode+"/Moderation"));
            $scope.moderationConstant = moderationObject;

          $scope.showQuestionDialog = function() {
             $mdDialog.show({
                templateUrl: 'questionDialog.html',
                controller: DialogController,
                onComplete: afterShowAnimation
              })
             .then(function(question) {

                   var date = new Date();
                   var milliSeconds = date.getTime();
                   
                   $scope.alert = list.$add({text: question, count : 0, time: milliSeconds  });
                   $mdToast.showSimple('Your question has been submitted for moderation');

                 }, function() {
                 });

             function afterShowAnimation(scope, element, options) {
                         document.getElementById("question-input").focus();
                      }
          }


           function DialogController($scope, $mdDialog) {
             
             $scope.roomCode = roomCode;

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

     $scope.navigate = function() {
       window.location.href = 'index.html';
     }

     
     
     $scope.vote = function(item){

      var voted = $cookieStore.get(item.$id);

      if(voted != undefined){
        $mdToast.showSimple('You have already voted on this question.');
      } else {
        $cookieStore.put(item.$id, 'voted');
         var ref = new Firebase("https://engaged.firebaseio.com/"+roomCode+"/questions/"+item.$id);
         ref.transaction(function(current_val) {
         current_val['count']++;
         return current_val;
        })
      }
      }


        });




    


    
  }
]);