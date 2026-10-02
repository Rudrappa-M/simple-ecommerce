from rest_framework import status

from rest_framework.decorators import (
    api_view,
    permission_classes
)
from .serializers import AddressSerializer

from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response

from .models import Address



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def address_create(request):

    serializer = AddressSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    if serializer.validated_data.get(
        'is_default',
        False
    ):

        Address.objects.filter(
            user=request.user,
            is_default=True
        ).update(
            is_default=False
        )

    address = serializer.save(
        user=request.user
    )

    return Response(
        {
            'message': 'Address added successfully',
            'address': AddressSerializer(address).data
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def address_list(request):

    addresses = Address.objects.filter(
        user=request.user
    ).order_by(
        '-is_default',
        '-created_at'
    )

    serializer = AddressSerializer(
        addresses,
        many=True
    )

    return Response(
        serializer.data
    )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def address_update(
    request,
    address_id
):

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

    serializer = AddressSerializer(
        address,
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    if serializer.validated_data.get(
        'is_default',
        address.is_default
    ):

        Address.objects.filter(
            user=request.user,
            is_default=True
        ).exclude(
            id=address.id
        ).update(
            is_default=False
        )

    serializer.save()

    return Response(
        {
            'message': 'Address updated successfully',
            'address': serializer.data
        }
    )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def address_delete(
    request,
    address_id
):

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

    address.delete()

    return Response(
        {
            'message': 'Address deleted successfully'
        },
        status=status.HTTP_200_OK
    )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def set_default_address(
    request,
    address_id
):

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

    Address.objects.filter(
        user=request.user,
        is_default=True
    ).update(
        is_default=False
    )

    address.is_default = True
    address.save()

    return Response(
        {
            'message': 'Default address updated successfully',
            'address': AddressSerializer(address).data
        }
    )