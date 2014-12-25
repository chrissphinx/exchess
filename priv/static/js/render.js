var Piece = React.createClass({displayName: "Piece",
  dragStart: function(e) {
    var e = e.nativeEvent;
    e.dataTransfer.setData("from", e.target.parentNode.id);
  },
  render: function() {
    if (this.props.data !== "_") {
      switch (this.props.data) {
        case "K":
          return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", className: "piece", src: "/images/wK.svg"})
        case "k":
          return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", className: "piece", src: "/images/bK.svg"})
        case "Q":
          return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", className: "piece", src: "/images/wQ.svg"})
        case "q":
          return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", className: "piece", src: "/images/bQ.svg"})
        case "R":
          return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", className: "piece", src: "/images/wR.svg"})
        case "r":
          return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", className: "piece", src: "/images/bR.svg"})
        case "B":
          return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", className: "piece", src: "/images/wB.svg"})
        case "b":
          return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", className: "piece", src: "/images/bB.svg"})
        case "N":
          return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", className: "piece", src: "/images/wN.svg"})
        case "n":
          return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", className: "piece", src: "/images/bN.svg"})
        case "P":
          return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", className: "piece", src: "/images/wP.svg"})
        case "p":
          return React.createElement("img", {onDragStart: this.dragStart, draggable: "true", className: "piece", src: "/images/bP.svg"})
        default:
          return false;
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
    console.log("from: " + e.dataTransfer.getData("from") +
                ", to: " + to);
    Socket.channels[0].send("board:move", e.dataTransfer.getData("from") + "-" + to);
  },
  dragOver: function(e) {
    e.preventDefault();
  },
  render: function() {
    var offset = this.props.offset;
    return React.createElement("td", {onDrop: this.drop, onDragOver: this.dragOver, id: this.props.data.id, className: this.props.color}, React.createElement(Piece, {data: this.props.data.piece}))
  }
});

var Row = React.createClass({displayName: "Row",
  render: function() {
    var offset = this.props.offset;
    var row = this.props.data.map(function(item, index) {
      return React.createElement(Square, {key: item.id, data: item, color: (index+offset) % 2 == 0 ? 'black' : 'white'})
    });

    return React.createElement("tr", null, row)
  }
});

var Board = React.createClass({displayName: "Board",
  getInitialState: function() {
    return {board: [
      [
        {"id": "a8", "piece": "_"},
        {"id": "b8", "piece": "_"},
        {"id": "c8", "piece": "_"},
        {"id": "d8", "piece": "_"},
        {"id": "e8", "piece": "_"},
        {"id": "f8", "piece": "_"},
        {"id": "g8", "piece": "_"},
        {"id": "h8", "piece": "_"}
      ],[
        {"id": "a7", "piece": "_"},
        {"id": "b7", "piece": "_"},
        {"id": "c7", "piece": "_"},
        {"id": "d7", "piece": "_"},
        {"id": "e7", "piece": "_"},
        {"id": "f7", "piece": "_"},
        {"id": "g7", "piece": "_"},
        {"id": "h7", "piece": "_"}
      ],[
        {"id": "a6", "piece": "_"},
        {"id": "b6", "piece": "_"},
        {"id": "c6", "piece": "_"},
        {"id": "d6", "piece": "_"},
        {"id": "e6", "piece": "_"},
        {"id": "f6", "piece": "_"},
        {"id": "g6", "piece": "_"},
        {"id": "h6", "piece": "_"}
      ],[
        {"id": "a5", "piece": "_"},
        {"id": "b5", "piece": "_"},
        {"id": "c5", "piece": "_"},
        {"id": "d5", "piece": "_"},
        {"id": "e5", "piece": "_"},
        {"id": "f5", "piece": "_"},
        {"id": "g5", "piece": "_"},
        {"id": "h5", "piece": "_"}
      ],[
        {"id": "a4", "piece": "_"},
        {"id": "b4", "piece": "_"},
        {"id": "c4", "piece": "_"},
        {"id": "d4", "piece": "_"},
        {"id": "e4", "piece": "_"},
        {"id": "f4", "piece": "_"},
        {"id": "g4", "piece": "_"},
        {"id": "h4", "piece": "_"}
      ],[
        {"id": "a3", "piece": "_"},
        {"id": "b3", "piece": "_"},
        {"id": "c3", "piece": "_"},
        {"id": "d3", "piece": "_"},
        {"id": "e3", "piece": "_"},
        {"id": "f3", "piece": "_"},
        {"id": "g3", "piece": "_"},
        {"id": "h3", "piece": "_"}
      ],[
        {"id": "a2", "piece": "_"},
        {"id": "b2", "piece": "_"},
        {"id": "c2", "piece": "_"},
        {"id": "d2", "piece": "_"},
        {"id": "e2", "piece": "_"},
        {"id": "f2", "piece": "_"},
        {"id": "g2", "piece": "_"},
        {"id": "h2", "piece": "_"}
      ],[
        {"id": "a1", "piece": "_"},
        {"id": "b1", "piece": "_"},
        {"id": "c1", "piece": "_"},
        {"id": "d1", "piece": "_"},
        {"id": "e1", "piece": "_"},
        {"id": "f1", "piece": "_"},
        {"id": "g1", "piece": "_"},
        {"id": "h1", "piece": "_"}
      ]
    ]};
  },
  render: function() {
    var board = this.state.board.map(function(row, index) {
      return React.createElement(Row, {data: row, offset: index % 2 == 0 ? 0 : 1, key: index})
    });

    return React.createElement("tbody", null, board)
  }
});

var View = React.render(React.createElement(Board, null), document.getElementById("board"));
