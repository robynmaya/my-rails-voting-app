class Voter < ApplicationRecord
  has_one :vote, dependent: :destroy #  vote is destroyed if voter is deleted
  has_one :candidate, through: :vote

  validates :email, presence: true, uniqueness: true
  validates :zip, presence: true

  # Before saving, ensure the voter has not already voted and less than 10 candidates exist
  def can_write_in? 
    !wrote_in && (Candidate.count < 10)
  end

  def can_vote?
    !voted
  end
end
