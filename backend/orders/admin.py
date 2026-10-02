from django.contrib import admin

from .models import Order, OrderItem


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'full_name',
        'phone',
        'city',
        'state',
        'pincode',
        'total_amount',
        'status',
        'created_at',
    )

    list_filter = (
        'status',
        'state',
        'city',
        'created_at',
    )

    search_fields = (
        'user__username',
        'user__email',
        'full_name',
        'phone',
        'city',
        'pincode',
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'order',
        'product',
        'quantity',
        'price',
    )