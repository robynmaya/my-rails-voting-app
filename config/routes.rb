Rails.application.routes.draw do
  # 1) Login/logout (JSON from React)
  post   "/login",  to: "sessions#create"
  delete "/logout", to: "sessions#destroy"

  # 2) Voting API under /api/v1 (always JSON)
  namespace :api do
    namespace :v1 do
      resources :candidates, only: [:index, :create]
      resources :votes,      only: [:create]
    end
  end

  # 3) RESULTS JSON endpoint MUST come before the HTML route:
  get "/results.json", to: "results#index"

  # 4) Serve React shell at /results (no format suffix)
  get "/results", to: "home#index"

  # 5) Voting page: React shell at /vote
  get "/vote", to: "home#index"

  # 6) Root: React login page
  root "home#index"
end
