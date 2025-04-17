export function concatHex(...hexes: string[]): string {
    return hexes.map(h => h.replace(/^0x/, '')).join('');
  }
  
  export function hexToBytes(hex: string): Uint8Array {
    if (hex.startsWith('0x')) hex = hex.slice(2);
    if (hex.length % 2 !== 0) hex = '0' + hex;
    return Uint8Array.from(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  }
  
  export function bytesToHex(bytes: Uint8Array): string {
    return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  export function padHex(hex: string, length: number): string {
    return hex.padStart(length, '0');
  }
  
  export function utf8ToBytes(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }
  
  export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
    let totalLength = arrays.reduce((sum, a) => sum + a.length, 0);
    let result = new Uint8Array(totalLength);
    let offset = 0;
    for (let a of arrays) {
      result.set(a, offset);
      offset += a.length;
    }
    return result;
  }