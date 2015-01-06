$ ->
  Socket = new Phoenix.Socket "ws://" + location.host + "/ws"
  $status    = $ "#status"
  $messages  = $ "#messages"
  $input     = $ "#message-input"
  $username  = $ "#username"
  $body      = $ "body"

  $(window).resize ->
    $messages.height ($body.height() - 120) + "px"
    $messages.scrollTop $messages[0].scrollHeight
  .resize()

  sanitize   = (html) ->
    $("<div/>").text(html).html()

  messageTemplate = (message) ->
    username = sanitize message.user || "anonymous"
    body     = sanitize message.body
    return "<p><a href='#'>[" + username + "]</a>&nbsp; " + body + "</p>"

  Socket.join "rooms", "lobby", {}, (chan) ->
    $input.off("keypress").on "keypress", (e) ->
      if e.keyCode == 13
        chan.send "new:msg", user: $username.val(), body: $input.val()
        $input.val ""

    chan.on "join", (message) ->
      $status.text "connected"

    chan.on "new:msg", (message) ->
      $messages.append messageTemplate message
      $messages.scrollTop $messages[0].scrollHeight

    chan.on "user:entered", (msg) ->
      username = sanitize msg.user || "anonymous"
      $messages.append "<br/><i>[" + username + " entered]</i>"

    chan.on "board:state", (state) ->
      View.setState board: state

    return

  FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  Piece = React.createClass
    dragStart: (e) ->
      e = e.nativeEvent
      e.dataTransfer.setData "from", e.target.parentNode.id
      e.dataTransfer.setData "piece", e.target.id
    render: ->
      if this.props.data isnt "_"
        switch id = this.props.data
          when "K"
            <img onDragStart={this.dragStart} draggable="true" id={id} className="piece" src="/images/wK.svg" />
          when "k"
            <img onDragStart={this.dragStart} draggable="true" id={id} className="piece" src="/images/bK.svg" />
          when "Q"
            <img onDragStart={this.dragStart} draggable="true" id={id} className="piece" src="/images/wQ.svg" />
          when "q"
            <img onDragStart={this.dragStart} draggable="true" id={id} className="piece" src="/images/bQ.svg" />
          when "R"
            <img onDragStart={this.dragStart} draggable="true" id={id} className="piece" src="/images/wR.svg" />
          when "r"
            <img onDragStart={this.dragStart} draggable="true" id={id} className="piece" src="/images/bR.svg" />
          when "B"
            <img onDragStart={this.dragStart} draggable="true" id={id} className="piece" src="/images/wB.svg" />
          when "b"
            <img onDragStart={this.dragStart} draggable="true" id={id} className="piece" src="/images/bB.svg" />
          when "N"
            <img onDragStart={this.dragStart} draggable="true" id={id} className="piece" src="/images/wN.svg" />
          when "n"
            <img onDragStart={this.dragStart} draggable="true" id={id} className="piece" src="/images/bN.svg" />
          when "P"
            <img onDragStart={this.dragStart} draggable="true" id={id} className="piece" src="/images/wP.svg" />
          when "p"
            <img onDragStart={this.dragStart} draggable="true" id={id} className="piece" src="/images/bP.svg" />
      else
        return false

  Square = React.createClass
    drop: (e) ->
      e.preventDefault()
      e = e.nativeEvent;
      if e.target.className == "piece"
        to = e.target.parentNode.id
      else
        to = e.target.id
      Socket.channels[0].send "board:move", e.dataTransfer.getData("piece") + e.dataTransfer.getData("from") + to
    dragOver: (e) ->
      e.preventDefault()
    render: ->
      offset = this.props.offset;
      <td onDrop={this.drop} onDragOver={this.dragOver} id={this.props.tile} className={this.props.color}><Piece data={this.props.data} /></td>

  Row = React.createClass
    render: ->
      row = []
      for i in [0..7]
        file = FILES[i]
        tile = file + this.props.rank
        if (i + this.props.offset) % 2 == 0 then color = 'black' else color = 'white'
        row.push <Square data={this.props.data[tile]} tile={tile} color={color} key={file} />
      <tr>{row}</tr>

  Board = React.createClass
    getInitialState: ->
      board:
        a8: "r", b8: "n", c8: "b", d8: "q", e8: "k", f8: "b", g8: "n", h8: "r",
        a7: "p", b7: "p", c7: "p", d7: "p", e7: "p", f7: "p", g7: "p", h7: "p",
        a6: "_", b6: "_", c6: "_", d6: "_", e6: "_", f6: "_", g6: "_", h6: "_",
        a5: "_", b5: "_", c5: "_", d5: "_", e5: "_", f5: "_", g5: "_", h5: "_",
        a4: "_", b4: "_", c4: "_", d4: "_", e4: "_", f4: "_", g4: "_", h4: "_",
        a3: "_", b3: "_", c3: "_", d3: "_", e3: "_", f3: "_", g3: "_", h3: "_",
        a2: "P", b2: "P", c2: "P", d2: "P", e2: "P", f2: "P", g2: "P", h2: "P",
        a1: "R", b1: "N", c1: "B", d1: "Q", e1: "K", f1: "B", g1: "N", h1: "R"
    render: ->
      board = []
      for i in [0..7]
        if i % 2 == 0 then offset = 0 else offset = 1
        board.push <Row data={this.state.board} rank={8 - i} offset={offset} key={i} />
      <tbody>{board}</tbody>

  View = React.render <Board />, document.getElementById "board"

  return
