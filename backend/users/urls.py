from django.urls import path

from .views import register_api, login_api, profile_api,admin_users,admin_update_user_status,admin_delete_user,change_password
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns =[
    # path('test/', test_api),

    path('register/', register_api),
    path('login/', login_api),
    path('token/refresh/',TokenRefreshView.as_view()),
    path('profile/', profile_api),

    path(
        'admin/',
        admin_users
    ),


    path(
        'admin/<int:user_id>/status/',
        admin_update_user_status
    ),

    path(
        'admin/<int:user_id>/delete/',
        admin_delete_user
    ),

    path('change-password/', change_password),


]