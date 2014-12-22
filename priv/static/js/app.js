$(function(){
  // SOCKET AND CHANNEL CREATION
  var socket     = new Phoenix.Socket("ws://" + location.host +  "/ws");
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

  socket.join("rooms", "lobby", {}, function(chan){

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

    chan.on("board:state", function(board) {
      displayBoard(board);
    });
  });

  // CHESSBOARD CREATION
  function displayBoard(board) {
    $("#board").empty();

    var cols = ["a","b","c","d","e","f","g","h"];
    var ranks = [1, 2, 3, 4, 5, 6, 7, 8];
    var pieces = {
      "R": "images/wR.png",
      "N": "images/wN.png",
      "B": "images/wB.png",
      "Q": "images/wQ.png",
      "K": "images/wK.png",
      "P": "images/wP.png",
      "r": "images/bR.png",
      "n": "images/bN.png",
      "b": "images/bB.png",
      "q": "images/bQ.png",
      "k": "images/bK.png",
      "p": "images/bP.png"
    };
    var board = board;

    for(var i = 7; i >= 0; i--) {
      var row = $("<tr>").appendTo($("#board"));
      for(var j = 0; j <= 7; j++) {
        bgcolor = ((i + j) % 2 == 0 ) ? "black" : "white";
        $(row).append("<td class=\"" + bgcolor + "\" id=\"" + cols[j] + ranks[i] + "\"></tr>");
      }
    }

    var key;
    for(var i = 7; i >= 0; i--) {
      for(var j = 0; j <= 7; j++) {
        key = board[cols[j]+ranks[i]];
        if (key !== "_" && key != undefined) {
          $('<img src="' + pieces[key[1]] + '" class="piece" draggable="true" id="' + key + '" />')
            .appendTo($("#" + cols[j] + ranks[i]));
        }
        var tag = document.getElementById(cols[j] + ranks[i]);
        tag.addEventListener("drop", function(ev) {
          ev.preventDefault();
          console.log(ev);
          var data = ev.dataTransfer.getData("piece");
          var to_tile = null;
          if (ev.target.className == "piece") {
            to_tile = ev.target.parentNode.id;
            var tile = document.getElementById(ev.target.parentNode.id);
            tile.removeChild(ev.target);
            tile.appendChild(document.getElementById(data));
          } else {
            to_tile = ev.target.id;
            ev.target.appendChild(document.getElementById(data));
          }
          socket.channels[0].send("board:move", ev.dataTransfer.getData("square") + "-" + to_tile);
        });
        tag.addEventListener("dragover", function(ev) {
          ev.preventDefault();
        });
      }
    }

    var allPieces = document.getElementsByClassName("piece");
    for(var i = 0; i < allPieces.length; i++) {
      allPieces[i].addEventListener("dragstart", function(ev) {
        console.log(ev.target.id);
        ev.dataTransfer.setData("piece", ev.target.id);
        ev.dataTransfer.setData("square", ev.target.parentNode.id);
      });
    }
  }
});
