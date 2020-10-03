class device{
    vendorRead(value, index) {
        return this.device.controlTransferIn({
          requestType: 'class',
          request: 0x01,
          recipient: 'device',
          value: value,
          index: index
        }, 1).then(buffer => buffer[0]);
      }
    
      vendorWrite(value, index) {
        return this.device.controlTransferOut({
          requestType: 'class',
          request: 0x01,
          recipient: 'device',
          value: value,
          index: index
        });
      }
    
      setBaudRate() {
        return this.device.controlTransferIn({
          requestType: 'class',
          request: 0x21,
          recipient: 'interface',
          value: 0,
          index: 0
        }, 7).then((data) => {
          console.log(data)
          const parameters = data.data.buffer;
          parameters[4] = 0;
          parameters[5] = 0;
          parameters[6] = 0;
          return this.device.controlTransferOut({
            requestType: 'class',
            request: 0x20,
            recipient: 'interface', 
            value: 0,
            index: 0
          }, parameters)
        }).then(() => this.vendorWrite(0x0, 0x0)) // no flow control
        .then(() => this.vendorWrite(8, 0)) // reset upstream data pipes
        .then(() => this.vendorWrite(9, 0));
      }

      async readData()
      {
        let arr=[];
      
        while(true)
        {
          
        
        
         
        
           let result =  await this.device.transferIn(3,64);
         
          var string = new TextDecoder("utf-8").decode(result.data.buffer);
       // console.log(result.data.string);

       

        if(string=="k")
        {
            console.log();
            const c=arr.join("");
            let content=document.getElementById("weights").textContent;
            if(content!=c)
            {
                document.getElementById("weights").textContent=c;
            }
            arr=[];
        }
        else{
            arr.push(string);
        }
        
        
        
        
        
        
        }
      }
    
      initialize(device, range) {
        this.device = device;
        this.range = range;
        this.active = true;
        this.device.open({ baudRate: 9600 })
        .then(() => this.device.selectConfiguration(1))
        .then(() => {
          return this.device.claimInterface(0)
        })
        .then(() => this.vendorRead(0x8484, 0))
        .then(() => this.vendorWrite(0x0404, 0))
        .then(() => this.vendorRead(0x8484, 0))
        .then(() => this.vendorRead(0x8383, 0))
        .then(() => this.vendorRead(0x8484, 0))
        .then(() => this.vendorWrite(0x0404, 1))
        .then(() => this.vendorRead(0x8484, 0))
        .then(() => this.vendorRead(0x8383, 0))
        .then(() => this.vendorWrite(0, 1))
        .then(() => this.vendorWrite(1, 0))
        .then(() => this.vendorWrite(2, 0x44))
        .then(() => this.setBaudRate())
        .then(() => this.readData())
        .catch(err => {
          console.log(err);
        });
        return this.readingChanged;
      }
}


export default new device();
