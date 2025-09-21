from django.contrib import admin
from .models import Context, IdentityProfile, Attribute, AccessPolicy

admin.site.register(Context)
admin.site.register(IdentityProfile)
admin.site.register(Attribute)
admin.site.register(AccessPolicy)
# admin.site.register(AuditLog)
