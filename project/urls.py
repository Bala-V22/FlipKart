from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import Cartintemlist

urlpatterns = [
    path('', views.home, name='home'),
    path('api/register', views.register, name='register'),
    path('api/login', views.user_login, name='login'),
    path('logout', views.user_logout, name='logout'),
    path('view/<str:category>', views.view_all, name='view'),
    path('product/<int:id>', views.trys, name='product'),
    path('product_details/<int:product_id>/<int:order>', views.product_order, name='product_details'),
    path('cart_views', views.Cartintemlist.as_view(), name='cart_page'),
    path('api/cart', views.Cartintemlist.as_view(), name='api-cart-list'),
    path('api/cart/<int:cart_item_id>', views.Cartintemlist.as_view(), name='api-cart-detail'),
    path('api/save_add', views.address, name='api-address'),
    path('api/email_check', views.email, name='api-email'),
    path('my_order', views.order, name='api-email'),
    path('api/cart_check/<int:product_id>', views.cart_check, name='api-cart'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)