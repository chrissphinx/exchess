defmodule Board do

  @board [
    a8: "Qr", b8: "Qn", c8: "Qb", d8: "Bq", e8: "Bk", f8: "Kb", g8: "Kn", h8: "Kr",
    a7: "ap", b7: "bp", c7: "cp", d7: "dp", e7: "ep", f7: "fp", g7: "gp", h7: "hp",
    a6: "_",  b6: "_",  c6: "_",  d6: "_",  e6: "_",  f6: "_",  g6: "_",  h6: "_",
    a5: "_",  b5: "_",  c5: "_",  d5: "_",  e5: "_",  f5: "_",  g5: "_",  h5: "_",
    a4: "_",  b4: "_",  c4: "_",  d4: "_",  e4: "_",  f4: "_",  g4: "_",  h4: "_",
    a3: "_",  b3: "_",  c3: "_",  d3: "_",  e3: "_",  f3: "_",  g3: "_",  h3: "_",
    a2: "aP", b2: "bP", c2: "cP", d2: "dP", e2: "eP", f2: "fP", g2: "gP", h2: "hP",
    a1: "QR", b1: "QN", c1: "QB", d1: "WQ", e1: "WK", f1: "WB", g1: "WN", h1: "WR"
  ]
  
  def create() do
    Agent.start_link(fn ->
      {Enum.into(@board, %HashDict{}), []}
    end, name: __MODULE__)
  end

  def move(m) do
    Agent.update(__MODULE__, fn {board, moves} ->
      <<from_square::16, "-", to_square::16>> = m
      from_square = String.to_atom <<from_square::16>>

      new_board =
        Dict.put(board, from_square, :_) |>
        Dict.put String.to_atom(<<to_square::16>>), Dict.get(board, from_square)

      {new_board, [m|moves]}
    end)
  end

  def show() do
    Agent.get(__MODULE__, fn {board, _} ->
      HashDict.to_list(board) |> Enum.into %{}
    end)
  end

  def destroy(), do: Agent.stop(__MODULE__)
end
