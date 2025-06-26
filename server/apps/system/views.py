import logging

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.cache import cache
from django.shortcuts import redirect
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers, status
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.mixins import (CreateModelMixin, DestroyModelMixin,
                                   ListModelMixin, RetrieveModelMixin,
                                   UpdateModelMixin)
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import (FileUploadParser, JSONParser,
                                    MultiPartParser)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError, ParseError
from utils.queryset import get_child_queryset2

from .filters import UserFilter
from .mixins import CreateUpdateModelAMixin, OptimizationMixin
from .models import (Dict, DictType, File, Organization, Permission, Position,
                     Role, User)
from .permission import RbacPermission, get_permission_list
from .permission_data import RbacFilterSet
from .serializers import (DictSerializer, DictTypeSerializer, FileSerializer,
                          OrganizationSerializer, PermissionSerializer,
                          PositionSerializer, RoleSerializer, 
                          UserCreateSerializer, UserListSerializer,
                          UserModifySerializer)

from django.contrib.auth.views import LoginView 
# from django.contrib.auth import (login as autn_login)
from django.contrib.auth import (
    REDIRECT_FIELD_NAME, get_user_model, login as auth_login,
    logout as auth_logout, update_session_auth_hash,
)
import os
from .forms import RsaAuthenticationForm

logger = logging.getLogger('log')
# logger.info('請求成功！ response_code:{}；response_headers:{}；response_body:{}'.format(response_code, response_headers, response_body[:251]))
# logger.error('請求出錯-{}'.format(error))

# class RsaKey(APIView):
#     """
#     return rsa public key
#     """
#     #authentication_classes = []
#     permission_classes = []

#     def get(self, request, format=None):
#         module_dir = os.path.dirname(__file__)  # get current directory
#         public_key = open(module_dir + "\..\..\..\ssl\public.pem").read().replace("\n","")
#         return Response(public_key)


class RsaLoginView(LoginView):
    form_class = RsaAuthenticationForm
    authentication_form = None
    redirect_field_name = REDIRECT_FIELD_NAME
    template_name = 'registration/login.html'
    redirect_authenticated_user = False
    extra_context = None
    

class LogoutView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):  # 可將token加入黑名單
        next = request.GET.get('next', None)
        auth_logout(request)  # 清除使用者 cookie
        # return Response(status=status.HTTP_200_OK)
        return redirect(next) if next else Response(status=status.HTTP_200_OK)

class DictTypeViewSet(ModelViewSet):
    """
    數據字典類型-增刪改查
    """
    perms_map = {'get': '*', 'post': 'dicttype_create',
                 'put': 'dicttype_update', 'delete': 'dicttype_delete'}
    queryset = DictType.objects.all()
    serializer_class = DictTypeSerializer
    pagination_class = None
    search_fields = ['name']
    ordering_fields = ['pk']
    ordering = ['pk']


class DictViewSet(ModelViewSet):
    """
    數據字典-增刪改查
    """
    perms_map = {'get': '*', 'post': 'dict_create',
                 'put': 'dict_update', 'delete': 'dict_delete'}
    # queryset = Dict.objects.get_queryset(all=True) # 獲取全部的,包括軟刪除的
    queryset = Dict.objects.all()
    filterset_fields = ['type', 'is_used', 'type__code']
    serializer_class = DictSerializer
    search_fields = ['name']
    ordering_fields = ['sort']
    ordering = ['sort']

    def paginate_queryset(self, queryset):
        """
        如果查詢參數里沒有page但有type或type__code時則不分頁,否則請求分頁
        也可用utils.pageornot方法
        """
        if self.paginator is None:
            return None
        elif (not self.request.query_params.get('page', None)) and ((self.request.query_params.get('type__code', None)) or (self.request.query_params.get('type', None))):
            return None
        return self.paginator.paginate_queryset(queryset, self.request, view=self)

class PositionViewSet(ModelViewSet):
    """
    崗位-增刪改查
    """
    perms_map = {'get': '*', 'post': 'position_create',
                 'put': 'position_update', 'delete': 'position_delete'}
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    pagination_class = None
    search_fields = ['name','description']
    ordering_fields = ['pk']
    ordering = ['pk']


class TestView(APIView):
    perms_map = {'get': 'test_view'}  # 單個API控權
    authentication_classes = []
    permission_classes = []
    def get(self, request, format=None):
        return Response('測試api接口')


