# =====================
# = Generate all days =
# =====================
# Including:
#  - JS
#  - CSS
#  - HTML

require 'tilt'
require 'artii'

days = [nil] + %w{1st 2nd 3rd 4th 5th 6th 7th 8th 9th 10th 11th 12th 13th 14th 15th 16th 17th 18th 19th 20th 21st 22nd 23rd 24th}

renderer = Artii::Base.new

all_font_files = %w{univers.flf
tombstone.flf
tinker-toy.flf
thin.flf
anja.flf
stop.flf
stellar.flf
speed.flf
standard.flf
smscript.flf
smshadow.flf
slant.flf
sblood.flf
rozzo.flf
rectangles.flf
pawp.flf
nancyj.flf
marquee.flf
lean.flf
kban.flf
larry3d.flf
graffiti.flf
fraktur.flf
epic.flf
drpepper.flf
cricket.flf
cosmic.flf
bdffonts/xhelvbi.flf
bdffonts/clr8x8.flf
basic.flf
alligator2.flf
computer.flf
3-d.flf}.map{|s| s.strip}

template = Tilt::ERBTemplate.new(File.dirname(__FILE__) + "/template_pages.html.erb")

build_dir = File.dirname(__FILE__) + "/build/"
if !File.exist?(build_dir)
  system("mkdir #{build_dir}")
end
Dir.chdir(File.dirname(__FILE__) + "/build/") do
  (1..24).each do |nr|
  
    font = Artii::Figlet::Font.new(File.join(Artii::FONTPATH, all_font_files.slice(rand(all_font_files.size))))      
    figlet = Artii::Figlet::Typesetter.new(font)

    banner = <<-EOT
/*

Digitpaint HTML and CSS Advent 2012

#{figlet["December #{days[nr]}"]}

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  
EOT
  
    if !File.exist?(nr.to_s)
      system("mkdir #{nr}")
    end
    
    scope = {:nr => nr}
    
    if nr < 24
      scope[:tomorrow] = "/#{nr + 1}/"
    end
    if nr > 1
      scope[:yesterday] = "/#{nr - 1}/"
    end
    
    output = template.render(Object.new, {:item => scope})
  
    File.open("#{nr}/#{nr}.js", "w")  {|fh| fh.write banner }
    File.open("#{nr}/#{nr}.css", "w")  {|fh| fh.write banner }
    File.open("#{nr}/index.html", "w"){|fh| fh.write output }
  
  end
end