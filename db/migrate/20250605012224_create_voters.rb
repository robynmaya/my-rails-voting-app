class CreateVoters < ActiveRecord::Migration[7.0]
  def change
    create_table :voters do |t|
      t.string :email,      null: false
      t.string :zip,        null: false
      t.boolean :wrote_in,  default: false, null: false
      t.boolean :voted,     default: false, null: false

      t.timestamps
    end

    add_index :voters, :email, unique: true
  end
end
