angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('JoinedRooms', function($scope,$firebaseArray) {
  var joinList = $firebaseArray(new Firebase("https://engaged.firebaseio.com/users/simplelogin:5/joinList"));
  $scope.joinList = joinList;
})

.controller('JoinedRoom', function($scope,$firebaseArray,$ionicModal) {
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

        $scope.openPoll = function()
        {
            $scope.modal.show();
        }
});
