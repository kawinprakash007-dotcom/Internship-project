from django.urls import path
from .views import latest_data, update_data

urlpatterns = [
    path('latest/', latest_data),
    path('update/', update_data),
]