defmodule Board do

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
  
  def create() do
    Agent.start_link(fn ->
      {Enum.into(@board, %HashDict{}), []}
    end, name: __MODULE__)
  end

  def reset() do
    Agent.update(__MODULE__, fn {_, _} ->
      {Enum.into(@board, %HashDict{}), []}
    end)
  end

  def move(move) do
    Agent.update(__MODULE__, fn {board, _} ->
      case is_valid? board, move do
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

  defp is_valid?(board, move) do
    <<piece, from_file, from_rank, to_file, to_rank>> = move
    from = String.to_atom <<from_file>> <> <<from_rank>>
    to   = String.to_atom <<to_file>> <> <<to_rank>>

    x1   = (from_file - 96)
    x2   = (to_file - 96)
    dx   = x2 - x1
    y1   = (from_rank - 48)
    y2   = (to_rank - 48)
    dy   = y2 - y1

    color = if piece > 65 and piece < 90, do: :white, else: :black
    <<occupant>> = Dict.fetch! board, to
    occupant =
      cond do
        occupant == ?_ ->
          false
        occupant >= ?B and occupant <= ?R ->
          :white
        true ->
          :black
      end

    cond do
      ?K == piece or ?k == piece ->
        returning =
          if abs(dx) <= 1 and abs(dy) <= 1, do: :ok, else: :error
      ?Q == piece or ?q == piece ->
        returning =
          if dx == 0 or dy == 0 or abs(dx) == abs(dy), do: :ok, else: :error
      ?R == piece or ?r == piece ->
        returning =
          if dx == 0 or dy == 0, do: :ok, else: :error
      ?B == piece or ?b == piece ->
        returning =
          if abs(dx) == abs(dy), do: :ok, else: :error
      ?N == piece or ?n == piece ->
        returning =
          if abs(dx) >= 1 and abs(dy) >= 1
          and abs(dx) + abs(dy) == 3, do: :ok, else: :error
      ?P == piece ->
        returning =
          if abs(dx) <= 1 and dy == 1
          or y1 == 2 and dy == 2, do: :ok, else: :error
      ?p == piece ->
        returning =
          if abs(dx) <= 1 and dy == -1
          or y1 == 7 and dy == -2, do: :ok, else: :error
    end

    if returning == :ok do
      returning = 
        cond do
          piece == ?N or piece == ?n ->
            :ok
          dx == 0 and dy > 0 ->
            if (Stream.unfold(
              <<from_file, from_rank>>,
              fn <<f, r>> when f == to_file and r == to_rank -> nil;
                <<f, r>> -> {<<f, r>>, <<f>> <> <<r+1>>}
              end)
            |> Enum.to_list
            |> tl
            |> Enum.map_reduce(
              true,
              fn(e, acc) ->
                {e, acc and Dict.fetch!(board, String.to_atom(e)) == "_"}
              end)
            |> elem 1), do: :ok, else: :error
          dx > 0 and dy > 0 ->
            if (Stream.unfold(
              <<from_file, from_rank>>,
              fn <<f, r>> when f == to_file and r == to_rank -> nil;
                <<f, r>> -> {<<f, r>>, <<f+1>> <> <<r+1>>}
              end)
            |> Enum.to_list
            |> tl
            |> Enum.map_reduce(
              true,
              fn(e, acc) ->
                {e, acc and Dict.fetch!(board, String.to_atom(e)) == "_"}
              end)
            |> elem 1), do: :ok, else: :error
          dx > 0 and dy == 0 ->
            if (Stream.unfold(
              <<from_file, from_rank>>,
              fn <<f, r>> when f == to_file and r == to_rank -> nil;
                <<f, r>> -> {<<f, r>>, <<f+1>> <> <<r>>}
              end)
            |> Enum.to_list
            |> tl
            |> Enum.map_reduce(
              true,
              fn(e, acc) ->
                {e, acc and Dict.fetch!(board, String.to_atom(e)) == "_"}
              end)
            |> elem 1), do: :ok, else: :error
          dx > 0 and dy < 0 ->
            if (Stream.unfold(
              <<from_file, from_rank>>,
              fn <<f, r>> when f == to_file and r == to_rank -> nil;
                <<f, r>> -> {<<f, r>>, <<f+1>> <> <<r-1>>}
              end)
            |> Enum.to_list
            |> tl
            |> Enum.map_reduce(
              true,
              fn(e, acc) ->
                {e, acc and Dict.fetch!(board, String.to_atom(e)) == "_"}
              end)
            |> elem 1), do: :ok, else: :error
          dx == 0 and dy < 0 ->
            if (Stream.unfold(
              <<from_file, from_rank>>,
              fn <<f, r>> when f == to_file and r == to_rank -> nil;
                <<f, r>> -> {<<f, r>>, <<f>> <> <<r-1>>}
              end)
            |> Enum.to_list
            |> tl
            |> Enum.map_reduce(
              true,
              fn(e, acc) ->
                {e, acc and Dict.fetch!(board, String.to_atom(e)) == "_"}
              end)
            |> elem 1), do: :ok, else: :error
          dx < 0 and dy < 0 ->
            if (Stream.unfold(
              <<from_file, from_rank>>,
              fn <<f, r>> when f == to_file and r == to_rank -> nil;
                <<f, r>> -> {<<f, r>>, <<f-1>> <> <<r-1>>}
              end)
            |> Enum.to_list
            |> tl
            |> Enum.map_reduce(
              true,
              fn(e, acc) ->
                {e, acc and Dict.fetch!(board, String.to_atom(e)) == "_"}
              end)
            |> elem 1), do: :ok, else: :error
          dx < 0 and dy == 0 ->
            if (Stream.unfold(
              <<from_file, from_rank>>,
              fn <<f, r>> when f == to_file and r == to_rank -> nil;
                <<f, r>> -> {<<f, r>>, <<f-1>> <> <<r>>}
              end)
            |> Enum.to_list
            |> tl
            |> Enum.map_reduce(
              true,
              fn(e, acc) ->
                {e, acc and Dict.fetch!(board, String.to_atom(e)) == "_"}
              end)
            |> elem 1), do: :ok, else: :error
          dx < 0 and dy > 0 ->
            if (Stream.unfold(
              <<from_file, from_rank>>,
              fn <<f, r>> when f == to_file and r == to_rank -> nil;
                <<f, r>> -> {<<f, r>>, <<f-1>> <> <<r+1>>}
              end)
            |> Enum.to_list
            |> tl
            |> Enum.map_reduce(
              true,
              fn(e, acc) ->
                {e, acc and Dict.fetch!(board, String.to_atom(e)) == "_"}
              end)
            |> elem 1), do: :ok, else: :error
        end
    end

    returning = if occupant == color, do: :error, else: returning

    {returning, {piece, from, to}}
  end

  def show() do
    Agent.get(__MODULE__, fn {board, _} ->
      board
    end)
  end

  def destroy(), do: Agent.stop(__MODULE__)
end
