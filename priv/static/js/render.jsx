var game = [
  [
    {"id": "a8", "piece": "r"},
    {"id": "b8", "piece": "n"},
    {"id": "c8", "piece": "b"},
    {"id": "d8", "piece": "q"},
    {"id": "e8", "piece": "k"},
    {"id": "f8", "piece": "b"},
    {"id": "g8", "piece": "n"},
    {"id": "h8", "piece": "r"}
  ],[
    {"id": "a7", "piece": "p"},
    {"id": "b7", "piece": "p"},
    {"id": "c7", "piece": "p"},
    {"id": "d7", "piece": "p"},
    {"id": "e7", "piece": "p"},
    {"id": "f7", "piece": "p"},
    {"id": "g7", "piece": "p"},
    {"id": "h7", "piece": "p"}
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
    {"id": "a2", "piece": "P"},
    {"id": "b2", "piece": "P"},
    {"id": "c2", "piece": "P"},
    {"id": "d2", "piece": "P"},
    {"id": "e2", "piece": "P"},
    {"id": "f2", "piece": "P"},
    {"id": "g2", "piece": "P"},
    {"id": "h2", "piece": "P"}
  ],[
    {"id": "a1", "piece": "R"},
    {"id": "b1", "piece": "N"},
    {"id": "c1", "piece": "B"},
    {"id": "d1", "piece": "Q"},
    {"id": "e1", "piece": "K"},
    {"id": "f1", "piece": "B"},
    {"id": "g1", "piece": "N"},
    {"id": "h1", "piece": "R"}
  ]
]

var Piece = React.createClass({
  dragStart: function(e) {
    var e = e.nativeEvent;
    e.dataTransfer.setData("from", e.target.parentNode.id);
  },
  render: function() {
    if (this.props.data !== "_") {
      switch (this.props.data) {
        case "K":
          return <img onDragStart={this.dragStart} draggable="true" className="piece" src="http://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg" />
        case "k":
          return <img onDragStart={this.dragStart} draggable="true" className="piece" src="http://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg" />
        case "Q":
          return <img onDragStart={this.dragStart} draggable="true" className="piece" src="http://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg" />
        case "q":
          return <img onDragStart={this.dragStart} draggable="true" className="piece" src="http://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg" />
        case "R":
          return <img onDragStart={this.dragStart} draggable="true" className="piece" src="http://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg" />
        case "r":
          return <img onDragStart={this.dragStart} draggable="true" className="piece" src="http://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg" />
        case "B":
          return <img onDragStart={this.dragStart} draggable="true" className="piece" src="http://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg" />
        case "b":
          return <img onDragStart={this.dragStart} draggable="true" className="piece" src="http://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg" />
        case "N":
          return <img onDragStart={this.dragStart} draggable="true" className="piece" src="http://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg" />
        case "n":
          return <img onDragStart={this.dragStart} draggable="true" className="piece" src="http://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg" />
        case "P":
          return <img onDragStart={this.dragStart} draggable="true" className="piece" src="http://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg" />
        case "p":
          return <img onDragStart={this.dragStart} draggable="true" className="piece" src="http://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg" />
        default:
          return false;
      }
    } else {
      return false;
    }
  }
});

var Square = React.createClass({
  drop: function(e) {
    e.preventDefault();
    var e = e.nativeEvent;
    var to;
    if (e.target.className == "piece") {
      to = e.target.parentNode.id;
    } else to = e.target.id;
    console.log("from: " + e.dataTransfer.getData("from") +
                ", to: " + to);
  },
  dragOver: function(e) {
    e.preventDefault();
  },
  render: function() {
    var offset = this.props.offset;
    return <td onDrop={this.drop} onDragOver={this.dragOver} id={this.props.data.id} className={this.props.color}><Piece data={this.props.data.piece} /></td>
  }
});

var Row = React.createClass({
  render: function() {
    var offset = this.props.offset;
    var row = this.props.data.map(function(item, index) {
      return <Square key={item.id} data={item} color={(index+offset) % 2 == 0 ? 'black' : 'white'} />
    });

    return <tr>{row}</tr>
  }
});

var Board = React.createClass({
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
      return <Row data={row} offset={index % 2 == 0 ? 0 : 1} key={index} />
    });

    return <tbody>{board}</tbody>
  }
});

var View = React.render(<Board />, document.getElementById("board"));
View.setState({board: game});