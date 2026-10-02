from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )

    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem

        fields = [
            'id',
            'product',
            'product_name',
            'quantity',
            'price',
            'subtotal',
        ]

    def get_subtotal(self, obj):

        return obj.price * obj.quantity


# class OrderSerializer(
#     serializers.ModelSerializer
# ):

#     items = OrderItemSerializer(
#         many=True,
#         read_only=True
#     )

#     class Meta:
#         model = Order

#         fields = [
#             'id',
#             'user',
#             'full_name',
#             'phone',
#             'address_line',
#             'city',
#             'state',
#             'pincode',
#             'total_amount',
#             'status',
#             'items',
#             'created_at',
#             'updated_at',
#         ]



class OrderSerializer(serializers.ModelSerializer):

    customer_username = serializers.CharField(
        source='user.username',
        read_only=True
    )

    customer_email = serializers.EmailField(
        source='user.email',
        read_only=True
    )

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order

        fields = [
            'id',
            'user',
            'customer_username',
            'customer_email',
            'full_name',
            'phone',
            'address_line',
            'city',
            'state',
            'pincode',
            'total_amount',
            'status',
            'items',
            'created_at',
            'updated_at',
        ]



class OrderStatusSerializer(serializers.Serializer):

    status = serializers.ChoiceField(
        choices=Order.STATUS_CHOICES
    )