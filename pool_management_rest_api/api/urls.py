from django.urls import path
from .views import CreatePoolUser, CreateSubscriptionType, DeletePoolUserByEmail, DeleteSubscriptionType, FilteredPoolUsersView, Home, AllPoolUsersView, ListSubscriptionTypes, UpdateSubscriptionView, UserDetailsView


urlpatterns = [
    path('', Home.as_view()),
    path('pool-users/', AllPoolUsersView.as_view(), name='users_list'),
    path('create-pool-user/', CreatePoolUser.as_view(), name='create_pool_user'),
    path('pool-users-filter/', FilteredPoolUsersView.as_view(), name='filtered-pool-users'),
    path('users/delete/<str:email>/', DeletePoolUserByEmail.as_view(), name='delete_pool_user_by_email'),
    path('user-details/<str:email>/', UserDetailsView.as_view(), name='user-details'),
    path('create-subscription-type/', CreateSubscriptionType.as_view(), name='create-subscription-type'),
    path('list-subscription-types/', ListSubscriptionTypes.as_view(), name='list-subscription-types'),
    path('delete-subscription-type/<int:pk>/', DeleteSubscriptionType.as_view(), name='delete-subscription-type'),
    path('update-subscription/<str:email>/', UpdateSubscriptionView.as_view(), name='update-subscription'),

]