class PermissionViewSet(ModelViewSet):
    """
    權限-增刪改查
    """
    perms_map = {'get': '*', 'post': 'perm_create',
                 'put': 'perm_update', 'delete': 'perm_delete'}
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    pagination_class = None
    search_fields = ['name']
    ordering_fields = ['sort']
    ordering = ['pk']


class OrganizationViewSet(ModelViewSet):
    """
    組織機構-增刪改查
    """
    perms_map = {'get': '*', 'post': 'org_create',
                 'put': 'org_update', 'delete': 'org_delete'}
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    pagination_class = None
    search_fields = ['name', 'type']
    ordering_fields = ['pk']
    ordering = ['pk']


class RoleViewSet(ModelViewSet):
    """
    角色-增刪改查
    """
    perms_map = {'get': '*', 'post': 'role_create',
                 'put': 'role_update', 'delete': 'role_delete'}
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    pagination_class = None
    search_fields = ['name']
    ordering_fields = ['pk']
    ordering = ['pk']


class UserViewSet(ModelViewSet):
    """
    用戶管理-增刪改查
    """
    perms_map = {'get': '*', 'post': 'user_create',
                 'put': 'user_update', 'delete': 'user_delete'}
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    filterset_class = UserFilter
    search_fields = ['username', 'name']
    ordering_fields = ['-pk']

    def get_queryset(self):
        queryset = self.queryset
        if hasattr(self.get_serializer_class(), 'setup_eager_loading'):
            queryset = self.get_serializer_class().setup_eager_loading(queryset)  # 性能優化
        dept = self.request.query_params.get('dept', None)  # 該部門及其子部門所有員工
        if dept:
            deptqueryset = get_child_queryset2(Organization.objects.get(pk=dept))
            queryset = queryset.filter(dept__in=deptqueryset)
        return queryset

    def get_serializer_class(self):
        # 根據請求類型動態變更serializer
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action == 'list':
            return UserListSerializer
        return UserModifySerializer

    def create(self, request, *args, **kwargs):
        # 創建用戶默認添加密碼
        password = request.data['password'] if 'password' in request.data else None
        if password:
            password = make_password(password)
        else:
            password = make_password('0000')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(password=password)
        return Response(serializer.data)

    @action(methods=['put'], detail=False, permission_classes=[IsAuthenticated], # perms_map={'put':'change_password'}
            url_name='change_password')
    def password(self, request, pk=None):
        """
        修改密碼
        """
        user = request.user
        old_password = request.data['old_password']
        if check_password(old_password, user.password):
            new_password1 = request.data['new_password1']
            new_password2 = request.data['new_password2']
            if new_password1 == new_password2:
                user.set_password(new_password2)
                user.save()
                return Response('密碼修改成功!', status=status.HTTP_200_OK)
            else:
                return Response('新密碼兩次輸入不一致!', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('舊密碼錯誤!', status=status.HTTP_400_BAD_REQUEST)

    # perms_map={'get':'*'}, 自定義action控權
    @action(methods=['get'], detail=False, url_name='my_info', permission_classes=[IsAuthenticated])
    def info(self, request, pk=None):
        """
        初始化用戶信息
        """
        user = request.user
        perms = get_permission_list(user)
        data = {
            'id': user.id,
            'username': user.username,
            'name': user.name,
            'roles': user.roles.values_list('name', flat=True),
            'avatar': user.avatar,
            'perms': perms,
        }
        return Response(data)

class FileViewSet(CreateModelMixin, DestroyModelMixin, RetrieveModelMixin, ListModelMixin, GenericViewSet):
    """
    文件上傳用
    """
    perms_map = None
    permission_classes=[IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser]
    queryset = File.objects.all()
    serializer_class = FileSerializer
    filterset_fields = ['type']
    search_fields = ['name']
    ordering = ['-create_time']

    def perform_create(self, serializer):
        fileobj = self.request.data.get('file')
        name = fileobj._name
        size = fileobj.size
        mime = fileobj.content_type
        type = '其它'
        if 'image' in mime:
            type = '圖片'
        elif 'video' in mime:
            type = '視頻'
        elif 'audio' in mime:
            type = '音頻'
        elif 'application' or 'text' in mime:
            type = '文檔'
        instance = serializer.save(create_by = self.request.user, name=name, size=size, type=type, mime=mime)
        instance.path = settings.MEDIA_URL + instance.file.name
        instance.save()
