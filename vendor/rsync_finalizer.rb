require 'shellwords'

class RsyncFinalizer
  
  def initialize(options = {})
    @options = {
      :rsync => "rsync",
      :remote_path => "",
      :host => "",
      :username  => ""
    }.update(options)
  end
  
  def call(release, options = {})
    options = @options.dup.update(options)
    
    # Validate options
    validate_options!(release, options)
    
    begin
      `#{@options[:rsync]} --version`
    rescue Errno::ENOENT
      raise RuntimeError, "Could not find rsync in #{@options[:rsync].inspect}"
    end    
    

    local_path = release.build_path.to_s
    remote_path = options[:remote_path]
    
    local_path += "/" unless local_path =~ /\/\Z/
    remote_path += "/" unless remote_path =~ /\/\Z/    

    release.log(self, "Starting upload of #{(release.build_path + "*")} to #{options[:host]}")
    
    command = "rsync -az #{Shellwords.escape(local_path)} #{Shellwords.escape(options[:username])}@#{Shellwords.escape(options[:host])}:#{Shellwords.escape(remote_path)}"
    
    # Run r.js optimizer
    output = `#{command}`
        
    # Check if r.js succeeded
    unless $?.success?
      raise RuntimeError, "Rsync failed.\noutput:\n #{output}"
    end
        
  end
  
  protected
  
  def validate_options!(release, options)
    must_have_keys = [:remote_path, :host, :username]
    if (options.keys & must_have_keys).size != must_have_keys.size
      release.log(self, "You must specify these options: #{(must_have_keys - options.keys).inspect}")
      raise "Missing keys: #{(must_have_keys - options.keys).inspect}"
    end
  end
  
end