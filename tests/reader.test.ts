import {Reader} from '../src/reader';

describe('testing stringstream', () => {
  let sstr = new Reader("abcdefghij");

  sstr.start();

  test('advance', () => {
    expect(sstr.advance()).toEqual("a");
    expect(sstr.advance()).toEqual("b");
    expect(sstr.advance()).toEqual("c");
  });
  
  test('peek', () => {
    expect(sstr.peek()).toEqual("d");
  });
  
  test('cursor', () => {
    expect(sstr.getCursor()).toEqual(3);
  });
  
  test('end', () => {
    expect(sstr.end()).toEqual("abc");
  });
  
  test('match', () => {
    expect(sstr.match('a')).toEqual(false);
    expect(sstr.match('d')).toEqual(true);
    expect(sstr.peek()).toEqual("e");
  });
  
  test('skipTo', () => {
    sstr.skipTo('i');
    expect(sstr.getCursor()).toEqual(8);
    expect(sstr.match('i')).toEqual(true);
  });
  
  test('isEmpty', () => {
    expect(sstr.isEmpty()).toEqual(false);
    sstr.advance();
    expect(sstr.isEmpty()).toEqual(true);
  });
});
