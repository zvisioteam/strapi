import {
  createHash,
  randomBytes,
  createCipheriv,
  createDecipheriv,
  Decipher,
  Cipher,
} from 'crypto';

// not going to use initVector? for now
const encrypt = (password: string, algorithm: string = 'aes-128-ecb') => {
  // random generated key for encryption
  const initVector: Buffer = randomBytes(16);

  // hashing the password
  const securitykey: string = createHash('sha256').update(password).digest('base64').slice(0, 16);

  return {
    // to be able to get the initVector key and save it somewhere for decryption
    getIV: (): string => {
      return initVector.toString('hex');
    },
    // Create a cipher
    cipher: (): Cipher => {
      return createCipheriv(algorithm, securitykey, null);
    },
  };
};

// not going to use initVector for now
const decrypt = (password: string, initVector?: string, algorithm: string = 'aes-128-ecb') => {
  // hashing the password
  const securitykey = createHash('sha256').update(password).digest('base64').slice(0, 16);
  console.log('securityKey ===> ', securitykey);
  return {
    // Create a decipher
    decipher: (): Decipher => {
      return createDecipheriv(algorithm, securitykey, null);
    },
  };
};

export { encrypt, decrypt };
