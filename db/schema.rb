# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150419105602) do

  create_table "note_links", force: :cascade do |t|
    t.integer  "note_id"
    t.integer  "parent_id"
    t.integer  "position"
    t.integer  "link_type_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "note_links", ["link_type_id"], name: "index_note_links_on_link_type_id"
  add_index "note_links", ["note_id"], name: "index_note_links_on_note_id"
  add_index "note_links", ["parent_id"], name: "index_note_links_on_parent_id"
  add_index "note_links", ["position"], name: "index_note_links_on_position"

  create_table "notes", force: :cascade do |t|
    t.text     "text"
    t.integer  "xpos"
    t.integer  "ypos"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.integer  "parent_id"
    t.integer  "lft"
    t.integer  "rgt"
    t.integer  "depth"
    t.integer  "children_count"
  end

end
