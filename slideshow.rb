require 'rubygems' 
require 'sinatra'
require 'dm-core'
require 'dm-timestamps'
require 'RedCloth'

configure do 
  DataMapper.setup(:default, "sqlite3://#{Dir.pwd}/slides.sqlite3")

  class Slide
    include DataMapper::Resource
    property :id,       Serial
    property :title,    String,   :nullable=>false, :lazy=>false
    property :body,     Text,     :nullable=>false, :lazy=>false
    property :position, Integer,  :nullable=>false
    timestamps :at
    
    before :create do
      self.position = Slide.all.size + 1
    end 
  end

  DataMapper.auto_upgrade!
end 

# list the notes
get '/' do
  erb :index
end

# edit form for a note
get '/:id/edit' do
  @slide = Slide.get(params[:id])
  erb :edit
end 

# confirmation page for deleting a note
get '/:id/destroy' do
  @slide = Slide.get(params[:id])
  erb :destroy
end 

# creates a note
post '/' do
  Slide.create(params[:slide])
  redirect '/'
end

# updates a note
put '/:id' do
  Slide.get(params[:id]).update_attributes(params[:slide])
  redirect '/#slide_' + params[:id]
end 

# destroys a note
delete '/:id' do
  Slide.get(params[:id]).destroy
  redirect '/'
end