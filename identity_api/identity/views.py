from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework.permissions import AllowAny

from rest_framework import status
from .serializers import UserSerializer
from django.shortcuts import get_object_or_404

from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions
from .services import resolve_identity
from .models import Context, IdentityProfile, Attribute, AccessPolicy
from .serializers import (
    ContextSerializer, IdentityProfileSerializer,
    AttributeSerializer, AccessPolicySerializer, UserSerializer
)


User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User created successfully", "user": serializer.data},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_identity_by_context(request, user_id):
    context_id = request.query_params.get('context_id')
    if not context_id:
        return Response({"error": "context_id is required"}, status=400)

    target_user = get_object_or_404(User, id=user_id)
    profiles = IdentityProfile.objects.filter(user=target_user, context_id=context_id)

    if not profiles.exists():
        return Response({"error": "No profile found for this context"}, status=404)

    profile = profiles.first()
    requester_role = request.user.role

    # visible_attributes = []
    # for attr in profile.attributes.all():
    #     policy = AccessPolicy.objects.filter(attribute=attr, role=requester_role, context_id=context_id).first()
    #     if policy and policy.is_visible:
    #         visible_attributes.append({"key": attr.key, "value": attr.value})

        # role-based defaults
    visible_attributes = []
    for attr in profile.attributes.all():
        if requester_role == "boss":
            # boss can see all in corporate
            visible_attributes.append({"key": attr.key, "value": attr.value})
        elif requester_role == "employee":
            # employee sees only limited safe attributes
            if attr.key in ["username", "profile_name", "job_title"]:
                visible_attributes.append({"key": attr.key, "value": attr.value})
        elif requester_role == "social_user":
            # for now, let social users see only public attributes
            if not attr.is_sensitive:
                visible_attributes.append({"key": attr.key, "value": attr.value})
        else:
            # fallback: show only non-sensitive
            if not attr.is_sensitive:
                visible_attributes.append({"key": attr.key, "value": attr.value})


    # Optional: log the access
    # AuditLog.objects.create(
    #     user=request.user,
    #     action="Viewed profile",
    #     details=f"Viewed {target_user.username} in context {context_id}"
    # )

    return Response({
        "profile_id": profile.id,
        "profile_name": profile.profile_name,
        "context": profile.context.name,
        "attributes": visible_attributes
    })


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def me(request):
    if request.method == "GET":
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated", "user": serializer.data})
        return Response(serializer.errors, status=400)


class ContextViewSet(viewsets.ModelViewSet):
    queryset = Context.objects.all()
    serializer_class = ContextSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_by_id(request, profile_id):
    profile = get_object_or_404(IdentityProfile, id=profile_id)

    requester_role = request.user.role
    visible_attributes = []

    for attr in profile.attributes.all():
        if requester_role == "boss":
            visible_attributes.append({"key": attr.key, "value": attr.value})
        elif requester_role == "employee":
            if attr.key in ["username", "profile_name", "job_title"]:
                visible_attributes.append({"key": attr.key, "value": attr.value})
        elif requester_role == "social_user":
            if not attr.is_sensitive:
                visible_attributes.append({"key": attr.key, "value": attr.value})
        else:
            if not attr.is_sensitive:
                visible_attributes.append({"key": attr.key, "value": attr.value})

    return Response({
        "profile_id": profile.id,
        "profile_name": profile.profile_name,
        "context": profile.context.name,
        "description": profile.description,
        "attributes": visible_attributes
    })




# class IdentityProfileViewSet(viewsets.ModelViewSet):
#     queryset = IdentityProfile.objects.all()
#     serializer_class = IdentityProfileSerializer
#     # permission_classes = [permissions.IsAuthenticated]
#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

class IdentityProfileViewSet(viewsets.ModelViewSet):
    queryset = IdentityProfile.objects.all()
    serializer_class = IdentityProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        context_id = self.request.query_params.get("context")
        if context_id:
            queryset = queryset.filter(context_id=context_id)
        return queryset



class AttributeViewSet(viewsets.ModelViewSet):
    queryset = Attribute.objects.all()
    serializer_class = AttributeSerializer
    permission_classes = [permissions.IsAuthenticated]


class AccessPolicyViewSet(viewsets.ModelViewSet):
    queryset = AccessPolicy.objects.all()
    serializer_class = AccessPolicySerializer
    permission_classes = [permissions.IsAuthenticated]


# class AuditLogViewSet(viewsets.ModelViewSet):
#     queryset = AuditLog.objects.all()
#     serializer_class = AuditLogSerializer
#     permission_classes = [permissions.IsAuthenticated]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# @api_view(['GET', 'PUT'])
# @permission_classes([IsAuthenticated])
# def me(request):
#     if request.method == "GET":
#         serializer = UserSerializer(request.user)
#         return Response(serializer.data)

#     if request.method == "PUT":
#         serializer = UserSerializer(request.user, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "User updated", "user": serializer.data})
#         return Response(serializer.errors, status=400)
