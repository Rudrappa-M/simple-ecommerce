from django.db import transaction

from rest_framework import status
from django.db.models import Sum, Count

from rest_framework.decorators import (
    api_view,
    permission_classes
)

from rest_framework.permissions import IsAuthenticated, IsAdminUser 

from rest_framework.response import Response

from cart.models import Cart

from .models import Order, OrderItem

from .serializers import OrderSerializer,OrderStatusSerializer

from rest_framework.pagination import PageNumberPagination

from addresses.models import Address



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):

    address_id = request.data.get(
        'address_id'
    )

    if not address_id:

        return Response(
            {
                'message': 'Address ID is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        address = Address.objects.get(
            id=address_id,
            user=request.user
        )

    except Address.DoesNotExist:

        return Response(
            {
                'message': 'Address not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )

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

    cart_items = cart.items.select_related(
        'product'
    )

    if not cart_items.exists():

        return Response(
            {
                'message': 'Your cart is empty'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    with transaction.atomic():

        total_amount = 0

        for cart_item in cart_items:

            product = cart_item.product

            if not product.is_active:

                return Response(
                    {
                        'message': (
                            f'{product.name} '
                            'is no longer available'
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if cart_item.quantity > product.stock:

                return Response(
                    {
                        'message': (
                            f'Only {product.stock} '
                            f'{product.name} '
                            'items are available'
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            total_amount += (
                product.price *
                cart_item.quantity
            )

        order = Order.objects.create(

            user=request.user,

            full_name=address.full_name,
            phone=address.phone,
            address_line=address.address_line,
            city=address.city,
            state=address.state,
            pincode=address.pincode,

            total_amount=total_amount
        )

        for cart_item in cart_items:

            product = cart_item.product

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=cart_item.quantity,
                price=product.price
            )

            product.stock -= cart_item.quantity
            product.save()

        cart_items.delete()

    serializer = OrderSerializer(
        order
    )

    return Response(
        {
            'message': 'Order placed successfully',
            'order': serializer.data
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):

    orders = Order.objects.filter(
        user=request.user
    ).prefetch_related(
        'items__product'
    ).order_by('-created_at')

    paginator = PageNumberPagination()
    paginator.page_size = 5

    paginated_orders = paginator.paginate_queryset(
        orders,
        request
    )

    serializer = OrderSerializer(
        paginated_orders,
        many=True
    )

    return paginator.get_paginated_response(
        serializer.data
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):

    try:
        order = Order.objects.prefetch_related(
            'items__product'
        ).get(
            id=order_id,
            user=request.user
        )

    except Order.DoesNotExist:

        return Response(
            {
                'message': 'Order not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = OrderSerializer(order)

    return Response(
        serializer.data
    )

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_orders(request):

    orders = Order.objects.all().order_by('-created_at')

    paginator = PageNumberPagination()
    paginator.page_size = 5

    page = paginator.paginate_queryset(
        orders,
        request
    )

    serializer = OrderSerializer(
        page,
        many=True
    )

    return paginator.get_paginated_response(
        serializer.data
    )


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def admin_update_order_status(
    request,
    order_id
):

    try:

        order = Order.objects.get(
            id=order_id
        )

    except Order.DoesNotExist:

        return Response(
            {
                'message': 'Order not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    new_status = request.data.get(
        'status'
    )

    valid_statuses = [
        'pending',
        'confirmed',
        'shipped',
        'delivered',
        'cancelled',
    ]

    if new_status not in valid_statuses:

        return Response(
            {
                'message': 'Invalid order status'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    order.status = new_status

    order.save()

    return Response({
        'message':
            'Order status updated successfully',

        'order': OrderSerializer(order).data
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_order_detail(request, order_id):

    try:
        order = Order.objects.get(
            id=order_id
        )
    except Order.DoesNotExist:
        return Response(
            {
                'message': 'Order not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = OrderSerializer(order)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )



@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):

    total_orders = Order.objects.count()

    pending_orders = Order.objects.filter(
        status='pending'
    ).count()

    confirmed_orders = Order.objects.filter(
        status='confirmed'
    ).count()

    shipped_orders = Order.objects.filter(
        status='shipped'
    ).count()

    delivered_orders = Order.objects.filter(
        status='delivered'
    ).count()

    cancelled_orders = Order.objects.filter(
        status='cancelled'
    ).count()

    total_sales = Order.objects.filter(
        status__in=[
            'confirmed',
            'shipped',
            'delivered',
        ]
    ).aggregate(
        total=Sum('total_amount')
    )['total'] or 0

    return Response({

        'total_orders': total_orders,

        'pending_orders': pending_orders,

        'confirmed_orders': confirmed_orders,

        'shipped_orders': shipped_orders,

        'delivered_orders': delivered_orders,

        'cancelled_orders': cancelled_orders,

        'total_sales': total_sales,

    })



@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_recent_orders(request):

    orders = Order.objects.select_related(
        'user'
    ).prefetch_related(
        'items__product'
    ).order_by(
        '-created_at'
    )[:5]

    serializer = OrderSerializer(
        orders,
        many=True
    )

    return Response({
        'count': orders.count(),
        'results': serializer.data
    })



