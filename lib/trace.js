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

  /**
   * [object display the fields of javascript object]
   * @param  {[type]} data  [object to display]
   * @return {[type]}       [description]
   */
  object(data){
    if(!data)
      return '';

    let dump = '\n';

    let maxLen = 0;
    for (let property in data)
      if (property.length > maxLen)
        maxLen = property.length;

    for (let property in data) {
      let property_name = property;
      while(property_name.length < maxLen)
        property_name += ' ';

      if(typeof(data[property]) === 'object'){
        dump += '  [' + property_name + ']: ' + JSON.stringify(data[property]).replace(/[^\x20-\x7E,\n]+/g, '.') + '\n'; 
      } else {
        dump += '  [' + property_name + ']: [' + data[property].toString().replace(/[^\x20-\x7E,\n]+/g, '.') + ']\n'; 
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
