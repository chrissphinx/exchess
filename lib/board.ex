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
      {@board, []}
    end, name: __MODULE__)
  end

  def move(m) do
    Agent.update(__MODULE__, fn {board, moves} ->
      <<from_square::16, "-", to_square::16>> = m
      from_square = String.to_atom <<from_square::16>>
      to_square = String.to_atom <<to_square::16>>
      {_, piece} = List.keyfind(board, from_square, 0)

      new_board =
        List.keyreplace(board, to_square, 0, {to_square, piece})
        |> List.keyreplace(from_square, 0, {from_square, "_"})

      {new_board, [m|moves]}
    end)
  end

  def show() do
    Agent.get(__MODULE__, fn {board, _} ->
      %{board: 
          board
          |> Enum.scan([], fn(e, _) -> %Tile{id: elem(e, 0), piece: elem(e, 1)} end)
          |> Enum.chunk(8)
        }
    end)
  end

  def destroy(), do: Agent.stop(__MODULE__)
end
