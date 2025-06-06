class ResultsController < ApplicationController
  def index
    data = Candidate
             .left_joins(:votes)
             .group("candidates.id")
             .order("COUNT(votes.id) DESC, candidates.name ASC")
             .pluck("candidates.name, COUNT(votes.id) AS votes_count")
             .map { |name, count| { name: name, votes: count } }
    render json: data
  end
end