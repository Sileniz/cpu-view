class getInfo {
  constructor(){
    this.cpu = document.getElementById('cpuName')
    this.ram = document.getElementById('ramName')
    this.host = document.getElementById('userName')
    this.uptime = document.getElementById('uptimeName')
    this.os = document.getElementById('osName')
    this.profile = document.getElementById('profilePicture')
    this.fileInput = document.getElementById('fileInput');
    this.fileInput.addEventListener('change', this.changeImg.bind(this));
    this.profile.addEventListener('click', () => this.fileInput.click())
  }
  async changeImg(event) {
    const file = event.target.files[0];
    if (file) {
      await window.system.saveImg(file.path);
      this.profile.src = file.path
    }
  }
  async updateInfo(){
      const info = await window.system.getSystemInfo()
      const changeImg = await window.system.getDir()
      if((info.cpus || info.ram || info.host || info.uptime || info.os || info.arc)){
        this.cpu.innerText = Object.values(info.cpus[0])[0]
        this.ram.innerText = this.formatRAM(info.ram)
        this.host.innerText = info.host 
        this.uptime.innerText =  this.formatUptime(info.uptime);
        this.os.innerText = `${info.os}/${info.arch}`
        if(changeImg){
          this.profile.src = `${changeImg}`
        }
      }else{
        this.cpu.innerText = 'No CPU information available';
      }
    }
  formatUptime(seconds){
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = Math.floor(seconds % 60)
      const formattedHours = hours.toString().padStart(2, '0')
      const formattedMinutes = minutes.toString().padStart(2, '0')
      const formattedSeconds = secs.toString().padStart(2, '0')
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;   
  }
  formatRAM(bytes) {
    if (bytes < 1024) return `${bytes} Bytes`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    else if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    else return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }  
}

const attempt = new getInfo();
attempt.updateInfo();