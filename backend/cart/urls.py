from django.urls import path

from .views import view_cart,add_to_cart, update_cart_item, remove_cart_item


urlpatterns = [

    path(
        '',
        view_cart
    ),

    path('add/',add_to_cart),
    path('items/<int:item_id>/update/', update_cart_item),
    path('items/<int:item_id>/remove/', remove_cart_item),

]