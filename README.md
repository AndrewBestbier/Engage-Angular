**Server Side**:

{
    "rules": {
        ".read": true,
        ".write": true,
        "rooms": {
          "$roomCode": {
            "questions": {
              "$question": {
                ".validate": "(newData.child('count').val() === 0) || (newData.child('count').val() === data.child('count').val()+1)"
              }
            }
          }
        },
        "users": {
          "$user": {
            "voted" : {
              "$questionId":{
                ".validate": "!data.exists()"
              }
            }
          }
        }
    }
}
