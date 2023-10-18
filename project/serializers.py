from rest_framework import serializers
from .models import CustomUser, Product, CartItem

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    
class productshow(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'   

class Cartitemserializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'user', 'product', 'quantity']        
