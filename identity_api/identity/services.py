from .models import IdentityProfile, Attribute, AccessPolicy

def resolve_identity(profile_id, requester_role, context_id):
    """
    Returns filtered attributes for a given profile
    based on requester's role, requested context, and access policies.
    """
    try:
        profile = IdentityProfile.objects.get(id=profile_id, context_id=context_id)
    except IdentityProfile.DoesNotExist:
        return {"error": "Profile not found in this context."}

    attributes = profile.attributes.all()
    filtered_attributes = []

    for attr in attributes:
        # Find policies for this attribute in this context
        policies = AccessPolicy.objects.filter(
            attribute=attr,
            role=requester_role,
            context_id=context_id
        )

        # Default: hide unless explicitly visible
        if policies.exists():
            for policy in policies:
                if policy.is_visible:
                    filtered_attributes.append({
                        "key": attr.key,
                        "value": attr.value
                    })
        else:
            # If no policy defined, treat as hidden (secure by default)
            continue

    return {
        "profile_id": profile.id,
        "profile_name": profile.profile_name,
        "context": profile.context.name,
        "attributes": filtered_attributes
    }
