from django.urls import path

from .views import (
    address_create,
    address_list,
    address_update,
    address_delete,
    set_default_address,
)


urlpatterns = [

    path(
        '',
        address_list
    ),

    path(
        'create/',
        address_create
    ),

    path(
        '<int:address_id>/update/',
        address_update
    ),

    path(
        '<int:address_id>/delete/',
        address_delete
    ),

    path(
        '<int:address_id>/default/',
        set_default_address
    ),

]