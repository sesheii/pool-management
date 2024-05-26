from django.urls import path
from .views import CreatePoolUser, DeletePoolUserByEmail, Home, AllPoolUsersView


urlpatterns = [
    path('', Home.as_view()),
    path('pool-users/', AllPoolUsersView.as_view(), name='users_list'),
    path('create-pool-user/', CreatePoolUser.as_view(), name='create_pool_user'),
    path('users/delete/<str:email>/', DeletePoolUserByEmail.as_view(), name='delete_pool_user_by_email'),
]
