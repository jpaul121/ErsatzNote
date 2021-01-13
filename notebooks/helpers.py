from django.utils.crypto import get_random_string

def generate_slug(obj, slug_length):
  """ A function to generate a slug with a given length and make sure it's unique. """
  slug = get_random_string(slug_length)
  slug_is_not_unique = True

  while slug_is_not_unique:
    slug_is_not_unique = False
    other_objs_with_slug = type(obj).objects.filter(id=slug)

    if len(other_objs_with_slug) > 0:
      slug_is_not_unique = True
      slug = get_random_string(slug_length)
  
  return slug