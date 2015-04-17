var app = angular.module("Andrew", ["firebase","ngMaterial","ngAnimate","angularMoment","ngCookies"]);
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange');
});

app.controller("QuestionsController", ["$scope", "$firebaseArray","$firebaseObject", "$mdToast","$mdDialog", '$cookieStore','$rootScope',
  function($scope, $firebaseArray,$firebaseObject,$mdToast,$mdDialog,$cookieStore,$rootScope) {
     
    var roomCode = 0;

    $scope.isFabTab = true;

    $scope.hideFab = function(){
      $scope.isFabTab = false;
    }

    $scope.showFab = function(){
      $scope.isFabTab = true;
    }



    angular.element(document).ready(function () {

            roomCode = $cookieStore.get("studentRoomCode");

            var list = $firebaseArray(new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/questions"));
            $scope.list = list;

            //Polls
            var polls = $firebaseArray(new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/polls"));
            $scope.polls = polls;

            $scope.showPollDialog = function(item){
              

              $rootScope.poll = item;

              $mdDialog.show({
                    templateUrl: 'studentPollDialog.html',
                    controller: pollController  
              })
            }

            function pollController($scope, $mdDialog){          
              $scope.Question = $rootScope.poll.Question;
              
              $scope.option1 = $rootScope.poll.option1;
              $scope.option2 = $rootScope.poll.option2;
              $scope.option3 = $rootScope.poll.option3;
              $scope.option4 = $rootScope.poll.option4;

              $scope.pollSubmit = function(pollselection){
                
                
                 var ref = new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/polls/"+$rootScope.poll.$id+"/"+pollselection);
                ref.transaction(function(current_val) {
                current_val++;
                return current_val;
                });
              }

              

            }

            //

            var moderationObject = $firebaseObject(new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/Moderation"));
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
       window.location.href = 'dashboard.html';
     }

     
     
     $scope.vote = function(item){

      var voted = $cookieStore.get(item.$id);
      var userRef = new Firebase("https://engaged.firebaseio.com/");
      var user = userRef.getAuth();
      



      
      $cookieStore.put(item.$id, 'voted');


      var userObject = $firebaseObject(new Firebase("https://engaged.firebaseio.com/users/"+user.uid+"/voted/"+item.$id));
  
      userObject.userid = user.uid;
      

      userObject.$save().then(function(ref) {
        var ref = new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/questions/"+item.$id);
       ref.transaction(function(current_val) {
       current_val['count']++;
       return current_val;
       });
      }, function(error) {
        $mdToast.showSimple('You have already voted on this question.');
      });


         

         
        
      
      }


        });




    


    
  }
]);