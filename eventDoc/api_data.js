define({ "api": [
  {
    "group": "Listen",
    "type": "Events Listen disconnect",
    "url": "listen",
    "title": "disconnect.",
    "success": {
      "examples": [
        {
          "title": "Event-Response:",
          "content": " {\n    \"This event (\"disconnect\") get listen when client logout and get dissconnected\"\n\n}",
          "type": "object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/eventDoc/event.js",
    "groupTitle": "Listen",
    "name": "Events listen disconnectListen"
  },
  {
    "group": "Listen",
    "type": "Events Listen meeting-updated",
    "url": "listen",
    "title": "meeting-updated.",
    "success": {
      "examples": [
        {
          "title": "Event-Response:",
          "content": " {\n    \"This event (\"meeting-updated\") when any meeting added edied updated so that we can get notify meeting \n    detail has been and emit userid  to client call all meeting detail for real time communication\"\n\n}",
          "type": "object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/eventDoc/event.js",
    "groupTitle": "Listen",
    "name": "Events listen meeting-updatedListen"
  },
  {
    "group": "Listen",
    "type": "Events Listen set-user",
    "url": "listen",
    "title": "Event listen verify user token.",
    "success": {
      "examples": [
        {
          "title": "Event-Response:",
          "content": " {\n    \"This event (\"set-user\") listen on server side for validating authtoken and set with socket\"\n\n}",
          "type": "object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/eventDoc/event.js",
    "groupTitle": "Listen",
    "name": "Events listen set-userListen"
  },
  {
    "group": "emit",
    "type": "Events to auth-error",
    "url": "emit",
    "title": "auth-error event.",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"This event (\"auth-error\") has to be emit from server side after validating authoken failed\n    and send {object} data.\n     { status: 500, error: 'Please provide correct auth token' })\"\n\n}",
          "type": "object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/eventDoc/event.js",
    "groupTitle": "emit",
    "name": "Events to auth-errorEmit"
  },
  {
    "group": "emit",
    "type": "Events to emit own user id",
    "url": "emit",
    "title": "Own id.",
    "success": {
      "examples": [
        {
          "title": "Event-Response:",
          "content": " {\n    \"This event (\"userId\") has to be emit from server side for pushing all meeting data real time \n    when its updated from admin (real time meeting updated)\"\n\n}",
          "type": "object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/eventDoc/event.js",
    "groupTitle": "emit",
    "name": "Events to emit own user idEmit"
  },
  {
    "group": "emit",
    "type": "Events to emit verifyUser",
    "url": "verifyUser",
    "title": "Events to emit verifyUser.",
    "success": {
      "examples": [
        {
          "title": "Event-Response:",
          "content": " {\n    \"This event (\"verifyUser\") has to be emit from server side for gained authtoken from client side and verify.\"\n\n}",
          "type": "object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/eventDoc/event.js",
    "groupTitle": "emit",
    "name": "Events to emit verifyuserVerifyuser"
  },
  {
    "group": "emit",
    "type": "Events to online-user-list",
    "url": "emit",
    "title": "online-user-list event.",
    "success": {
      "examples": [
        {
          "title": "Event-Response:",
          "content": " {\n    \"This event (\"online-user-list\") has to be emit from server side for fetching all online\n    users its array of all online userlist\"\n\n}",
          "type": "object"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/eventDoc/event.js",
    "groupTitle": "emit",
    "name": "Events to online-user-listEmit"
  }
] });
