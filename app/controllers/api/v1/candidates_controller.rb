module Api
  module V1
    class CandidatesController < ApplicationController
      # “require_login” comes from ApplicationController
      before_action :require_login

      # GET /api/v1/candidates
      # Returns a JSON array of all candidates with their current vote counts.
      def index
        render json: Candidate.order(:name).map { |c|
          { id: c.id, name: c.name, votes: c.votes.count }
        }
      end

      # POST /api/v1/candidates
      # Expects JSON body: { "name": "New Candidate Name" }
      # Creates a write-in candidate and immediately casts a vote for them.
      def create
        voter = current_voter

        unless voter.can_write_in?
          return render json: { error: "Cannot write in another candidate" }, status: :forbidden
        end

        new_name = params.require(:name).strip
        if new_name.blank?
          return render json: { error: "Name cannot be blank" }, status: :unprocessable_entity
        end

        candidate = Candidate.new(name: new_name)
        if candidate.save
          # Mark that this voter has used their write-in privilege
          voter.update!(wrote_in: true)

          # Immediately cast a vote for the new candidate
          Vote.create!(voter: voter, candidate: candidate)
          voter.update!(voted: true)

          render json: { id: candidate.id, name: candidate.name, votes: 1 }, status: :created
        else
          render json: { error: candidate.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
      end
    end
  end
end