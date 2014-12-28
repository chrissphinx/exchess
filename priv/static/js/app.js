$(function(){

  Socket     = new Phoenix.Socket("ws://" + location.host +  "/ws");
  var $status    = $("#status");
  var $messages  = $("#messages");
  var $input     = $("#message-input");
  var $username  = $("#username");
  var $body      = $("body");

  $(window).resize(function() {
    $messages.height(($body.height() - 120) + "px");
    $messages.scrollTop($messages[0].scrollHeight);
  }).resize();

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
      $messages.scrollTop($messages[0].scrollHeight);
    });

    chan.on("user:entered", function(msg){
      var username = sanitize(msg.user || "anonymous");
      $messages.append("<br/><i>[" + username + " entered]</i>");
    });

    chan.on("board:state", function(state) {
      View.setState({board: state});
    });
  });

  FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  var Piece = React.createClass({displayName: "Piece",
    dragStart: function(e) {
      var e = e.nativeEvent;
      e.dataTransfer.setData("from", e.target.parentNode.id);
      e.dataTransfer.setData("piece", e.target.id);
    },
    render: function() {
      if (this.props.data !== "_") {
        switch (this.props.data) {
          case "K":
            return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", id: "K", className: "piece", src: "http://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"})
          case "k":
            return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", id: "k", className: "piece", src: "http://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"})
          case "Q":
            return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", id: "Q", className: "piece", src: "http://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg"})
          case "q":
            return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", id: "q", className: "piece", src: "http://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg"})
          case "R":
            return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", id: "R", className: "piece", src: "http://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"})
          case "r":
            return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", id: "r", className: "piece", src: "http://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg"})
          case "B":
            return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", id: "B", className: "piece", src: "http://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg"})
          case "b":
            return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", id: "b", className: "piece", src: "http://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg"})
          case "N":
            return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", id: "N", className: "piece", src: "http://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg"})
          case "n":
            return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", id: "n", className: "piece", src: "http://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg"})
          case "P":
            return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", id: "P", className: "piece", src: "http://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg"})
          case "p":
            return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", id: "p", className: "piece", src: "http://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg"})
        }
      } else {
        return false;
      }
    }
  });

  var Square = React.createClass({displayName: "Square",
    drop: function(e) {
      e.preventDefault();
      var e = e.nativeEvent;
      var to;
      if (e.target.className == "piece") {
        to = e.target.parentNode.id;
      } else to = e.target.id;
      Socket.channels[0].send("board:move", e.dataTransfer.getData("piece") + e.dataTransfer.getData("from") + to);
    },
    dragOver: function(e) {
      e.preventDefault();
    },
    render: function() {
      var offset = this.props.offset;
      return React.createElement("td", {onDrop: this.drop, onDragOver: this.dragOver, id: this.props.tile, className: this.props.color}, React.createElement(Piece, {data: this.props.data}))
    }
  });

  var Row = React.createClass({displayName: "Row",
    render: function() {
      var row = [];
      for(var i = 0; i < 8; i++) {
        var file = FILES[i];
        var tile = file + this.props.rank;
        row.push(React.createElement(Square, {data: this.props.data[tile], tile: tile, color: (i+this.props.offset) % 2 == 0 ? 'black' : 'white', key: file}));
      } return React.createElement("tr", null, row)
    }
  });

  var Board = React.createClass({displayName: "Board",
    getInitialState: function() {
      return {board: {
        a8: "r", b8: "n", c8: "b", d8: "q", e8: "k", f8: "b", g8: "n", h8: "r",
        a7: "p", b7: "p", c7: "p", d7: "p", e7: "p", f7: "p", g7: "p", h7: "p",
        a6: "_", b6: "_", c6: "_", d6: "_", e6: "_", f6: "_", g6: "_", h6: "_",
        a5: "_", b5: "_", c5: "_", d5: "_", e5: "_", f5: "_", g5: "_", h5: "_",
        a4: "_", b4: "_", c4: "_", d4: "_", e4: "_", f4: "_", g4: "_", h4: "_",
        a3: "_", b3: "_", c3: "_", d3: "_", e3: "_", f3: "_", g3: "_", h3: "_",
        a2: "P", b2: "P", c2: "P", d2: "P", e2: "P", f2: "P", g2: "P", h2: "P",
        a1: "R", b1: "N", c1: "B", d1: "Q", e1: "K", f1: "B", g1: "N", h1: "R"
      }}
    },
    render: function() {
      var board = [];
      for(var i = 0; i < 8; i++) {
        board.push(React.createElement(Row, {data: this.state.board, rank: 8 - i, offset: i % 2 == 0 ? 0 : 1, key: i}));
      } return React.createElement("tbody", null, board)
    }
  });

  var View = React.render(React.createElement(Board, null), document.getElementById("board"));
});
