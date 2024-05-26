from django.urls import path
from .views import CreatePoolUser, DeletePoolUserByEmail, FilteredPoolUsersView, Home, AllPoolUsersView, UserDetailsView


urlpatterns = [
    path('', Home.as_view()),
    path('pool-users/', AllPoolUsersView.as_view(), name='users_list'),
    path('create-pool-user/', CreatePoolUser.as_view(), name='create_pool_user'),
    path('pool-users-filter/', FilteredPoolUsersView.as_view(), name='filtered-pool-users'),
    path('users/delete/<str:email>/', DeletePoolUserByEmail.as_view(), name='delete_pool_user_by_email'),
    path('api/user-details/<str:email>/', UserDetailsView.as_view(), name='user-details'),
]
