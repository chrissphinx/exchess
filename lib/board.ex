defmodule Board do
  @moduledoc """
  Agent interface representing Chessboard state.
  """

  @board [
    a8: "r", b8: "n", c8: "b", d8: "q", e8: "k", f8: "b", g8: "n", h8: "r",
    a7: "p", b7: "p", c7: "p", d7: "p", e7: "p", f7: "p", g7: "p", h7: "p",
    a6: "_", b6: "_", c6: "_", d6: "_", e6: "_", f6: "_", g6: "_", h6: "_",
    a5: "_", b5: "_", c5: "_", d5: "_", e5: "_", f5: "_", g5: "_", h5: "_",
    a4: "_", b4: "_", c4: "_", d4: "_", e4: "_", f4: "_", g4: "_", h4: "_",
    a3: "_", b3: "_", c3: "_", d3: "_", e3: "_", f3: "_", g3: "_", h3: "_",
    a2: "P", b2: "P", c2: "P", d2: "P", e2: "P", f2: "P", g2: "P", h2: "P",
    a1: "R", b1: "N", c1: "B", d1: "Q", e1: "K", f1: "B", g1: "N", h1: "R"
  ]
  
  @doc """
  Create a new board.
  """
  def create() do
    Agent.start_link(fn ->
      {Enum.into(@board, %HashDict{}), []}
    end, name: __MODULE__)
  end

  @doc """
  Reset all pieces to their starting locations.
  """
  def reset() do
    Agent.update(__MODULE__, fn {_, _} ->
      {Enum.into(@board, %HashDict{}), []}
    end)
  end

  @doc """
  Attempt to move a piece on the board. Expects a string of the format: `"(Piece)(From)(To)"`

  ## Example

      iex> Board.move("Pe2e4")
      :ok
  """
  def move(move) do
    Agent.update(__MODULE__, fn {board, _} ->
      case is_legal? board, move do
        {:ok, {piece, from, to}} ->
          change = [
            {from, "_"},
            {to, <<piece>>}
          ] |> Enum.into %HashDict{}

          {Dict.merge(board, change), []}
        {:error, _} ->
          {board, []}
      end
    end)
  end

  defp is_legal?(board, move) do
    {:ok, {board, move}} |> color? |> valid? |> blockers?
  end

  defp color?({_, {board, move}}) do
    <<piece, from :: 16, to :: 16>> = move

    <<occupant>> = Dict.fetch! board, String.to_atom(<<to :: 16>>)
    occupant =
      cond do
        occupant == ?_ ->
          false
        occupant >= ?B and occupant <= ?R ->
          :white
        true ->
          :black
      end

    color = if piece > 65 and piece < 90, do: :white, else: :black
    case occupant do
      ^color -> {:error, {}}
      _      -> {:ok,    {board, piece, occupant, from, to}}
    end # -> valid?
  end

  defp valid?({:ok, {board, piece, occupant, from, to}}) do
    <<from_file, from_rank>> = <<from :: 16>>
    <<to_file, to_rank>>     =   <<to :: 16>>

    y1 = (from_rank - 48)
    dx = (to_file - 96) - (from_file - 96)
    dy = (to_rank - 48) - y1

    { # return {:ok/:error, {}}
      cond do
        # KING
        ?K == piece or ?k == piece ->
          if abs(dx) <= 1 and abs(dy) <= 1, do: :ok, else: :error
        # QUEEN
        ?Q == piece or ?q == piece ->
          if dx == 0 or dy == 0 or abs(dx) == abs(dy), do: :ok, else: :error
        # ROOK
        ?R == piece or ?r == piece ->
          if dx == 0 or dy == 0, do: :ok, else: :error
        # BISHOP
        ?B == piece or ?b == piece ->
          if abs(dx) == abs(dy), do: :ok, else: :error
        # KNIGHT
        ?N == piece or ?n == piece ->
          if abs(dx) >= 1 and abs(dy) >= 1
          and abs(dx) + abs(dy) == 3, do: :ok, else: :error
        # WHITE PAWN
        ?P == piece ->
          if dx == 0 and dy == 1 and !occupant
          or abs(dx) == 1 and dy == 1 and occupant == :black
          or dx == 0 and y1 == 2 and dy == 2 and !occupant, do: :ok, else: :error
        # BLACK PAWN
        ?p == piece ->
          if dx == 0 and dy == -1 and !occupant
          or abs(dx) == 1 and dy == -1 and occupant == :white
          or dx == 0 and y1 == 7 and dy == -2 and !occupant, do: :ok, else: :error
      end,
      {board, piece, from, to, dx, dy, from_file, to_file, from_rank, to_rank}
    } # -> blockers?
  end

  defp valid?({:error, _}) do
    {:error, {}}
  end

  defp blockers?({:ok, {board, piece, from, to, dx, dy, from_file, to_file, from_rank, to_rank}}) do
    x = sign dx
    y = sign dy

    { # return {:ok/:error, {}}
      cond do
        piece == ?N or piece == ?n ->
          :ok
        true ->
          if (Stream.unfold(
            <<from_file, from_rank>>,
            fn <<f, r>> when f == to_file and r == to_rank -> nil;
              <<f, r>> -> {<<f, r>>, <<f+x>> <> <<r+y>>}
            end)
          |> Enum.to_list
          |> tl
          |> Enum.map_reduce(
            true,
            fn(e, acc) ->
              {e, acc and Dict.fetch!(board, String.to_atom(e)) == "_"}
            end)
          |> elem 1), do: :ok, else: :error
      end,
      {piece, String.to_atom(<<from :: 16>>), String.to_atom(<<to :: 16>>)}
    } # -> check?
  end

  defp blockers?({:error, _}) do
    {:error, {}}
  end

  defp sign(n) do
    cond do
      n < 0 ->
        -1
      n == 0 ->
        0
      n > 0 ->
        1
    end
  end

  @doc """
  Obtain the current board's state as a `HashDict`.
  """
  def show() do
    Agent.get(__MODULE__, fn {board, _} ->
      board
    end)
  end

  @doc """
  Destroy the board.
  """
  def destroy(), do: Agent.stop(__MODULE__)
end
