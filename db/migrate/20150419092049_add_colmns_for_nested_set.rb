class AddColmnsForNestedSet < ActiveRecord::Migration
  def self.up
    add_column :notes, :parent_id, :integer # Comment this line if your project already has this column
    # Category.where(parent_id: 0).update_all(parent_id: nil) # Uncomment this line if your project already has :parent_id
    add_column :notes, :lft,       :integer
    add_column :notes, :rgt,       :integer

    # optional fields
    add_column :notes, :depth,          :integer
    add_column :notes, :children_count, :integer

    # This is necessary to update :lft and :rgt columns
    Note.rebuild!
  end

  def self.down
    remove_column :notes, :parent_id
    remove_column :notes, :lft
    remove_column :notes, :rgt

    # optional fields
    remove_column :notes, :depth
    remove_column :notes, :children_count
  end
end
