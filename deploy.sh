#!/bin/bash

npm run build
cp -r docs/.vuepress/dist/* /vault/public/blog
