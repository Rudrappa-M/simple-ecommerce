from rest_framework import serializers


from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )


    product_price = serializers.DecimalField(
        source='product.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )


    product_image = serializers.ImageField(
        source='product.image',
        read_only=True
    )


    product_stock = serializers.IntegerField(
        source='product.stock',
        read_only=True
    )


    subtotal = serializers.SerializerMethodField()


    class Meta:

        model = CartItem

        fields = [
            'id',
            'product',
            'product_name',
            'product_price',
            'product_image',
            'product_stock',
            'quantity',
            'subtotal',
        ]


    def get_subtotal(self, obj):

        return (
            obj.product.price *
            obj.quantity
        )


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart 
        fields = [
            'id',
            'user',
            'items',
            'total',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'user',
        ]

    def get_total(self,obj):
        print('rudud')
        total = 0

        for item in obj.items.all():
            total += (
                item.product.price * item.quantity
            )

        return total









