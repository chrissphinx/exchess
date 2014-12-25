$(function(){
  // SOCKET AND CHANNEL CREATION
  Socket     = new Phoenix.Socket("ws://" + location.host +  "/ws");
  var $status    = $("#status");
  var $messages  = $("#messages");
  var $input     = $("#message-input");
  var $username  = $("#username");
  var sanitize   = function(html){ return $("<div/>").text(html).html(); }

  var messageTemplate = function(message){
    var username = sanitize(message.user || "anonymous");
    var body     = sanitize(message.body);
    return("<p><a href='#'>[" + username + "]</a>&nbsp; " + body +"</p>");
  }

  Socket.join("rooms", "lobby", {}, function(chan){

    $input.off("keypress").on("keypress", function(e) {
      if (e.keyCode == 13) {
        chan.send("new:msg", {user: $username.val(), body: $input.val()});
        $input.val("");
      }
    });

    chan.on("join", function(message){
      $status.text("connected");
    });

    chan.on("new:msg", function(message){
      $messages.append(messageTemplate(message));
      console.log(message);
      scrollTo(0, document.body.scrollHeight);
    });

    chan.on("user:entered", function(msg){
      var username = sanitize(msg.user || "anonymous");
      $messages.append("<br/><i>[" + username + " entered]</i>");
    });

    chan.on("board:state", function(state) {
      View.setState({board: state.board});
    });
  });
});
