from django.db import models
from django.apps import apps


def get_child_queryset_u(checkQueryset, obj, hasParent=True):
    '''
    獲取所有子集
    查的範圍checkQueryset
    父obj
    是否包含父默認True
    '''
    cls = type(obj)
    queryset = cls.objects.none()
    fatherQueryset = cls.objects.filter(pk=obj.id)
    if hasParent:
        queryset = queryset | fatherQueryset
    child_queryset = checkQueryset.filter(parent=obj)
    while child_queryset:
        queryset = queryset | child_queryset
        child_queryset = checkQueryset.filter(parent__in=child_queryset)
    return queryset


def get_child_queryset(name, pk, hasParent=True):
    '''
    獲取所有子集
    app.model名稱
    Id
    是否包含父默認True
    '''
    app, model = name.split('.')
    cls = apps.get_model(app, model)
    queryset = cls.objects.none()
    fatherQueryset = cls.objects.filter(pk=pk)
    if fatherQueryset.exists():
        if hasParent:
            queryset = queryset | fatherQueryset
        child_queryset = cls.objects.filter(parent=fatherQueryset.first())
        while child_queryset:
            queryset = queryset | child_queryset
            child_queryset = cls.objects.filter(parent__in=child_queryset)
    return queryset

def get_child_queryset2(obj, hasParent=True):
    '''
    獲取所有子集
    obj實例
    數據表需包含parent字段
    是否包含父默認True
    '''
    cls = type(obj)
    queryset = cls.objects.none()
    fatherQueryset = cls.objects.filter(pk=obj.id)
    if hasParent:
        queryset = queryset | fatherQueryset
    child_queryset = cls.objects.filter(parent=obj)
    while child_queryset:
        queryset = queryset | child_queryset
        child_queryset = cls.objects.filter(parent__in=child_queryset)
    return queryset