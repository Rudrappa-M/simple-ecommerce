from django.urls import path

from .views import (
    category_list,
    category_create,
    category_update,
    category_delete,
    product_list,
    product_detail,
    product_create,
    product_update,
    product_delete,
    low_stock_products,
)


urlpatterns = [

    path(
        'categories/',
        category_list
    ),

    path(
        'categories/create/',
        category_create
    ),

    path(
        '',
        product_list
    ),

    path(
        '<int:product_id>/',
        product_detail
    ),

    path(
        'create/',
        product_create
    ),

    path(
        '<int:product_id>/update/',
        product_update
    ),

    path(
        '<int:product_id>/delete/',
        product_delete
    ),

    path(
    'categories/<int:category_id>/update/',
    category_update,
    ),
    path(
    'categories/<int:category_id>/delete/',
    category_delete,
    ),

    path(
    'admin/low-stock/',
    low_stock_products
    ),
]