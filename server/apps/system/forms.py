from django.contrib.auth.forms import AuthenticationForm
# from Crypto.PublicKey import RSA
# from Crypto.Cipher import PKCS1_v1_5
import os

class RsaAuthenticationForm(AuthenticationForm):
    def clean(self):
        module_dir = os.path.dirname(__file__)  # get current directory
        # publicKey = RSA.import_key(open(module_dir + "\..\..\..\ssl\public.pem").read())
        # cipherRSA = PKCS1_v1_5.new(publicKey)
        sentinel = None
        
        # 加密
        # username = cipherRSA.encrypt(self.cleaned_data.get('username'),sentinel)
        # password = cipherRSA.encrypt(self.cleaned_data.get('password'),sentinel)

        #未加密
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        print('encode:',username,password) #驗證加密值

        if username is not None and password:
            self.user_cache = authenticate(self.request, username=username, password=password)
            if self.user_cache is None:
                raise self.get_invalid_login_error()
            else:
                self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data