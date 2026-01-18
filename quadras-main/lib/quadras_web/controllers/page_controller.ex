defmodule QuadrasWeb.PageController do
  use QuadrasWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
