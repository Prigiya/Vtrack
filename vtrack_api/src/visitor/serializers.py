from django.utils.translation import gettext_lazy
from rest_framework import serializers

from drf_extra_fields.fields import Base64ImageField
from rest_framework.exceptions import ValidationError

from config.models import Item
from visitor.helpers import check_otp
from visitor.models import (
    AccessCard, Approval, Category, Host, NIDType, Timing,
    Valid, VisitorDetail, PurposeOfVisit
)


class AccessCardSerializer(serializers.ModelSerializer):
    """AccessCard Serializer"""

    class Meta:
        model = AccessCard
        fields = "__all__"


class PurposeOfVisitSerializer(serializers.ModelSerializer):
    """Purpose of Visit Serializer"""

    class Meta:
        model = PurposeOfVisit
        fields = "__all__"


class ApprovalSerializer(serializers.ModelSerializer):
    """Approval Serializer"""

    class Meta:
        model = Approval
        fields = "__all__"

    def create(self, validated_data):
        """for updating access card is allocated field"""
        if 'access_card' in validated_data:
            instance = AccessCard.objects.get(id=validated_data['access_card'].id)
            instance.is_allocated = True
            instance.save()
        return super().create(validated_data)


class CategorySerializer(serializers.ModelSerializer):
    """Category Serializer"""

    class Meta:
        model = Category
        fields = "__all__"


class HostSerializer(serializers.ModelSerializer):
    """Host Serializer"""

    class Meta:
        model = Host
        fields = "__all__"


class NIDTypeSerializer(serializers.ModelSerializer):
    """NIDType Serializer"""

    class Meta:
        model = NIDType
        fields = "__all__"


class TimingSerializer(serializers.ModelSerializer):
    """Timing Serializer"""

    class Meta:
        model = Timing
        fields = "__all__"


class VisitorDetailSerializer(serializers.ModelSerializer):
    """Visitor Serializer"""
    photo = Base64ImageField(label=gettext_lazy("photo"), required=False)
    signature = Base64ImageField(label=gettext_lazy("signature"), required=False)
    national_id = Base64ImageField(label=gettext_lazy("national_id"), required=False)

    def create(self, validated_data):
        t = Timing.objects.filter(
            approval__visitor__email=validated_data['email']).last()
        if not t:  # new user
            return super().create(validated_data)
        elif t.check_out is None:  # user is already in
            raise serializers.ValidationError("user is already inside")
        else:  # same user coming again
            return super().create(validated_data)

    class Meta:
        model = VisitorDetail
        fields = "__all__"


class ValidSerializer(serializers.ModelSerializer):
    """Valid Serializer"""

    class Meta:
        model = Valid
        fields = "__all__"

    def update(self, instance, validated_data):
        if validated_data['otp'] == str(
                Item.get_value('visitor:valid:otp:universal_otp')):
            instance.is_valid = True
            validated_data['otp'] = instance.otp
            return super().update(instance, validated_data)
        if not check_otp(validated_data['otp'], instance.otp):
            msg = "Wrong otp"
            raise serializers.ValidationError(msg)
        instance.is_valid = True
        return super().update(instance, validated_data)
