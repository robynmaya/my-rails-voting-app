class SessionsController < ApplicationController
  skip_forgery_protection only: [:create, :destroy]
  # POST /login
  # Expects JSON: { email: "...", zip: "..." }
  def create
    voter = Voter.find_or_initialize_by(email: params[:email].to_s.downcase)
    voter.zip      = params[:zip]
    voter.password = params[:password]

    if voter.save
      session[:voter_id] = voter.id
      render json: { success: true, voter_id: voter.id }
    else
      render json: { errors: voter.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /logout
  def destroy
    session.delete(:voter_id)
    render json: { success: true }, status: :ok
  end
end
