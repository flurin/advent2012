#  Script to generate missing pages
# 

require 'tilt'
require 'fastimage'

template = Tilt::ERBTemplate.new(File.dirname(__FILE__) + "/template_email.html.erb")

days = %w{1st 2nd 3rd 4th 5th 6th 7th 8th 9th 10th 11th 12th 13th 14th 15th 16th 17th 18th 19th 20th 21st 22nd 23rd 24th}

buttons = "Let's go there!
Let's see 'm!
Check it!
Iiiiinnnnterested?
Show me what you got!
Go go go!
I have to see this!
Take me there!
On to the show!
Enter here
Click for the magic to start
Open sesame
Let's go!
And we're off!
Find out more
Take me to your leader
Ready for blast-off!
Show me the money!
Lead the way
Off we go!
Into the rabbithole
Read more
Show me how it's done!
Clickedyclickclick here!".split("\n")


build_dir = File.dirname(__FILE__) + "/build/"
if !File.exist?(build_dir)
  system("mkdir #{build_dir}")
end

Dir.chdir(File.dirname(__FILE__) + "/../html/") do
  days.each_with_index do |item, i|
    dayNo = i+1;
    

    puts File.dirname(__FILE__) + "/../html/assets/newsletter/numbers/#{"%02d" % dayNo}.png"
    puts FastImage.size(File.dirname(__FILE__) + "/../html/assets/newsletter/numbers/#{"%02d" % dayNo}.png").inspect
    
    item = {
      :nr => dayNo,
      :title => "TITLE",
      :intro => "INTRO",
      :button_text => buttons[i],
      :nr_size => FastImage.size(File.dirname(__FILE__) + "/../html/assets/newsletter/numbers/#{"%02d" % dayNo}.png")
    }
    
    if !File.exist?("#{item[:nr].to_s}/email.html")
      next
    end
    
    output = template.render(Object.new, {:item => item})
    File.open("#{item[:nr].to_s}/email.html", "w"){|fh| fh.write output }
    
  end
end