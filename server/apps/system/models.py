from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.base import Model
import django.utils.timezone as timezone
from django.db.models.query import QuerySet

from utils.model import SoftModel, BaseModel
from simple_history.models import HistoricalRecords



class Position(BaseModel):
    """
    職位/崗位
    """
    name = models.CharField('名稱', max_length=32, unique=True)
    description = models.CharField('描述', max_length=50, blank=True, null=True)

    class Meta:
        verbose_name = '職位/崗位'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class Permission(SoftModel):
    """
    功能權限:目錄,菜單,接口
    """
    menu_type_choices = (
        ('目錄', '目錄'),
        ('菜單', '菜單'),
        ('接口', '接口')
    )
    name = models.CharField('名稱', max_length=30)
    type = models.CharField('類型', max_length=20,
                            choices=menu_type_choices, default='接口')
    is_frame = models.BooleanField('外部鏈接', default=False)
    sort = models.IntegerField('排序標記', default=1)
    parent = models.ForeignKey('self', null=True, blank=True,
                            on_delete=models.SET_NULL, verbose_name='父')
    method = models.CharField('方法/代號', max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '功能權限表'
        verbose_name_plural = verbose_name
        ordering = ['sort']


class Organization(SoftModel):
    """
    組織架構
    """
    organization_type_choices = (
        ('公司', '公司'),
        ('部門', '部門')
    )
    name = models.CharField('名稱', max_length=60)
    type = models.CharField('類型', max_length=20,
                            choices=organization_type_choices, default='部門')
    parent = models.ForeignKey('self', null=True, blank=True,
                            on_delete=models.SET_NULL, verbose_name='父')

    class Meta:
        verbose_name = '組織架構'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class Role(SoftModel):
    """
    角色
    """
    data_type_choices = (
        ('全部', '全部'),
        ('自定義', '自定義'),
        ('同級及以下', '同級及以下'),
        ('本級及以下', '本級及以下'),
        ('本級', '本級'),
        ('僅本人', '僅本人')
    )
    name = models.CharField('角色', max_length=32, unique=True)
    perms = models.ManyToManyField(Permission, blank=True, verbose_name='功能權限')
    datas = models.CharField('數據權限', max_length=50,
                             choices=data_type_choices, default='本級及以下')
    depts = models.ManyToManyField(
        Organization, blank=True, verbose_name='權限範圍')
    description = models.CharField('描述', max_length=50, blank=True, null=True)

    class Meta:
        verbose_name = '角色'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class User(AbstractUser):
    """
    用戶
    """
    name = models.CharField('姓名', max_length=20, null=True, blank=True)
    phone = models.CharField('手機號', max_length=11,
                             null=True, blank=True, unique=True)
    avatar = models.CharField(
        '頭像', default='/media/default/avatar.png', max_length=100, null=True, blank=True)
    dept = models.ForeignKey(
        Organization, null=True, blank=True, on_delete=models.SET_NULL, verbose_name='組織')
    position = models.ManyToManyField(Position, blank=True, verbose_name='崗位')
    superior = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL, verbose_name='上級主管')
    roles = models.ManyToManyField(Role, blank=True, verbose_name='角色')

    groups = models.ManyToManyField(
        'auth.Group', 
        related_name='system_user_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', 
        related_name='system_user_permissions',
        blank=True
    )



    class Meta:
        verbose_name = '用戶信息'
        verbose_name_plural = verbose_name
        ordering = ['id']

    def __str__(self):
        return self.username

class DictType(SoftModel):
    """
    數據字典類型
    """
    name = models.CharField('名稱', max_length=30)
    code = models.CharField('代號', unique=True, max_length=30)
    parent = models.ForeignKey('self', null=True, blank=True,
                            on_delete=models.SET_NULL, verbose_name='父')

    class Meta:
        verbose_name = '字典類型'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class Dict(SoftModel):
    """
    數據字典
    """
    name = models.CharField('名稱', max_length=60)
    code = models.CharField('編號', max_length=30, null=True, blank=True)
    description = models.TextField('描述', blank=True, null=True)
    type = models.ForeignKey(
        DictType, on_delete=models.CASCADE, verbose_name='類型')
    sort = models.IntegerField('排序', default=1)
    parent = models.ForeignKey('self', null=True, blank=True,
                            on_delete=models.SET_NULL, verbose_name='父')
    is_used = models.BooleanField('是否有效', default=True)
    history = HistoricalRecords()

    class Meta:
        verbose_name = '字典'
        verbose_name_plural = verbose_name
        unique_together = ('name', 'is_used', 'type')

    def __str__(self):
        return self.name

class CommonAModel(SoftModel):
    """
    業務用基本表A,包含create_by, update_by字段
    """
    create_by = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, verbose_name='創建人', related_name= '%(class)s_create_by')
    update_by = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, verbose_name='最後編輯人', related_name= '%(class)s_update_by')

    class Meta:
        abstract = True

class CommonBModel(SoftModel):
    """
    業務用基本表B,包含create_by, update_by, belong_dept字段
    """
    create_by = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, verbose_name='創建人', related_name = '%(class)s_create_by')
    update_by = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, verbose_name='最後編輯人', related_name = '%(class)s_update_by')
    belong_dept = models.ForeignKey(
        Organization, null=True, blank=True, on_delete=models.SET_NULL, verbose_name='所屬部門', related_name= '%(class)s_belong_dept')

    class Meta:
        abstract = True


class File(CommonAModel):
    """
    文件存儲表,業務表根據具體情況選擇是否外鍵關聯
    """
    name = models.CharField('名稱', max_length=100, null=True, blank=True)
    size = models.IntegerField('文件大小', default=1, null=True, blank=True)
    file = models.FileField('文件', upload_to='%Y/%m/%d/')
    type_choices = (
        ('文檔', '文檔'),
        ('視頻', '視頻'),
        ('音頻', '音頻'),
        ('圖片', '圖片'),
        ('其它', '其它')
    )
    mime = models.CharField('文件格式', max_length=120, null=True, blank=True)
    type = models.CharField('文件類型', max_length=50, choices=type_choices, default='文檔')
    path = models.CharField('地址', max_length=200, null=True, blank=True)

    class Meta:
        verbose_name = '文件庫'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name