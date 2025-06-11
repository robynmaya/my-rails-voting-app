class CreateVotes < ActiveRecord::Migration[7.0]
  def change
    create_table :votes do |t|
      t.references :voter, null: false, foreign_key: true
      t.references :candidate, null: false, foreign_key: true

      t.timestamps
    end

    # Ensure a voter can only vote once
    add_index :votes, :voter_id, unique: true unless index_exists?(:votes, :voter_id)
  end
end