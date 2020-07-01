#!/bin/bash

main() {
	# Only push
	if [[ "$TRAVIS_EVENT_TYPE" != "push" ]];then
		echo -e "Not push, skip deploy www\n"
		return 0
	fi
	# Only master
	if [[ "$TRAVIS_BRANCH" != "master" ]];then
		echo -e "Not master, skip deploy www\n"
		return 0
	fi

	github_repo="FirefoxBar/userscript"
	github_branch="gh-pages"

	npm run build-site

	# Upload
	cd $TRAVIS_BUILD_DIR/dist/
	git init
	git config user.name "Deployment Bot"
	git config user.email "deploy@travis-ci.org"
	git add .
	git commit -m "Automatic deployment"
	git push --force --quiet "https://${GITHUB_TOKEN}@github.com/${github_repo}.git" master:$github_branch
}

main