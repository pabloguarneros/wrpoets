from django.test import TestCase
from users.models import User
from .models import Lesson

class Test_Create_Lesson(TestCase):

    @classmethod
    def setUpTestData(cls):
        test_lesson = Lesson.objects.create(title="Learning Magical Spells",description="Because we love Harry Potter")
        test_user_A = User.objects.create(
            username="test_user1", password="WalkingInADream"
        )
        test_lesson.save()
        test_user_A.lessons.add(test_lesson)
        test_user_A.save()

    def test_lesson_content(self):
        lesson = Lesson.objects.get(title="Learning Magical Spells")
        lesson_name = f'{lesson.title}'
        self.assertEqual(lesson_name,"Learning Magical Spells")