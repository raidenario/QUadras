

Postgrex.Types.define(
  Quadras.PostgrexTypes,
  [Geo.PostGIS.Extension] ++ Ecto.Adapters.Postgres.extensions(),
  []
)
