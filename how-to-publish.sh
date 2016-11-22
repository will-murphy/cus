
# If I haven't already:
npm login

# make changes to cus.js
git m "changes"
npm version patch # or just increment version in package.json
git push origin master
npm publish
rm -r /Users/wtm/Dropbox/Codin/node_modules/cus
cd /Users/wtm/Dropbox/Codin
npm install cus
