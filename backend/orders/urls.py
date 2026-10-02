from django.urls import path

from .views import (
    place_order,
    order_history,
    order_detail,
    admin_orders,
    admin_order_detail,
    admin_update_order_status,
    admin_dashboard_stats,
    admin_recent_orders
)


urlpatterns = [

    path(
        'place/',
        place_order
    ),

    path(
        'admin/',
        admin_orders
    ),

    path(
        'admin/<int:order_id>/status/',
        admin_update_order_status
    ),

    path(
        '',
        order_history
    ),

    path(
        '<int:order_id>/',
        order_detail
    ),
    path(
        'admin/<int:order_id>/',
        admin_order_detail
    ),
    path(
    'admin/dashboard/',
    admin_dashboard_stats
    ),
    path(
        'admin/recent/',
        admin_recent_orders
    ),



]