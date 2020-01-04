#!/bin/bash

npm install
npm run build
cp -r docs/.vuepress/dist/* /vault/public/blog
