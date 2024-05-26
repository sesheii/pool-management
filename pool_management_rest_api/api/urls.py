from django.urls import path
from .views import Home, AllPoolUsersView


urlpatterns = [
    path('', Home.as_view()),
    path('users/', AllPoolUsersView.as_view(), name='users_list'),
]
