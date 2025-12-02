# create folder storage/vectordb to store vectors in backend folder
# to start backend first run these
flask --app run.py db init
# then run migration
flask --app run.py db migrate -m "message"
# then run updage
flask --app run.py db upgrade