
# [ErsatzNote](https://ersatznote.herokuapp.com/)

![Splash Page](https://github.com/jpaul121/ErsatzNote/blob/main/frontend/src/assets/SplashPage.png)

ErsatzNote is a full-stack web application built with React, Django, Webpack, and TypeScript. Inspired by EverNote, it allows users to create notebooks and populate them with notes written in rich text, everything from to-do lists to workout plans and lecture notes. With its current deployment on Heroku, you can make an account and get to creating and saving notes that will always be accessible in the cloud, or try it out as a guest user without needing to sign up. 

## Features

ErsatzNote currently has the following features:

* #### Secure and safe user authentication using locally stored JWT tokens
* #### Create notebooks, change their titles, and delete them at the touch of a button
* #### Search for notes by their title and contents, and the index will automatically update to show notes that match your query
* #### Create and edit notes with a rich text editor, allowing you to write ordered and unordered lists and code snippets, among other things
* #### Save notes to the cloud, where they'll be readily available thanks to a PostgreSQL database deployed on Heroku

## Stack

### Backend

ErsatzNote was built using React, and is served via a Django backend that provides a single-page app and an API that the former makes requests to. Backend-frontend integration is achieved through API requests that are secured using strict CORS policies and the HTTPS protocol. The backend doesn't just pass information to the frontend via HTTPS requests; it also securely passes environmental variables to it from the server, allowing the frontend to adjust the URL it sends requests to at compile time, among other things. PostgreSQL is used to manage the database. 

#### User Authentication and Session Management

Creating an account on ErsatzNote is quick and painless; just put sign up using an email and password, or if you'd like, start using it without the need to sign up by clicking the **"CHECK IT OUT"** button on the splash page. 

Here's a snippet from `authentication/views.py`, where you can get the gist of how the app's authentication features are handled:

```python
class InvalidUser(AuthenticationFailed):
  status_code = status.HTTP_406_NOT_ACCEPTABLE
  default_detail = ('User credentials are invalid or expired.')
  default_code =  'user_credentials_not_valid'

class ErsatzNoteUserCreate(APIView):
  authentication_classes = []
  permission_classes = (permissions.AllowAny,)
	
  def post(self, request, format='json'):
    serializer = ErsatzNoteUserSerializer(data=request.data)
		
    if serializer.is_valid():
      user = serializer.save()

      if user:
        json = serializer.data
				
        return Response(json, status=status.HTTP_201_CREATED)
				
    return Response(
      serializer.errors,
      headers=settings.ACCESS_CONTROL_RESPONSE_HEADERS,
      status=status.HTTP_400_BAD_REQUEST
    )

class ObtainRefreshToken(TokenViewBase):
  authentication_classes = []
  permission_classes = (permissions.AllowAny,)
  serializer_class = ErsatzNoteTokenObtainPairSerializer

  def post(self, request, *args, **kwargs):
    serializer =  self.get_serializer(data=request.data)

    try:
      serializer.is_valid(raise_exception=True)
    except AuthenticationFailed as e:
      raise InvalidUser(e.args[0])
    except TokenError as e:
      raise InvalidToken(e.args[0])
			
    return Response(
      serializer.validated_data,
      headers=settings.ACCESS_CONTROL_RESPONSE_HEADERS,
      status=status.HTTP_200_OK
    )
```

#### Notebooks and Notes:

The relationship between users, notebooks, and notes is managed through database associations. Here's an example from the Note model in `notebooks/models.py`:

```python
class Note(models.Model):
  """ Represents an individual note. """
  id  = models.SlugField(max_length=settings.MAX_SLUG_LENGTH, primary_key=True)
  title = JSONField(null=True)
  content = models.TextField(null=True)
  notebook = models.ForeignKey('Notebook', related_name='notes', on_delete=models.CASCADE, null=True, blank=True)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='notes', on_delete=models.CASCADE, null=True, blank=True)
  date_created = models.DateField(auto_now_add=True)
  date_modified = models.DateField(auto_now=True)

  def save(self, *args, **kwargs):
    if not self.id:
      self.id = generate_slug(self, settings.MAX_SLUG_LENGTH)
    super(Note, self).save(*args, **kwargs)

  def __str__(self):
    return self.id

class Meta:
  ordering = [ '-date_modified', '-date_created', ]
```

The app leverages Django's ORM to associate notes, notebooks, and users, enabling it to do things like deleting all notes in a notebook upon the latter's deletion. 

### Frontend

ErsatzNote's frontend was built using React and TypeScript. TypeScript allows for a development experience that's unmatched by vanilla JavaScript, facilitating the creation of code with an expressiveness and robustness that's difficult to get without it. 

## Dependencies

* React ``17.0.1``
* Django ``2.2``
* React ```5.13.0```
* PostgreSQL