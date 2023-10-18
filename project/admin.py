from django.contrib import admin
from .models import CustomUser, Product, Order, OrderItem, CartItem
# from django.contrib.admin.sites import AdminSite

# class CustomAdminSite(AdminSite):
#     login_template = 'admin/login.html'

admin.site.register(CustomUser)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(CartItem)
