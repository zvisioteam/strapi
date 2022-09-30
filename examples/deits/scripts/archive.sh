#bin/sh

NOCOLOR='\033[0m'
BLUE='\033[0;34m'
LIGHTGREEN='\033[1;32m'
DARKGRAY='\033[1;30m'

OUT_DIR=out
OUT_FILE=backup.tar
OUT_PATH=$OUT_DIR/$OUT_FILE

ARCHIVE_PATH=resource/backup-data-example

mkdir -p $OUT_DIR
tar -cf $OUT_PATH -C $ARCHIVE_PATH $(ls -A $ARCHIVE_PATH)
gzip $OUT_PATH -f
echo "${LIGHTGREEN}✔️ Success ${DARKGRAY}(See output at ${OUT_PATH}.gz)${NOCOLOR}"