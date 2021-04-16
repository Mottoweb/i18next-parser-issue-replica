include ../../Makefile

build-app: build-js build-app-legacy build-ts

start-app: clean-build
	${TSC_EXEC} --watch & \
	${WEBPACK_DEV_SERVER_EXEC} --env env=${env} & \
	wait;

build-app-legacy:
	${WEBPACK_EXEC} --config ./webpack.config.legacy.js --env env=${env} \
	wait;

start-app-legacy: clean-build
	${TSC_EXEC} --watch & \
	${WEBPACK_DEV_SERVER_EXEC} --config ./webpack.config.legacy.js --env env=${env} & \
	wait;

deploy-app: deploy-cdn drop-cache deploy-sentry
