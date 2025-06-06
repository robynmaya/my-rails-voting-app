Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Session (login) routes
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  # Unauthenticated "results" dashboard
  get '/results', to: 'results#index'

  # All the "voting" endpoints under /api/v1
  namespace :api do
    namespace :v1 do
      resources :candidates,  only: [:index, :create] # only need to list all and write in a candidate
      resources :votes,       only: [:create] # only need to cast a vote
    end
  end
  # Defines the root path route ("/")
  root "home#index"
end
