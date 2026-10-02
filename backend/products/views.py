from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.db.models import Q

from .pagination import ProductPagination

@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):

    category = Category.objects.all()

    serializer = CategorySerializer(category,many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def category_create(request):
    ser = CategorySerializer(data = request.data)

    if ser.is_valid():
        ser.save()
        return Response(ser.data,status=status.HTTP_201_CREATED)

    else:
        return Response(ser.errors,status=status.HTTP_400_BAD_REQUEST)



@api_view(['PUT'])
@permission_classes([IsAdminUser])
def category_update(request, category_id):

    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response(
            {'message': 'Category not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = CategorySerializer(
        category,
        data=request.data
    )

    if serializer.is_valid():
        serializer.save()

        return Response({
            'message': 'Category updated successfully',
            'category': serializer.data
        })

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def category_delete(request, category_id):

    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response(
            {'message': 'Category not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if category.products.exists():
        return Response(
            {
                'message': (
                    'Cannot delete category because '
                    'products exist in this category'
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    category.delete()

    return Response({
        'message': 'Category deleted successfully'
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):

    products = Product.objects.filter(
        is_active=True
    )

    # Search
    search = request.query_params.get(
        'search'
    )

    if search:
        products = products.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search)
        )

    # Category filter
    category = request.query_params.get(
        'category'
    )

    if category:
        products = products.filter(
            category_id=category
        )

    # Minimum price
    min_price = request.query_params.get(
        'min_price'
    )

    if min_price:
        products = products.filter(
            price__gte=min_price
        )

    # Maximum price
    max_price = request.query_params.get(
        'max_price'
    )

    if max_price:
        products = products.filter(
            price__lte=max_price
        )

    # Ordering
    ordering = request.query_params.get(
        'ordering'
    )

    if ordering:
        products = products.order_by(
            ordering
        )
    else:
        products = products.order_by(
            '-created_at'
        )
    paginator = ProductPagination()
    paginated_products = paginator.paginate_queryset(products,request)
    serializer = ProductSerializer(
        paginated_products,
        many=True
    )

    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail(request,product_id):
    product = Product.objects.get(id=product_id)

    ser= ProductSerializer(product)

    return Response(ser.data,status=status.HTTP_200_OK)




@api_view(['POST'])
@permission_classes([IsAdminUser])
def product_create(request):

    serializer = ProductSerializer(
        data=request.data
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                'message': 'Product created successfully',
                'product': serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )




@api_view(['PUT'])
@permission_classes([IsAdminUser])
def product_update(request, product_id):

    try:
        product = Product.objects.get(
            id=product_id
        )
    except Product.DoesNotExist:
        return Response(
            {
                'message': 'Product not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProductSerializer(
        product,
        data=request.data
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                'message': 'Product updated successfully',
                'product': serializer.data
            }
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def product_delete(request, product_id):
    product_id = Product.objects.get(id = product_id)

    product_id.is_active = False
    product_id.save()

    return Response({
        'message':'product deleted successfully'
    },status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAdminUser])
def low_stock_products(request):

    products = Product.objects.filter(
        is_active=True,
        stock__lte=5
    ).select_related(
        'category'
    ).order_by(
        'stock',
        'name'
    )

    serializer = ProductSerializer(
        products,
        many=True
    )

    return Response({
        'count': products.count(),
        'results': serializer.data
    })

