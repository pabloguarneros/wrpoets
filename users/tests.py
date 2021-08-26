from django.test import TestCase
from users.models import User

class UserTestCase(TestCase):
    
    def setUp(self):
        User.objects.create(username="pol",password="Coloring1234A", email="wrno.pablo@gmail.com")

    def test_user_get(self):
        main_user = User.objects.get(username="pol")
        self.assertEqual(main_user.email,"wrno.pablo@gmail.com")