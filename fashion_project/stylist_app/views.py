import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .logic import get_recommendations
from django.conf import settings

logger = logging.getLogger(__name__)


class AIStylistView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        uploaded_file = request.data.get("image")
        season = request.data.get("season")
        usage = request.data.get("usage")

        if not all([uploaded_file, season, usage]):
            return Response({"error": "Missing required fields"}, status=400)

        try:
            recommendations_data = get_recommendations(uploaded_file, season, usage)

            base_image_url = f"http://127.0.0.1:8000{settings.MEDIA_URL}"

            if "recommendations" in recommendations_data:
                for item in recommendations_data["recommendations"]:
                    item["image_url"] = f"{base_image_url}{item['image']}"

            return Response(recommendations_data)

        except Exception as e:
            logger.error(f"An error occurred in AIStylistView: {e}", exc_info=True)
            return Response(
                {"error": f"An unexpected error occurred on the server: {e}"},
                status=500,
            )