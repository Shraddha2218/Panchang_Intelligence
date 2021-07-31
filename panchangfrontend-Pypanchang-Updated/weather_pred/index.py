from django.http import HttpResponse
from django.shortcuts import render

def home(request):
  return render(request,'result.html')
def about(request):
  return render(request,'About_us.html')
def compare(request):
  return render(request,'compare.html')
def references(request):
  return render(request,'references.html')
def contact(request):
  return render(request,'contact.html')
