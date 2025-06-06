Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Session (login) routes-handled via JSON from React
  # Login/logout actions explicitly render json: too, so no defaults: is needed.
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  # Unauthenticated "results" dashboard
  # Force it to default to json 
  # So browser GET to /results would not cause Rails to look for an HTML view
  get '/results', to: 'results#index', defaults: { format: :json }

  # "Voting" API controllers (under /api/v1) always render json: inside the action, so no defaults: is needed.
  namespace :api do
    namespace :v1 do
      resources :candidates,  only: [:index, :create] # only need to list all and write-in a candidate
      resources :votes,       only: [:create] # only need to cast a vote
    end
  end
  # Defines the root path route ("/")
  root "home#index"
end
