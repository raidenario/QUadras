defmodule QuadrasWeb.Router do
  use QuadrasWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_live_flash)
    plug(:put_root_layout, html: {QuadrasWeb.Layouts, :root})
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
    plug(CORSPlug, origin: ["*"])
  end

  pipeline :api_auth do
    plug(QuadrasWeb.Plugs.AuthPipeline)
  end

  scope "/", QuadrasWeb do
    pipe_through(:browser)

    get("/", PageController, :home)
  end

  # =============================================================================
  # API v1 Routes
  # =============================================================================
  scope "/api/v1", QuadrasWeb.API.V1, as: :api_v1 do
    pipe_through(:api)

    # Authentication (public)
    post("/auth/register", AuthController, :register)
    post("/auth/login", AuthController, :login)

    # Public venue endpoints
    get("/venues", VenueController, :index)
    get("/venues/nearby", VenueController, :nearby)
    get("/venues/:id", VenueController, :show)
    get("/venues/:venue_id/fields", VenueController, :list_fields)
    get("/venues/:venue_id/lobby", MatchController, :show_lobby)

    # Public team endpoints
    get("/teams", TeamController, :index)
    get("/teams/:team_id/matches", MatchController, :list_matches)

    # Public match endpoints
    get("/matches/:id", MatchController, :show_match)

    # Scheduling - public endpoints
    get("/fields/:field_id/slots", SchedulingController, :list_slots)
    get("/venues/:venue_id/open-matches", SchedulingController, :list_open_matches)
  end

  # Protected API routes (require authentication)
  scope "/api/v1", QuadrasWeb.API.V1, as: :api_v1 do
    pipe_through([:api, :api_auth])

    # Auth management
    get("/auth/me", AuthController, :me)
    post("/auth/refresh", AuthController, :refresh)
    delete("/auth/logout", AuthController, :logout)
    put("/auth/location", AuthController, :update_location)

    # Team management (specific routes MUST come before :id route)
    get("/teams/me", TeamController, :my_team)
    get("/teams/my-teams", TeamController, :my_teams)
    get("/teams/:id", TeamController, :show)
    post("/teams", TeamController, :create)
    put("/teams/:id", TeamController, :update)
    post("/teams/:id/members", TeamController, :add_member)
    delete("/teams/:id/members/:user_id", TeamController, :remove_member)

    # Venue management (admin only)
    post("/venues", VenueController, :create)
    put("/venues/:id", VenueController, :update)
    post("/venues/:venue_id/fields", VenueController, :create_field)

    # Lobby/Queue operations
    post("/venues/:venue_id/lobby/join", MatchController, :join_queue)
    delete("/venues/:venue_id/lobby/leave", MatchController, :leave_queue)

    # Challenge operations
    get("/challenges", MatchController, :list_challenges)
    post("/challenges", MatchController, :create_challenge)
    post("/challenges/:id/accept", MatchController, :accept_challenge)
    post("/challenges/:id/reject", MatchController, :reject_challenge)

    # Match operations
    post("/matches/:id/score", MatchController, :report_score)
    post("/matches/:id/confirm", MatchController, :confirm_score)
    post("/matches/:id/dispute", MatchController, :dispute_score)

    # Scheduling - protected endpoints
    post("/fields/:field_id/book", SchedulingController, :book_slot)
    post("/matches/:id/join", SchedulingController, :join_match)
    delete("/matches/:id/cancel", SchedulingController, :cancel_booking)
  end

  # Health check endpoint
  scope "/api", QuadrasWeb do
    pipe_through(:api)

    get("/health", HealthController, :check)
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:quadras, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through(:browser)

      live_dashboard("/dashboard", metrics: QuadrasWeb.Telemetry)
      forward("/mailbox", Plug.Swoosh.MailboxPreview)
    end
  end
end
