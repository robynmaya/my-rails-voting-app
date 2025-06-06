module Api
  module V1
    class VotesController < ApplicationController
      # “require_login” comes from ApplicationController
      before_action :require_login

      # POST /api/v1/votes
      # Expects JSON: { candidate_id: 123 }
      def create
        # “current_voter” comes from ApplicationController
        voter = current_voter

        unless voter.can_vote?
          return render json: { error: "Already voted" }, status: :forbidden
        end

        candidate = Candidate.find_by(id: params[:candidate_id])
        unless candidate
          return render json: { error: "Candidate not found" }, status: :not_found
        end

        # Create the vote and mark the voter as having voted
        Vote.create!(voter: voter, candidate: candidate)
        voter.update!(voted: true)

        render json: { success: true, candidate_id: candidate.id }, status: :created
      end
    end
  end
end