# stylist_app/views.py
import logging # Add this import
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .logic import get_recommendations

# Get an instance of a logger
logger = logging.getLogger(__name__)

class AIStylistView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        uploaded_file = request.data.get('image')
        season = request.data.get('season')
        usage = request.data.get('usage')

        if not all([uploaded_file, season, usage]):
            return Response({"error": "Missing required fields"}, status=400)

        try:
            recommendations = get_recommendations(uploaded_file, season, usage)
            return Response(recommendations)
        except Exception as e:
            # This will now print the exact error to your Django console
            logger.error(f"An error occurred in AIStylistView: {e}", exc_info=True) 
            return Response({"error": f"An unexpected error occurred on the server: {e}"}, status=500)