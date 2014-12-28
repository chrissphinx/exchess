defmodule Chat.RoomChannel do
  use Phoenix.Channel

  @doc """
  Authorize socket to subscribe and broadcast events on this channel & topic

  Possible Return Values

  {:ok, socket} to authorize subscription for channel for requested topic

  {:error, socket, reason} to deny subscription/broadcast on this channel
  for the requested topic
  """
  def join(socket, "lobby", message) do
    IO.puts "JOIN #{socket.channel}:#{socket.topic}"
    reply socket, "join", %{status: "connected"}
    Board.create
    reply socket, "board:state", Board.show
    IO.puts "SENT board:state"
    broadcast socket, "user:entered", %{user: message["user"]}
    {:ok, socket}
  end

  def join(socket, _private_topic, _message) do
    {:error, socket, :unauthorized}
  end

  def event(socket, "new:msg", message) do
    IO.puts "MSG #{socket.channel}:#{socket.topic}"
    if Regex.match?(~r/[a-h][1-8][a-h][1-8]/, message["body"]) do
      Board.move message["body"]
      broadcast socket, "board:state", Board.show
    else
      broadcast socket, "new:msg", message
    end
    socket
  end

  def event(socket, "board:move", message) do
    IO.puts "MOVE #{socket.channel}:#{socket.topic} #{message}"
    Board.move message
    broadcast socket, "board:state", Board.show
    socket
  end
end

