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
- `build`: build the source files in the out directory
- `start`: alias to node out/index.js
- `dev`: use nodemon (alongwith ts-node) to run src/index.ts in watch mode
