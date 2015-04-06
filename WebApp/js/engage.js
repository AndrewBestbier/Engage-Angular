var app = angular.module("Andrew", ["firebase","ngMaterial","ngAnimate","angularMoment","ngCookies"]);


app.controller("TestController", ["$scope", "$firebaseArray","$firebaseObject", "$mdToast","$mdDialog", '$cookieStore',
  function($scope, $firebaseArray,$firebaseObject,$mdToast,$mdDialog,$cookieStore) {
     
    var roomCode = 0;

    angular.element(document).ready(function () {

            roomCode = $cookieStore.get("roomCode");

            //For the moderator
            roomPassword = $cookieStore.get("roomPassword");

            if(roomCode == undefined){
              roomCode = Math.floor(Math.random() * 1000000) + 1;
              $cookieStore.put("roomCode", roomCode);

              //For the moderator
              roomPassword = Math.floor(Math.random() * 1000000) + 1;
              $cookieStore.put("roomPassword", roomPassword);

              moderatorFirebaseRef = new Firebase("https://engaged.firebaseio.com/ModToRoomMap/"+roomPassword+"/");

              var obj = $firebaseObject(moderatorFirebaseRef);
              obj.roomCode = roomCode;
              obj.$save()

            }

            var list = $firebaseArray(new Firebase("https://engaged.firebaseio.com/"+roomCode));

            $scope.list = list;



            var date = new Date();

            var milliSeconds = date.getTime();

            $mdDialog.show({
               templateUrl: 'welcomeDialog.html',
               controller: DialogController
             });
     
    




           $scope.showQuestionDialog = function() {
              $mdDialog.show({
                 templateUrl: 'test.html',
                 controller: DialogController
               })
              .then(function(question) {
                    $scope.alert = list.$add({text: question, count : 0, time: milliSeconds  });
                    $mdToast.showSimple('Your question has been submitted for moderation');

                  }, function() {
                  });
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
     
     $scope.vote = function(item){

      var voted = $cookieStore.get(item.$id);

      if(voted != undefined){
        $mdToast.showSimple('You have already voted on this question.');
      } else {
        $cookieStore.put(item.$id, 'voted');
         var ref = new Firebase("https://engaged.firebaseio.com/"+roomCode+"/"+item.$id);
         ref.transaction(function(current_val) {
         current_val['count']++;
         return current_val;
        })
      }
      }


        });




    


    
  }
]);