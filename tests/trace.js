import test from 'ava';
import Trace from '../lib/trace';
import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!doctype html><html><body><pre id="log-output" class="log-output" type="text"></pre></body></html>');
const { window } = jsdom;

global.window = window;
global.document = window.document;

const trace = new Trace();

test('should dump empty data', t => {
  t.is(trace.dump(''), '');
});

test('should dump binary data', t => {
  const expected = '    34 30 1c 30 30 30 1c 1c 31 33 33 1c 1c 30 37 37     40.000..133..077\n    35 39 30 36 34 1c 32 30 30                          59064.200';
  const binary_data = Buffer('40\x1c000\x1c\x1c133\x1c\x1c07759064\x1c200', 'binary');
  t.is(trace.dump(binary_data), expected);
});

test('should dump the dummy Buffer data', t => {
  const expected = '    31 32 33 34 35 36 37 38 1c ff 30                    12345678..0';
  const binary_data = Buffer('12345678\x1c\xff0', 'binary');
  t.is(trace.dump(binary_data), expected);
});

test('should dump the Buffer data', t => {
  const expected = '    00 17 30 38 30 30 c2 80 00 00 00 00 00 00 00 04     ..0800..........\n    00 00 00 00 00 00 00 30 30 32                       .......002';
  const binary_data = Buffer('\x00\x17\x30\x38\x30\x30\x80\x00\x00\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x30\x30\x32');
  t.is(trace.dump(binary_data), expected);
});

test('should trace the object properties', t => {
  let obj = { 
    message_class: 'Terminal Command',
    LUNO: '000',
    message_sequence_number: '000',
    command_code: 'Go in-service'
  };
  t.is(trace.object(obj), '\n  [message_class          ]: [Terminal Command]\n  [LUNO                   ]: [000]\n  [message_sequence_number]: [000]\n  [command_code           ]: [Go in-service]\n');
});

test('should trace array object', t => {
  let obj = {
    states: ['003', '744', '987'],
  };
  t.is(trace.object(obj), '\n  [states]: ["003","744","987"]\n');
});

test('should trace array nested object properties', t => {
  let obj = {
    data: {alpha: '744321', beta: '98765'},
  };
  t.is(trace.object(obj), '\n  [data]: {"alpha":"744321","beta":"98765"}\n');
});

test('should trace string with new line character unchanged', t => {
  let obj = {
    data: 'iddqd\npqrst',
  };
  t.is(trace.object(obj), '\n  [data]: [iddqd\npqrst]\n');
});
 

