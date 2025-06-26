from django.urls import path, include
from .views import UserViewSet, OrganizationViewSet, PermissionViewSet, RoleViewSet, PositionViewSet, TestView, DictTypeViewSet, DictViewSet #, RsaKey
from rest_framework import routers


router = routers.DefaultRouter()
router.register('user', UserViewSet, basename="user")
router.register('organization', OrganizationViewSet, basename="organization")
router.register('permission', PermissionViewSet, basename="permission")
router.register('role', RoleViewSet, basename="role")
router.register('position', PositionViewSet, basename="position")
router.register('dicttype', DictTypeViewSet, basename="dicttype")
router.register('dict', DictViewSet, basename="dict")
# router.register('ptask', PTaskViewSet, basename="ptask")
urlpatterns = [
    path('', include(router.urls)),
    path('test/', TestView.as_view()),
    # path('getkey/', RsaKey.as_view())
    
]
