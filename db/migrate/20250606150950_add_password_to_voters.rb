class AddPasswordToVoters < ActiveRecord::Migration[7.0]
  def change
    add_column :voters, :password, :string
  end
end
