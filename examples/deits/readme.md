# DEITS PoC

## Directories

### `types/`

It contains all the type definition files used in the project

### `scripts`

- `archive.sh` - Create a fake backup archive file from the content of `./resource/backup-data-example`

### `src`

Holds the code experiments (providers, engine, encryption, etc...)

## Scripts

- `fake:backup`: create a compressed archive based on the files contained in `resource/backup-data-example` and move it to `out/backup.tar.gz`
- `fake:jsonl`: create a jsonl file filled with objects (possibility to customize the file, the size (number of line), the maxSize (in bytes) or the template used for each line (stringified json))

  ```sh
  yarn fake:jsonl \
    --file="./resource/backup-data-example/entities/entities_000X.jsonl" \
    --size=10000000 \
    --maxSize=5000000000 \
    --template='{"type":"api::article.article","id":%id%,"data":{"title":"Dunno what to say (%id%) anymore","metadata":{"link":"http://d.com/%id%","createdAt":"%id%-09-01"}}}'
  ```

  You can watch the file being populated by using:

  `watch -n 1 du -h ./resource/backup-data-example/entities/entities_000X.jsonl`

  You can also check the number of lines created using:

  `wc -l < ./resource/backup-data-example/entities/entities_000X.jsonl`

- `build`: build the source files in the out directory
- `start`: alias to node out/index.js
- `dev`: use nodemon (alongwith ts-node) to run src/index.ts in watch mode
