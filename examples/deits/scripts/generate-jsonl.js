const fs = require('fs');
const { Readable } = require('stream');
const { chain } = require('stream-chain');
const { stringer } = require('stream-json/jsonl/Stringer');

const defaultCallback = (id) => ({ id, data: { name: 'Foo', age: 42, country: 'Bar' } });

/**
 * JSON Lines Generator
 *
 * @param {object} options Generator options
 * @param {number} options.size Number of lines to generate
 * @param {number} [options.maxSize] Maximum size for the generated file
 * @param {string | ((id: number) => object)} [options.template] Callback used to build the object that will be returned
 *
 * @yields {object}
 */
function* generateJSONLines(options) {
  const { size, maxSize, template = defaultCallback } = options;

  let generatedSize = 0;

  for (let i = 0; i <= size; i++) {
    let line;

    if (typeof template === 'string') {
      line = JSON.parse(template.replace(new RegExp('%id%', 'g'), i));
    } else if (typeof template === 'function') {
      line = template(i);
    }

    const length = JSON.stringify(line).length;

    if (maxSize && generatedSize + length > maxSize) {
      return;
    }

    generatedSize += length;

    yield line;
  }
}

/**
 *
 * @param {object} options;
 * @param {string} options.file Path to the output file
 * @param {number} options.size Number of lines to generate
 * @param {number} [options.maxSize] Maximum size for the generated file
 * @param {(id: number) => object} [options.template] Callback used to build the object that will be returned
 */
const generate = async (options) => {
  const { file, ...generatorOptions } = options;

  return new Promise((resolve) => {
    const pipeline = chain([
      Readable.from(generateJSONLines(generatorOptions)),
      stringer(),
      fs.createWriteStream(file),
    ]);

    pipeline.on('end', () => {
      resolve();
    });
  });
};

const extractArg = (match) => {
  return process.argv.find((arg) => arg.startsWith(`--${match}=`))?.replace(`--${match}=`, '');
};

if (require.main === 'module') {
  module.exports = generate;
} else {
  const help = process.argv.find((arg) => arg === '--help');

  if (help) {
    console.log(`
JSONL File Generator
    
Help
    --file={string} Output filepath
    --size={number} Number of line to generate
    --maxSize={number} Maximum amount of data that will be generated (in bytes)
    --templat={string} Represents a stringified JSON template used to generate each line. Use %id% in your string to automatically replace it with the current id  
    `);
    return;
  }

  const file = extractArg('file') || './out.jsonl';
  const size = parseInt(extractArg('size') || '10000', 10);
  const maxSize = parseInt(extractArg('maxSize'), 10) || null;
  const template = extractArg('template');

  generate({ file, size, maxSize, template });
}
