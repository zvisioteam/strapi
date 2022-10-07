import Chain from 'stream-chain';
import tar from 'tar';
import { pipeline } from 'stream';

const parseJSONFile = async <T extends {} = unknown>(fileStream: Chain, filePath: string) => {
  return new Promise<T>((resolve, reject) => {
    pipeline(
      [
        fileStream,
        // Custom backup archive parsing
        new tar.Parse({
          /**
           * Filter the parsed entries to only keep the one that matches the given filepath
           */
          filter(path, entry) {
            return path === filePath && entry.type === 'File';
          },

          /**
           * Whenever an entry passes the filter method, process it
           */
          async onentry(entry) {
            // Collect all the content of the entry file
            const content = await entry.collect();
            // Parse from buffer to string to JSON
            const parsedContent = JSON.parse(content.toString());

            // Resolve the Promise with the parsed content
            resolve(parsedContent);

            // Cleanup (close the stream associated to the entry)
            entry.destroy();
          },
        }),
      ],
      () => {
        // If the promise hasn't been resolved and we've parsed all
        // the archive entries, then the file doesn't exist
        reject(`${filePath} not found in the archive stream`);
      }
    );
  });
};

export { parseJSONFile };
