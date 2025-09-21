# from rest_framework.routers import DefaultRouter
# from django.urls import path
# from .views import (
#     ContextViewSet, IdentityProfileViewSet, AttributeViewSet,
#     AccessPolicyViewSet, AuditLogViewSet, UserViewSet, get_identity_by_context, signup
# )

# router = DefaultRouter()
# router.register(r'contexts', ContextViewSet, basename='context')
# router.register(r'profiles', IdentityProfileViewSet, basename='profile')
# router.register(r'attributes', AttributeViewSet, basename='attribute')
# router.register(r'policies', AccessPolicyViewSet, basename='policy')
# router.register(r'auditlogs', AuditLogViewSet, basename='auditlog')
# router.register(r'users', UserViewSet, basename='user')  # only once

# urlpatterns = router.urls + [
#     # ✅ custom endpoint for contextual resolution
#     path('<int:user_id>/', get_identity_by_context, name='get_identity_by_context'),
#     path('signup/', signup, name='signup'),
# ]


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ContextViewSet, IdentityProfileViewSet,
    AttributeViewSet, AccessPolicyViewSet, get_identity_by_context, signup, me, get_profile_by_id
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'contexts', ContextViewSet, basename='context')
router.register(r'profiles', IdentityProfileViewSet, basename='profile')
router.register(r'attributes', AttributeViewSet, basename='attribute')
router.register(r'policies', AccessPolicyViewSet, basename='policy')
# router.register(r'auditlogs', AuditLogViewSet, basename='auditlog')

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('<int:user_id>/', get_identity_by_context, name='get_identity_by_context'),
    path('profile/<int:profile_id>/', get_profile_by_id, name='get_profile_by_id'),
    path('users/me/', me, name="me"),
    path('', include(router.urls)),
    path('api/auth/', include('dj_rest_auth.urls')),  # login/logout
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),  # signup
    path('api/auth/social/', include('allauth.socialaccount.urls')),  # Google OAuth
]
