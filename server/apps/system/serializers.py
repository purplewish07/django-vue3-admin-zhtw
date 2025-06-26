import re

from rest_framework import serializers

from .models import (Dict, DictType, File, Organization, Permission, Position,
                     Role, User)

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"

class DictTypeSerializer(serializers.ModelSerializer):
    """
    數據字典類型序列化
    """
    class Meta:
        model = DictType
        fields = '__all__'


class DictSerializer(serializers.ModelSerializer):
    """
    數據字典序列化
    """
    class Meta:
        model = Dict
        fields = '__all__'


class PositionSerializer(serializers.ModelSerializer):
    """
    崗位序列化
    """
    class Meta:
        model = Position
        fields = '__all__'


class RoleSerializer(serializers.ModelSerializer):
    """
    角色序列化
    """
    class Meta:
        model = Role
        fields = '__all__'


class PermissionSerializer(serializers.ModelSerializer):
    """
    權限序列化
    """
    class Meta:
        model = Permission
        fields = '__all__'


class OrganizationSerializer(serializers.ModelSerializer):
    """
    組織架構序列化
    """
    type = serializers.ChoiceField(
        choices=Organization.organization_type_choices, default='部門')

    class Meta:
        model = Organization
        fields = '__all__'


class UserListSerializer(serializers.ModelSerializer):
    """
    用戶列表序列化
    """
    dept_name = serializers.StringRelatedField(source='dept')
    roles_name = serializers.StringRelatedField(source='roles', many=True)
    class Meta:
        model = User
        fields = ['id', 'name', 'position',
                  'username', 'is_active', 'date_joined', 'dept_name', 'dept', 'roles', 'avatar', 'roles_name']

    @staticmethod
    def setup_eager_loading(queryset):
        """ Perform necessary eager loading of data. """
        queryset = queryset.select_related('superior','dept')
        queryset = queryset.prefetch_related('roles',)
        return queryset

class UserModifySerializer(serializers.ModelSerializer):
    """
    用戶編輯序列化
    """

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'dept',
                  'position', 'avatar', 'is_active', 'roles', 'is_superuser']

    # def validate_phone(self, phone):
    #     re_phone = '^1[358]\d{9}$|^147\d{8}$|^176\d{8}$'
    #     if not re.match(re_phone, phone):
    #         raise serializers.ValidationError('手機號碼不合法')
    #     return phone


class UserCreateSerializer(serializers.ModelSerializer):
    """
    創建用戶序列化
    """
    username = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'dept',
                  'position', 'avatar', 'is_active', 'roles']

    def validate_username(self, username):
        if User.objects.filter(username=username):
            raise serializers.ValidationError(username + ' 賬號已存在')
        return username

    # def validate_phone(self, phone):
    #     re_phone = '^1[358]\d{9}$|^147\d{8}$|^176\d{8}$'
    #     if not re.match(re_phone, phone):
    #         raise serializers.ValidationError('手機號碼不合法')
    #     if User.objects.filter(phone=phone):
    #         raise serializers.ValidationError('手機號已經被註冊')
    #     return phone
