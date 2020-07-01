#!/bin/bash

main() {
	# Only push
	if [[ "$TRAVIS_EVENT_TYPE" != "push" ]];then
		echo -e "Not push, skip deploy www\n"
		return 0
	fi
	# Only master
	if [[ "$TRAVIS_BRANCH" != "main" ]];then
		echo -e "Not main, skip deploy www\n"
		return 0
	fi

	github_repo="FirefoxBar/userscript"

	npm run build-site
	node $TRAVIS_BUILD_DIR/scripts/copy-master.js

	# Upload master
	cd $TRAVIS_BUILD_DIR/dist/master
	git init
	git config user.name "Deployment Bot"
	git config user.email "deploy@travis-ci.org"
	git add .
	git commit -m "Automatic deployment"
	git push --force --quiet "https://${GITHUB_TOKEN}@github.com/${github_repo}.git" master:master

	# Upload pages
	cd $TRAVIS_BUILD_DIR/dist/pages
	git init
	git config user.name "Deployment Bot"
	git config user.email "deploy@travis-ci.org"
	git add .
	git commit -m "Automatic deployment"
	git push --force --quiet "https://${GITHUB_TOKEN}@github.com/${github_repo}.git" master:gh-pages
}

main