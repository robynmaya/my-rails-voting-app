class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }
  private

  def current_voter
    @current_voter ||= Voter.find_by(id: session[:voter_id])
  end

  def require_login
    render json: { error: "Must be logged in" }, status: :unauthorized unless current_voter
  end
end
