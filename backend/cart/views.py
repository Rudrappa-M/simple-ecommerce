from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import (
    api_view,
    permission_classes
)

from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from .models import Cart,CartItem

from .serializers import CartSerializer,CartItemSerializer

from products.models import Product

from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):

    cart, created = Cart.objects.get_or_create(user = request.user)
    serializer = CartSerializer(cart)


    return Response(serializer.data)





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product')
    quantity = request.data.get('quantity', 1)


    product = Product.objects.get(id = product_id,is_active = True)

    if quantity > product.stock:
        return Response({'message':f'quatity should less then stock, only {product.stock} are available'})



    cart, created = Cart.objects.get_or_create(user=request.user)


    cart_item, item_created = CartItem.objects.get_or_create(cart=cart,product=product)

    if item_created:
        cart_item.quantity = quantity

    else:
        new_quantity = cart_item.quantity + quantity

        cart_item.quantity = new_quantity


    cart_item.save()


    serializer = CartItemSerializer(cart_item)

    return Response(
        {
            'message': 'Product added to cart',
            'item': serializer.data
        },
        status=status.HTTP_201_CREATED
    )


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):

    cart = Cart.objects.get(user=request.user)

    quantity = request.data.get('quantity')

    cart_item = CartItem.objects.get(id=item_id,cart=cart)

    cart_item.quantity = quantity

    cart_item.save()
    serializer = CartItemSerializer(cart_item)

    return Response({
        'message':'cart updated successfully',
        'item': serializer.data
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):

    try:
        cart = Cart.objects.get(
            user=request.user
        )
    except Cart.DoesNotExist:
        return Response(
            {
                'message': 'Cart not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        cart_item = CartItem.objects.get(
            id=item_id,
            cart=cart
        )
    except CartItem.DoesNotExist:
        return Response(
            {
                'message': 'Cart item not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    cart_item.delete()

    return Response(
        {
            'message': 'Product removed from cart'
        },
        status=status.HTTP_200_OK
    )










    