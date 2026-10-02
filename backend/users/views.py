from django.shortcuts import render

# Create your views here.

from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes

from rest_framework.response import Response
from .serializers import RegisterSerializer

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
@permission_classes([AllowAny])
def register_api(request):
    serial = RegisterSerializer(data=request.data)

    if serial.is_valid():
        user = serial.save()

        return Response({
            'message': 'created successfully',
            'user': {
                'id':user.id,
                'username':user.username,
                'email': user.email,
            }
        },status=status.HTTP_201_CREATED,)
    return Response(
        serial.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def login_api(request):
    username = request.data.get('username')
    print(username,'shiv')
    password = request.data.get('password')

    user = authenticate(
        username=username,
        password=password
    )
    print(user,'rudr')

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({'message':'lnvalid credentials'},status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_api(request):
    user = request.user

    return Response({
        'id':user.id,
        'username':user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    },status=status.HTTP_200_OK)

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_users(request):

    search = request.GET.get('search', '').strip()

    users = User.objects.all().order_by('-date_joined')

    if search:
        users = users.filter(
            username__icontains=search
        ) | users.filter(
            email__icontains=search
        )

    results = []

    for user in users:

        results.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'is_active': user.is_active,
            'date_joined': user.date_joined,
        })

    return Response({
        'count': users.count(),
        'results': results
    })



@api_view(['PUT'])
@permission_classes([IsAdminUser])
def admin_update_user_status(request, user_id):

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if user.is_staff:
        return Response(
            {'message': 'Admin users cannot be deactivated here'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.is_active = not user.is_active
    user.save(update_fields=['is_active'])

    return Response({
        'message': 'User status updated successfully',
        'is_active': user.is_active
    })



@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_user(request, user_id):

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if user.is_staff:
        return Response(
            {'message': 'Admin users cannot be deleted here'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.delete()

    return Response({
        'message': 'User deleted successfully'
    })



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):

    user = request.user

    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not old_password:
        return Response(
            {'message': 'Old password is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not new_password:
        return Response(
            {'message': 'New password is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(old_password):
        return Response(
            {'message': 'Old password is incorrect'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(new_password) < 8:
        return Response(
            {'message': 'New password must be at least 8 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    return Response({
        'message': 'Password changed successfully'
    })


















