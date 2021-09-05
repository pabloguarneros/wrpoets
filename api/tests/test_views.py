from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rooms.models import Lesson
from users.models import User

class LessonsTests(APITestCase):

    def test_view_lesson_anonymous(self):
        url = reverse('api:course_list')
        response = self.client.get(url, format='json')
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_lesson(self):

        url = reverse('api:course_list')

        client = APIClient()
        self.testUser1 = User.objects.create_user(
            username='test_user1',password="test_password"
        )
        client.login(username=self.testUser1,
        password="test_password")
        data = {"title":"Wizarding World",
                "description":"lalalaland"}

        response = client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    
    def test_update_lesson(self):

        client = APIClient()
        url = reverse(('api:course_details'),kwargs={'pk': 2})

        self.testUser1 = User.objects.create_user(
            username='test_user1',password="test_password")
        self.testPost = Lesson.objects.create(title="Lala",description="Welcomes Africa")
        self.testUser1.lessons.add(self.testPost)
        client.login(username=self.testUser1.username, password="test_password")
        response = client.put(
            url,{
                "title":"lapa",
                "description":"wonton"
            }, format='json')

        self.assertEquals(response.status_code, status.HTTP_200_OK)


    