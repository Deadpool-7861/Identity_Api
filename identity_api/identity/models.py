from django.contrib.auth.models import AbstractUser
# from django.conf import settings
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('boss', 'Boss'),
        ('team_lead', 'Team Lead'),
        ('employee', 'Employee'),
        ('social_user', 'Social User'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='social_user')

    def __str__(self):
        return f"{self.username} ({self.role})"
    

class Context(models.Model):
    """
    Represents a usage scenario (corporate, social, public, private, etc.)
    """
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class IdentityProfile(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="profiles")
    context = models.ForeignKey(Context, on_delete=models.CASCADE, related_name="profiles")
    profile_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.profile_name} ({self.context.name})"


class Attribute(models.Model):
    """
    Represents a single identity attribute (nickname, legal name, pronouns, etc.).
    """
    profile = models.ForeignKey(IdentityProfile, on_delete=models.CASCADE, related_name="attributes")
    key = models.CharField(max_length=100)   # e.g., nickname, pronouns, title
    value = models.TextField()               # e.g., "Gautam", "He/Him"
    is_sensitive = models.BooleanField(default=False)  # used in access policies

    def __str__(self):
        return f"{self.key}: {self.value}"


class AccessPolicy(models.Model):
    """
    Defines visibility rules for attributes based on roles & contexts.
    """
    ROLE_CHOICES = [
        ('boss', 'Boss'),
        ('team_lead', 'Team Lead'),
        ('employee', 'Employee'),
        ('social_user', 'Social User'),
    ]

    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE, related_name="policies")
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    context = models.ForeignKey(Context, on_delete=models.CASCADE, related_name="policies")
    is_visible = models.BooleanField(default=True)

    def __str__(self):
        return f"Policy: {self.role} in {self.context.name} → {self.attribute.key} ({'visible' if self.is_visible else 'hidden'})"


# class AuditLog(models.Model):
#     requester = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name="audit_logs"
#     )
#     action = models.CharField(max_length=255)
#     details = models.TextField(blank=True, null=True)
#     timestamp = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.requester.username} - {self.action} ({self.timestamp})"

