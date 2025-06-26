#!/bin/bash
### BEGIN INIT INFO
# Provides: shutdownbefore
# Required-Start:
# Required-Stop:
# Default-Start:    2 3 4 5
# Default-Stop:     0 1 6
# Short-Description:
# Description:
### END INIT INFO
case "${1:-''}" in
	'start')

		#开机需要执行的逻辑
		#cd /home/uta_iot/github_repo/django-vue-admin-zhtw/server && python3 manage.py runserver 0.0.0.0:8000 > /dev/null 2>&1 &
		#cd /home/uta_iot/github_repo/django-vue-admin-zhtw/client && npm run dev > /dev/null 2>&1 &
		source /home/uta_iot/.profile
		cd /home/uta_iot/github_repo/django-vue-admin-zhtw/client/
		/home/uta_iot/.nvm/versions/node/v14.15.0/bin/npm run dev &
		;;
		
	'stop')
		#关机需要执行的逻辑
		;;
	*)
		;;
esac

exit 0
