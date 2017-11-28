const Timestamp = require('atm-timestamp');
const Log = require('atm-logging');

class Trace{
  constructor(){
    this.timestamp = new Timestamp();
    this.log = new Log();
  }

  /**
   * [dump description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  dump(binary_data){
    let data = binary_data.toString('binary');
    let dump = '';
    let hex_line = '';
    let ascii_line = '';
    let padding  = '    ';

    for (let i in data) {
      let charcode = data.charCodeAt(i);
      (charcode >= 16) ? (hex_line += charcode.toString(16) + ' ') : (hex_line += '0' + charcode.toString(16) + ' ');
      (charcode >= 32 && charcode <= 126) ? (ascii_line += data[i]) : (ascii_line += '.');

      if(i % 16 === 15){  
        dump = dump + '    ' + hex_line + padding + ascii_line + '\n';
        hex_line = '';
        ascii_line = '';
      }
    }

    if (hex_line){
      for (let i = 0; i < (16 - ascii_line.length); i++)
        padding += '   ';
      dump = dump + '    ' + hex_line + padding + ascii_line;
    }

    return dump;
  }

  getKeyMaxLength(data){
    let maxLen = 0;
    if(data instanceof Map){
      for (let key of data.keys())
        if (key.length > maxLen)
          maxLen = key.length;
    } else {
      for (let key in data)
        if (key.length > maxLen)
          maxLen = key.length;
    }
    return maxLen;
  }

  /**
   * [object display the fields of javascript object]
   * @param  {[type]} data  [object to display]
   * @return {[type]}       [description]
   */
  object(data){
    if(!data)
      return '';

    let dump = '\n';

    let maxLen = this.getKeyMaxLength(data);

    if(data instanceof Map){
      for (let [key, value] of data.entries()){
        let key_name = key;
        while(key_name.length < maxLen)
          key_name += ' ';

        dump += '  [' + key_name + ']: [' + value.toString().replace(/[^\x20-\x7E,\n]+/g, '.') + ']\n';   
      }
    } else {
      for (let key in data) {
        let key_name = key;
        while(key_name.length < maxLen)
          key_name += ' ';

        if(typeof(data[key]) === 'object'){
          dump += '  [' + key_name + ']: ' + JSON.stringify(data[key]).replace(/[^\x20-\x7E,\n]+/g, '.') + '\n'; 
        } else {
          dump += '  [' + key_name + ']: [' + data[key].toString().replace(/[^\x20-\x7E,\n]+/g, '.') + ']\n'; 
        }
      }
    }
    return dump;
  }

  /**
   *  [trace description]
   *  @param  {[type]} data  [description]
   *  @param  {[type]} title [description]
   *  @return {[type]}       [description]
   */
  trace(data, title){  
    let trace = this.timestamp.get();
    if (title)
      trace += title + '\n' + this.dump(data.toString('binary'));
    else
      trace += '\n' + this.dump(data.toString('binary'));
          
    this.log.info(trace);
  }
}

module.exports = Trace;
