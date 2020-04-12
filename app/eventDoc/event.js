/**
 * 
* @apiGroup emit

* @api {Events to emit verifyUser} verifyUser Events to emit verifyUser.

* @apiSuccessExample {object} Event-Response:
    {
       "This event ("verifyUser") has to be emit from server side for gained authtoken from client side and verify."

   }

*/


/**
* @apiGroup emit

* @api {Events to auth-error} emit auth-error event.

* 
* @apiSuccessExample {object} Success-Response:
    {
       "This event ("auth-error") has to be emit from server side after validating authoken failed
       and send {object} data.
        { status: 500, error: 'Please provide correct auth token' })"

   }
 */

 /**
* @apiGroup emit

* @api {Events to online-user-list} emit online-user-list event.

* 
* @apiSuccessExample {object} Event-Response:
    {
       "This event ("online-user-list") has to be emit from server side for fetching all online
       users its array of all online userlist"

   }
 */


  /**
* @apiGroup emit

* @api {Events to emit own user id} emit Own id.

* 
* @apiSuccessExample {object} Event-Response:
    {
       "This event ("userId") has to be emit from server side for pushing all meeting data real time 
       when its updated from admin (real time meeting updated)"

   }
 */

   /**
* @apiGroup Listen

* @api {Events Listen set-user} listen Event listen verify user token.

* 
* @apiSuccessExample {object} Event-Response:
    {
       "This event ("set-user") listen on server side for validating authtoken and set with socket"

   }
 */

    /**
* @apiGroup Listen

* @api {Events Listen meeting-updated} listen meeting-updated.

* 
* @apiSuccessExample {object} Event-Response:
    {
       "This event ("meeting-updated") when any meeting added edied updated so that we can get notify meeting 
       detail has been and emit userid  to client call all meeting detail for real time communication"

   }
 */

     /**
* @apiGroup Listen

* @api {Events Listen disconnect} listen disconnect.

* 
* @apiSuccessExample {object} Event-Response:
    {
       "This event ("disconnect") get listen when client logout and get dissconnected"

   }
 */