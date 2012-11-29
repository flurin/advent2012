#  Script to generate missing pages
# 

require 'tilt'

template = Tilt::ERBTemplate.new(File.dirname(__FILE__) + "/template.html.erb")

days = [nil] + %w{1st 2nd 3rd 4th 5th 6th 7th 8th 9th 10th 11th 12th 13th 14th 15th 16th 17th 18th 19th 20th 21st 22nd 23rd 24th}

items = File.read(File.dirname(__FILE__) + "/not-yet.txt").split("----\n").map do |item|
  title, body = item.split("\n", 2)
  tmp, day, title = title.split(/(\d+)\s(.*)/)
  {:day => day.to_i, :day_ord => days[day.to_i], :title  => title, :body => body, :file => "#{day}/index.html"}
end

items.sort!{|a,b| a[:day] <=> b[:day]}

build_dir = File.dirname(__FILE__) + "/build/"
if !File.exist?(build_dir)
  system("mkdir #{build_dir}")
end

Dir.chdir(File.dirname(__FILE__) + "/build/") do
  items.each_with_index do |item, i|
  
    if !File.exist?(item[:day].to_s)
      system("mkdir #{item[:day]}")
    end
    
    scope = item.dup
    
    if items[i+1]
      scope[:tomorrow] = items[i+1]
    end
    if i > 0
      scope[:yesterday] = items[i-1]
    end
    
    output = template.render(Object.new, {:item => scope})
    
    File.open(scope[:file], "w"){|fh| fh.write output }
    
  end
end