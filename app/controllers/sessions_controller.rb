class SessionsController < ApplicationController
  # POST /login
  # Expects JSON: { email: "...", zip: "..." }
  def create
    voter = Voter.find_or_initialize_by(email: params[:email].to_s.downcase)
    voter.zip = params[:zip]
    # If persisted, the existing voter's zip stays as it is
    voter.save! unless voter.persisted?

    session[:voter_id] = voter.id
    render json: { success: true, voter_id: voter.id }, status: :ok
  end

  # DELETE /logout
  def destroy
    session.delete(:voter_id)
    render json: { success: true }, status: :ok
  end
end
