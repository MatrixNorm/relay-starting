#!/bin/bash

npx relay-compiler --schema ./src/schema.graphql \
                   --src ./src \
                   --artifactDirectory ./src/__relay__ \
                   --language typescript \
                   --watch;
