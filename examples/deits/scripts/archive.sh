#bin/sh

NOCOLOR='\033[0m'
BLUE='\033[0;34m'
LIGHTGREEN='\033[1;32m'
DARKGRAY='\033[1;30m'

OUT_FILE=out/backup.tar

tar -cf out/backup.tar -C resource/backup-data-example $(ls -A resource/backup-data-example)
gzip $OUT_FILE -f
echo "${LIGHTGREEN}✔️ Success ${DARKGRAY}(See output at ${OUT_FILE})${NOCOLOR}"