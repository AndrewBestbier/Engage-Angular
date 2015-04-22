angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})




.controller('JoinedRooms', function($scope,$firebaseArray) {
  var joinList = $firebaseArray(new Firebase("https://engaged.firebaseio.com/users/simplelogin:5/joinList"));
  $scope.joinList = joinList;
})

.controller('JoinedRoom', function($scope,$firebaseArray,$ionicModal,$state) {
  var questions = $firebaseArray(new Firebase("https://engaged.firebaseio.com/rooms/287229/questions"));
  $scope.questions = questions;

      $ionicModal.fromTemplateUrl('templates/askQuestion.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $scope.askQuestion = function()
      {
        $scope.modal.show();
      }

      $scope.ask = function(question)
      {
        var date = new Date();
        var milliSeconds = date.getTime();
        questions.$add({text: question, count : 0, time: milliSeconds  });
        $scope.modal.hide();
      }

      $scope.vote = function(item)
      {
        var ref = new Firebase("https://engaged.firebaseio.com/rooms/287229/questions/"+item.$id);
        ref.transaction(function(current_val) {
          current_val['count']++;
          return current_val;
        });
      }


})

.controller('JoinedRoomPoll', function($scope,$firebaseArray,$ionicModal) {
    var polls = $firebaseArray(new Firebase("https://engaged.firebaseio.com/rooms/287229/polls"));
    $scope.polls = polls;

        $ionicModal.fromTemplateUrl('templates/votePollDialog.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openPoll = function(item)
        {
            $scope.modal.show();

            $scope.pollId = item.$id;

            $scope.Question = item.Question;
            $scope.option1 = item.option1;
            $scope.option2 = item.option2;
            $scope.option3 = item.option3;
            $scope.option4 = item.option4;
        }

        $scope.submitPollAnswer = function(choice)
        {

            $scope.modal.hide();

            var ref = new Firebase("https://engaged.firebaseio.com/rooms/287229/polls/"+$scope.pollId+"/"+choice);
            ref.transaction(function(current_val) {
                current_val++;
                return current_val;
            });


        }
});
