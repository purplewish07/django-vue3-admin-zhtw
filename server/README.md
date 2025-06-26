pip install -r requirement

python manage.py makemigration
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic
python manage.py runsever

