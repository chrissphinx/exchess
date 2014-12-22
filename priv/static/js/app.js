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
      $status.text("joined");
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
  });

  // CHESSBOARD CREATION
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
  var board = {
    "a8": "Qr", "b8": "Qn", "c8": "Qb", "d8": "Bq", "e8": "Bk", "f8": "Kb", "g8": "Kn", "h8": "Kr",
    "a7": "ap", "b7": "bp", "c7": "cp", "d7": "dp", "e7": "ep", "f7": "fp", "g7": "gp", "h7": "hp",
    "a6": "_", "b6": "_", "c6": "_", "d6": "_", "e6": "_", "f6": "_", "g6": "_", "h6": "_",
    "a5": "_", "b5": "_", "c5": "_", "d5": "_", "e5": "_", "f5": "_", "g5": "_", "h5": "_",
    "a4": "_", "b4": "_", "c4": "_", "d4": "_", "e4": "_", "f4": "_", "g4": "_", "h4": "_",
    "a3": "_", "b3": "_", "c3": "_", "d3": "_", "e3": "_", "f3": "_", "g3": "_", "h3": "_",
    "a2": "aP", "b2": "bP", "c2": "cP", "d2": "dP", "e2": "eP", "f2": "fP", "g2": "gP", "h2": "hP",
    "a1": "QR", "b1": "QN", "c1": "QB", "d1": "WQ", "e1": "WK", "f1": "WB", "g1": "WN", "h1": "WR"
  };

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
      if (key !== "_") {
        $('<img src="' + pieces[key[1]] + '" class="piece" draggable="true" id="' + key + '" />')
          .appendTo($("#" + cols[j] + ranks[i]));
      }
      var tag = document.getElementById(cols[j] + ranks[i]);
      tag.addEventListener("drop", function(ev) {
        ev.preventDefault();
        console.log(ev);
        var data = ev.dataTransfer.getData("piece");
        if (ev.target.className == "piece") {
          var tile = document.getElementById(ev.target.parentNode.id);
          tile.removeChild(ev.target);
          tile.appendChild(document.getElementById(data));
        } else {
          ev.target.appendChild(document.getElementById(data));
        }
        console.log("piece: " + ev.dataTransfer.getData("piece") + ", from: " + ev.dataTransfer.getData("square") + ", to: " + ev.target.id);
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
});
