require 'builder'
require 'hpricot'

class RssGenerator
  
  def call(release, options={})
    feed = generate_feed(release.build_path)
    File.open(release.build_path + "feed.rss", "w"){|f| f.write feed }
  end
  
  
  def generate_feed(path, feed_file=nil)
    feed = ""

    # We take a day if it has a \d.css of a \d.js
    days = Dir.glob(path + "**/*.{css,js}").map{|p| p[/\/(\d+)\//,1]}.compact.map{|i| i.to_i }.uniq.sort
  
    xml = Builder::XmlMarkup.new(:target => feed); nil
    xml.instruct!

    xml.rss "version" => "2.0", "xmlns:dc" => "http://purl.org/dc/elements/1.1/" do
      xml.channel do

        xml.title       "HTML and CSS Advent 2012"
        xml.link        "http://advent2011.digitpaint.nl"
        xml.pubDate     CGI.rfc1123_date Time.now
        xml.description "24 daily nuggets of HTML/CSS knowledge, brought to you by the front-end specialists at Digitpaint."


        days.to_a.reverse.each do |day|
          doc = Hpricot(File.read(path + "#{day}/index.html"))
          
          xml.item do
            xml.title       doc.at(".main > .article-header h1").inner_text.strip
            xml.link        "http://advent2012.digitpaint.nl/#{day}/"
            xml.description doc.at(".main > .body .intro").inner_text.strip
            xml.pubDate     CGI.rfc1123_date Time.new(2012,12,day,12,0,0)
            xml.guid        "http://advent2012.digitpaint.nl/#{day}/"
            xml.author      "Digitpaint"
          end
        end

      end
    end
  
    return feed
  end
  
end