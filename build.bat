call node scripts/build/bars.js
call npm run build --prod --base-href /new/ --build-optimizer
call purifycss "www/build/main.css" "www/build/*.js" --info --min --out "www/build/preload.css"
call node scripts/build/cacheBustCss.js