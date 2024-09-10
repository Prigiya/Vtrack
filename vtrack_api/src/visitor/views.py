from django.db import connection
from django.utils import timezone
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, viewsets
from rest_framework.renderers import TemplateHTMLRenderer
from visitor.filters import (
    AccessCardFilterSet,
    ApprovalFilterSet,
    CategoryFilterSet, HostFilterSet, NIDTypeFilterSet, TimingFilterSet
)
from visitor.models import AccessCard, Approval, Category, Host, NIDType, \
    PurposeOfVisit, Timing, VisitorDetail, Valid
from visitor.serializers import (
    AccessCardSerializer,
    ApprovalSerializer,
    CategorySerializer,
    EmailRecordSerializer,
    HostSerializer,
    NIDTypeSerializer,
    TimingSerializer,
    VisitorDetailSerializer,
    ValidSerializer,
    VisitorSerializer,
    PurposeOfVisitSerializer
)
from visitor.renderes import CSVRenderer

class AccessCardViewSet(viewsets.ModelViewSet):
    """AccessCard View Set"""

    queryset = AccessCard.objects.all()
    serializer_class = AccessCardSerializer
    filterset_class = AccessCardFilterSet

    def get_queryset(self):
        category = int(self.request.query_params['category_number'])
        if category in [int(AccessCard.Choices.Guest.value),
                        int(AccessCard.Choices.Visitor.value),
                        int(AccessCard.Choices.Client.value),
                        int(AccessCard.Choices.NewHires.value)]:
            category = AccessCard.Choices.Guest.value
        filter_kwargs = {
            "is_allocated": False,
            "category_id": category
        }
        queryset = super().get_queryset().filter(**filter_kwargs)
        return queryset


class PurposeOfVisitViewSet(viewsets.ModelViewSet):
    """ PurposeOfVisit View Set"""

    queryset = PurposeOfVisit.objects.all()
    serializer_class = PurposeOfVisitSerializer

    def get_queryset(self):
        filter_kwargs = {
            "category_id": self.request.query_params['category']
        }
        queryset = super().get_queryset().filter(**filter_kwargs)
        return queryset


class ApprovalViewSet(viewsets.ModelViewSet):
    """ Approval View Set"""

    queryset = Approval.objects.all()
    serializer_class = ApprovalSerializer
    filterset_class = ApprovalFilterSet


class CategoryViewSet(viewsets.ModelViewSet):
    """ Category View Set"""

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filterset_class = CategoryFilterSet


class HostViewSet(viewsets.ModelViewSet):
    """ Host View Set"""

    queryset = Host.objects.all()
    serializer_class = HostSerializer
    filterset_class = HostFilterSet


class NIDTypeViewSet(viewsets.ModelViewSet):
    """ NIDType View Set"""

    queryset = NIDType.objects.all()
    serializer_class = NIDTypeSerializer
    filterset_class = NIDTypeFilterSet


class TimingViewSet(viewsets.ModelViewSet):
    """ Host View Set"""

    queryset = Timing.objects.all()
    serializer_class = TimingSerializer
    filterset_class = TimingFilterSet


class VisitorDetailViewSet(viewsets.ModelViewSet):
    """ Visitor View Set"""

    queryset = VisitorDetail.objects.all()
    serializer_class = VisitorDetailSerializer


class ValidViewSet(viewsets.ModelViewSet):
    """ Valid View Set"""

    queryset = Valid.objects.all()
    serializer_class = ValidSerializer
    

from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from rest_framework import viewsets, status
from rest_framework.response import Response

class ValidOtpViewSet(viewsets.ModelViewSet):
    
    queryset = Valid.objects.all()
    
    serializer_class = EmailRecordSerializer
    def get_serializer_class(self):
        if self.action == "POST":
            return EmailRecordSerializer
        else:
            return ValidSerializer
        
    def create(self, request):
        email_serializer = EmailRecordSerializer(data=request.data)
        if email_serializer.is_valid():
            email = email_serializer.validated_data['email']
            otp = get_random_string(length=6, allowed_chars='0123456789')
            # Valid.objects.create(email=email, otp=otp)
            valid_record = Valid.objects.create(email=email, otp=otp)

            valid_id = valid_record.id
            send_mail(
                'Your OTP Code',
                f'Your OTP code is {otp}',
                'Vtrack@innovasolutions.com',
                [email],
                fail_silently=False,
            )
            return Response({'message': 'OTP sent to email', 'valid_id': valid_id}, status=status.HTTP_200_OK)
        return Response(email_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def update(self, request, pk=None, partial=False):
        otp_serializer = ValidSerializer(data=request.data, partial=partial)
        if otp_serializer.is_valid():
            email = otp_serializer.validated_data.get('email')
            otp = otp_serializer.validated_data.get('otp')
            
            try:
                # Get the record by id (pk) and update email and otp
                otp_record = Valid.objects.get(pk=pk)
                if email is not None:
                    otp_record.email = email
                if otp is not None:
                    otp_record.otp = otp
                otp_record.save()

                return Response({'message': 'OTP updated successfully'}, status=status.HTTP_200_OK)
            except Valid.DoesNotExist:
                return Response({'error': 'Record with the given id does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(otp_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CheckoutViewSet(generics.ListAPIView):
    """Check out View Set"""

    queryset = Timing.objects.all()
    serializer_class = TimingSerializer

    def get(self, request, *args, **kwargs):
        instance = Timing.objects.filter(
            approval__visitor__email=self.request.query_params['email']).last()
        if instance.approval.access_card is not None:
            access_card_instance = instance.approval.access_card
            access_card_instance.is_allocated = False
            access_card_instance.save()  # for making the access card available again
        Valid.objects.get(visitor__email=self.request.query_params['email']).delete()
        instance.check_out = timezone.now()
        instance.save()
        return self.list(request, *args, **kwargs)


class AuditVisitorView(generics.ListAPIView):
    """Audit Visitor: View"""

    query_serializer = VisitorSerializer
    serializer_class = VisitorDetailSerializer
    pagination_class = None
    renderer_classes = [CSVRenderer]

    def get_queryset(self):
        raw_query = f"""
        Select vd.name as visitor_name, 
        phone, 
        email, 
        photo,
        va.id as address_id,
        vh.name as host_name,
        vh.email as host_email,
        vh.phone as host_phone,
        vt.check_in as check_in,
        vt.check_out as check_out,
        vp.name as purpose_of_visit,
        from visitor_visitordetail vd 
        inner join visitor_approval va on vd.id = va.visitor_id 
        inner join visitor_host vh on va.host_id = vh.id
        inner join visitor_timing vt on vt.approval_id = va.id
        inner join visitor_purposeofvisit on vp on vt.id = va.purpose_of_visit_id
        """
        with connection.cursor() as cursor:
            cursor.execute(raw_query)
            columns = tuple(desc[0] for desc in cursor.description)
            queryset = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return queryset


