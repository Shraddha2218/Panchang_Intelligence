from django.urls import include, path
from rest_framework import routers
from . import views
router = routers.DefaultRouter()
#router.register(r'geeks', GeeksViewSet)

urlpatterns = [
    path('', views.newhome, name='home'),
    # path('home/', views.newhome, name='newhome'),
    path('search/', views.search_lat_lng, name='search'),
    # path('result/', views.result, name='result'),
    path('about/', views.about, name='about'),
    path('compare/', views.compare, name='compare'),
    path('references/', views.references, name='references'),
    path('contact/', views.contact, name='contact'),
    path('policy/', views.policy, name='policy'),
]

app_name = 'weather'
