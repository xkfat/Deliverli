from django.http import HttpResponsePermanentRedirect
from urllib.parse import unquote

class CleanUrlMiddleware:
    """
    Middleware to automatically strip invisible unicode characters 
    (like RLM, LRM, BOM) from URLs and redirect to the clean version.
    """
    
    # The invisible characters we want to purge
    INVISIBLE_CHARS = {
        '\u200f', # Right-to-Left Mark (RLM) - The culprit in your logs
        '\u200e', # Left-to-Right Mark (LRM)
        '\ufeff', # Byte Order Mark (BOM)
        '\u202a', # Left-to-Right Embedding
        '\u202b', # Right-to-Left Embedding
        '\u202c', # Pop Directional Formatting
        '\u202d', # Left-to-Right Override
        '\u202e', # Right-to-Left Override
    }

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # request.path_info contains the URL after domain (decoded)
        path = request.path_info
        
        # Check if any invisible character is present
        if any(char in path for char in self.INVISIBLE_CHARS):
            clean_path = path
            for char in self.INVISIBLE_CHARS:
                clean_path = clean_path.replace(char, '')
            
            # If we changed anything, redirect to the clean URL
            if clean_path != path:
                # Reconstruct full URL with query params (if any)
                if request.META.get('QUERY_STRING'):
                    clean_path = f"{clean_path}?{request.META['QUERY_STRING']}"
                
                return HttpResponsePermanentRedirect(clean_path)

        return self.get_response(request)