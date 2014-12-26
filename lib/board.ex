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

  def move(m) do
    Agent.update(__MODULE__, fn {board, _} ->
      <<piece, from::16, "-", to::16>> = m

      change = [
        {String.to_atom(<<from::16>>), "_"},
        {String.to_atom(<<to::16>>), <<piece>>}
      ] |> Enum.into %HashDict{}

      {Dict.merge(board, change), []}
    end)
  end

  def show() do
    Agent.get(__MODULE__, fn {board, _} ->
      board
    end)
  end

  def destroy(), do: Agent.stop(__MODULE__)
end
