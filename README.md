# pool-management

Start the WebSocket thingy
```
daphne -p 8080 pool_management_rest_api.asgi:application
```

Start rest api
```
python manage.py runserver
```

Start react app
```
npm run start
```