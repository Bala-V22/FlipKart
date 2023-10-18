from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from .models import CustomUser, Product, Order, OrderItem, CartItem
from rest_framework.decorators import api_view
from .serializers import UserRegisterSerializer,productshow, Cartitemserializer
from random import shuffle
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_protect


class Cart:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get('cart')
        if 'cart' not in self.session or not cart:
            cart = self.session['cart'] = {}
        self.cart = cart
    
    def add(self, product_id, quantity):
        product_id = str(product_id)
        if product_id in self.cart:
            self.cart[product_id] += quantity
        else:
            self.cart[product_id] = quantity
        self.save()
    
    def remove(self, product_id):
        product_id = str(product_id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()
    
    def update(self, product_id, quantity):
        product_id = str(product_id)
        if product_id in self.cart and quantity > 0:
            self.cart[product_id] = quantity
        elif product_id in self.cart and quantity <= 0:
            self.remove(product_id)
        self.save()
    
    def save(self):
        self.session.modified = True
    
    def clear(self):
        self.session.pop('cart', None)
        self.save()
    
    def __iter__(self):
        product_ids = self.cart.keys()
        products = Product.objects.filter(id__in=product_ids)
        cart = self.cart.copy()
        for product in products:
            cart[str(product.id)]['product'] = product
        for item in cart.values():
            item['total_price'] = item['product'].price * item['quantity']
            yield item


def home(request):
    products = list(Product.objects.all())
    shuffle(products)
    serializer = productshow(products, many=True)
    # print(serializer)
    return render(request, 'home.html', {"product" : serializer.data})


def view_all(request, category):
    print(category)
    products = list(Product.objects.filter(category = category))
    shuffle(products)
    serializer = productshow(products, many=True)
    # print(serializer)
    return render(request, 'view.html', {'product': serializer.data})

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        print(1,'-----------------')
        serializer = UserRegisterSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            print(2,'---------------')
            return redirect('home') 
        # else:
        #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    print('hello-------------------')
    return render(request, 'home.html')


@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            user = None
        print(user)
        if user is not None:
            authenticated_user = authenticate(request=request, email=email, password=password)
            print(authenticated_user)
            if authenticated_user is not None:
                login(request, authenticated_user)
                return JsonResponse({'login': True})
            return JsonResponse({'login': False}) 
    return render(request, 'home.html')


def user_logout(request):
    logout(request)
    return redirect('home')

        
def trys(request, id):
    # val = request.GET.get('image_source')
    # print('1',val)
    # val = val.replace('/media/', '')
    product = Product.objects.get(id=id)
    print('2',product)
    serializer = productshow(product)
    products = list(Product.objects.filter(category = product.category))
    shuffle(products)
    serializer1 = productshow(products, many=True) 
    more_product = list(Product.objects.all())
    shuffle(more_product)
    serializer2 = productshow(more_product, many=True) 
    return render(request, 'view.html', {'products': serializer.data, 'more_related_category': serializer1.data, 'more_product': serializer2.data})


def address(request):
    print('1................', request.user)
    if request.method == 'POST':
        try:    
            data = json.loads(request.body)
            add_1= data.get('add_1')
            add_2= data.get('add_2')
            add_3= data.get('add_3')
            pin= data.get('pin')
            user_id=CustomUser.objects.get(id = request.user.id)
            user_id.address= f"{add_1}, {add_2}, {add_3}, {pin}"
            user_id.save()

            return JsonResponse({'message': 'success'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
    

def product_order(request, product_id, order):
    product = Product.objects.get(id = product_id)
    if order == 1:
        print('hello-------------------------------')
        user = request.user
        order = Order.objects.create(user=user, order_status = 'pending', total_amount = product.price)
        OrderItem.objects.create(order= order, product = product, quantity = 1)
        return JsonResponse({ 'message': 'success'}) 
    return render(request, 'order.html', {'product': product})    

def add_address(request):
    add_1= request.POST.get('add_1')
    add_2= request.POST.get('add_2')
    add_3= request.POST.get('add_3')
    pin= request.POST.get('pin')
    user_id=CustomUser.objects.get(id = request.user.id)
    user_id.address= f"{add_1}, {add_2}, {add_3}, {pin}"
    user_id.save()
    return JsonResponse({'data': 'success'})

def cart_page(request):
    # cart_items = CartItem.objects.filter()
    return render(request, 'cart.html')


class Cartintemlist(APIView):
    def get(self, request):
        print('level.........')
        user = request.user
        cart = CartItem.objects.filter(user__email =user.email)
        return render(request, 'cart.html', {'cart': cart})
    
    def post(self, request):
        print('level2.........')
        user = request.user
        product_id = request.data.get('product_id') 
        quantity = int(request.data.get('quantity', 1))  # Default to 1 if not provided
        cart_check = CartItem.objects.filter(user__email = user.email, product_id = product_id)
        # Check if the product already exists in the cart for the user
        if not cart_check:
            cart_item, created = CartItem.objects.get_or_create(user = user, product_id = product_id, quantity = quantity)
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
        else:
            return JsonResponse({'alert': True})        

        seri = Cartitemserializer(cart_item)
        return Response(seri.data, status=status.HTTP_201_CREATED)    
    
    def delete(self, request, cart_item_id):
        print('level3.........')
        try:
            cart_item = CartItem.objects.get(id=cart_item_id, user__email=request.user.email)
            cart_item.delete()
            return JsonResponse({'message': 'success'})
        except CartItem.DoesNotExist:
            return JsonResponse({'message': 'issue'})
        

def email(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email_value')
        # print(email)
        try:
            CustomUser.objects.get(email=email)
            response_data = {'email_exists': True}
            return JsonResponse(response_data)
        except CustomUser.DoesNotExist:
            response_data = {'email_exists': False}
            return JsonResponse(response_data)

@csrf_protect
def cart_check(request, product_id):
    cart_check = CartItem.objects.filter(user__email = request.user.email, product_id = product_id)
    if cart_check:
        return JsonResponse({'alert': True}) 
    return JsonResponse({'alert': False})
    

def order(request):
    orders= Order.objects.filter(user__email = request.user.email)
    print(orders)
    return render(request, 'my_orders.html', {'orders': orders})

