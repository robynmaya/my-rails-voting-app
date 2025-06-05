class Vote < ApplicationRecord
  belongs_to :voter
  belongs_to :candidate

  validates :voter_id, uniqueness: true # one vote per voter
end
