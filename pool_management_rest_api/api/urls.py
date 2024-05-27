from django.urls import path
from .views import CheckUserCheckinStatus, CheckedInUsersCount, CreatePoolUser, CreateSubscriptionType, DeletePoolUserByEmail, DeleteSubscriptionType, FilteredPoolUsersView, Home, AllPoolUsersView, ListSubscriptionTypes, ToggleUserCheckinStatus, UpdateSubscriptionView, UserDetailsView


urlpatterns = [
    path('', Home.as_view()),
    path('pool-users/', AllPoolUsersView.as_view(), name='users_list'),
    path('create-pool-user/', CreatePoolUser.as_view(), name='create_pool_user'),
    path('pool-users-filter/', FilteredPoolUsersView.as_view(), name='filtered_pool_users'),
    path('users/delete/<str:email>/', DeletePoolUserByEmail.as_view(), name='delete_pool_user_by_email'),
    path('user-details/<str:email>/', UserDetailsView.as_view(), name='user_details'),
    path('create-subscription-type/', CreateSubscriptionType.as_view(), name='create_subscription_type'),
    path('list-subscription-types/', ListSubscriptionTypes.as_view(), name='list_subscription_types'),
    path('delete-subscription-type/<int:pk>/', DeleteSubscriptionType.as_view(), name='delete_subscription_type'),
    path('update-subscription/<str:email>/', UpdateSubscriptionView.as_view(), name='update_subscription'),
    path('checked-in-count/', CheckedInUsersCount.as_view(), name='check_in_count'),
    path('check-in-status/', CheckUserCheckinStatus.as_view(), name='check_in_status'),
    path('toggle-check-in-status/', ToggleUserCheckinStatus.as_view(), name='toggle_check_in_status'),


]
