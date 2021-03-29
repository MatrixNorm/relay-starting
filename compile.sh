SRC_DIR=src
SCHEMA_FILE=src/schema.graphql

while inotifywait -r -e close_write $SRC_DIR $SCHEMA_FILE; 
  do npx relay-compiler --src $SRC_DIR \
                        --schema $SCHEMA_FILE \
                        --artifactDirectory src/__relay__ \
                        --language typescript; 
done;
