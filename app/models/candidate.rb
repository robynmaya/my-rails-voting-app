class Candidate < ApplicationRecord
  has_many :votes, dependent: :destroy # vote is destroyed if candidate is deleted
  has_many :voters, through: :votes

  validates :name, presence: true, uniqueness: true
  validates :max_candidates_not_exceeded, on: :create

  private

  def max_candidates_not_exceeded?
    if Candidate.count >= 10
      errors.add(:base, "Cannot have more than 10 candidates")
    end
  end
end
