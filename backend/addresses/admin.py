from django.contrib import admin

from .models import Address


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'full_name',
        'phone',
        'city',
        'state',
        'pincode',
        'is_default',
        'created_at',
    )

    list_filter = (
        'state',
        'city',
        'is_default',
    )

    search_fields = (
        'user__username',
        'user__email',
        'full_name',
        'phone',
        'city',
        'pincode',
    )