
# [ErsatzNote](https://ersatznote.herokuapp.com/)

![Splash Page](https://github.com/jpaul121/ErsatzNote/blob/main/frontend/src/assets/SplashPage.png)

ErsatzNote is a full-stack web application built with React, Django, Webpack, and TypeScript. Inspired by EverNote, it allows users to create notebooks and populate them with notes written in rich text, everything from to-do lists to workout plans and lecture notes. With its current deployment on Heroku, you can make an account and get to creating and saving notes that will always be accessible in the cloud, or try it out as a guest user without needing to sign up. 

## Features

ErsatzNote currently has the following features:

* #### Secure user authentication using locally stored JWT tokens
* #### Create notebooks, change their titles, and delete them at the touch of a button
* #### Search for notes by their title and contents, and the index will automatically update to show notes that match your query
* #### Create and edit notes with a rich text editor, allowing you to write ordered and unordered lists and code snippets, among other things
* #### Save notes to the cloud, where they'll be readily available thanks to a PostgreSQL database deployed on Heroku

## Some frontend highlights

ErsatzNote's frontend was built using React and TypeScript. TypeScript allows for a development experience that's unmatched by vanilla JavaScript, facilitating the creation of code with an expressiveness and robustness that's difficult to get without it. 

### API requests

Notes are fetched from the Django API by the frontend via Axios requests calibrated to incorporate the proper authentication tokens and CORS headers: 

`frontend/src/axiosAPI.ts`

```typescript
import axios from 'axios'

const COMPILE_TIME_SETTING = JSON.parse(document.getElementById('compileTimeSetting')!.textContent!)['NODE_ENV']
const PORT = Number(document.getElementById('port')!.textContent!)

const BASE_URL = COMPILE_TIME_SETTING === 'production' ? 'https://ersatznote.herokuapp.com' : 'http://localhost:8000'
const DEFAULT_HTTPS_PORT = 443

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'xsrfHeaderName': 'X-CSRFTOKEN',
    'xrsfCookieName': 'csrftoken',
    'Authorization': localStorage.getItem('access_token') ? `JWT ${localStorage.getItem('access_token')}` : null,
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'Access-Control-Allow-Origin': BASE_URL,
  },
  proxy: {
    protocol: COMPILE_TIME_SETTING === 'production' ? 'https' : 'http',
    host: BASE_URL,
    port: PORT || DEFAULT_HTTPS_PORT,
  }
})

...
...
```

The `COMPILE_TIME_SETTING` and `PORT` constants are environmental variables taken from the server at compilation. It's able to receive these from the Django backend in a roundabout way securely thanks to Django's `json_script` template tag, which mitigates the possibility of cross-site scripting (XSS) attacks by escaping certain characters:

`frontend/views.py`

```python
from django.conf import settings
from django.shortcuts import render

def index(request, *args, **kwargs):
  return render(request, 'index.html', context={
    'COMPILE_TIME_SETTING': settings.COMPILE_TIME_SETTING,
    'GUEST_USER_CREDENTIALS': settings.GUEST_USER_CREDENTIALS,
    'PORT': settings.PORT,
  })
```

`frontend/templates/index.html`

```html
<!DOCTYPE html>
{% load static %}
<html>
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <link rel='icon' href='{% static "frontend/favicon.ico" %}' type='image/x-icon' />
  <title>ErsatzNote</title>
</head>
<body>
<div id='root'>
  <!-- React goes here. -->
</div>
</body>
{{ COMPILE_TIME_SETTING|json_script:"compileTimeSetting" }}
{{ GUEST_USER_CREDENTIALS|json_script:"guestUserCredentials" }}
{{ PORT|json_script:"port" }}
<script src='{% static "frontend/index.js" %}'></script>
</html>
```

The `compileTimeSetting` and `guestUserCredentials` variables are then rendered as strings in the same HTML file that our frontend single-page app (SPA) will be rendered in. 

### Search

When the user first logs into ErsatzNote, all their notes are available via the `NotePreview` component rendered as part of all user flows in which the notes themselves are accessed. The complete logic for fetching notes and processing them to enable search is handled by the `processNotes()` function shown below. The `getNotesFromNotebook()` and `getAllNotes()` functions abstract away the logic for API requests, which differs based on whether or not the user is trying to access all notes or notes from a particular notebook, which the app can figure out based on the presence of the 'notebook_id' variable in the URL:

`frontend/src/components/notes/NotePreview.tsx`

```typescript
...
...

  async function processNotes() {
    const noteData = props.match.params.notebook_id
      ? await getNotesFromNotebook()
      : await getAllNotes()

    let processedNotes: NotePreviewData = {}
    for (const note of noteData) {
      const tokens = generateTokens(note)
      const noteTrie = new Trie().addWords(tokens)
      processedNotes[note.note_id] = {
        note,
        trie: noteTrie,
      }
    }

    if (_isMounted.current) setNotes(processedNotes)
    if (_isMounted.current) setLoadingStatus(false)
  }

...
...
```

Once a given user's note data is fetched from the URL, all text from each individual note is gathered and fed into a `Set` of unique words, which is then fed into a `Trie` that enables the user to search for a given note based on the words in its title or content, as demonstrated above. Once the text content of a note is received, regular expressions are used to strip HTML tags (which the note editor uses to render rich text) and punctuation from words:

`frontend/src/components/notes/NotePreview.tsx`

```typescript
...
...

  function generateTokens(note: NoteData): Set<string> {
    const titleText = getTitlePreview(note)
    const contentText = note['content']
      .replace(/(<([^>]+)>)/g, '')
      .replace(/[!,\.\?]/g, '')
      .replace('&#39;', '\'')
		
    let wordList = titleText.split(/\s+/).concat(contentText.split(/\s+/))
    wordList = wordList.map(word => word.trim().toLowerCase())
		
    return new Set(wordList);
  }

...
...
```

The `Trie` assigned to each note containing every unique word within its contents is then used by the `NotePreview` component to filter the notes received from the API based on the presence of discrete terms the user types into the search bar (which are delineated by one or more whitespace characters): 

`frontend/src/components/notes/NotePreview.tsx`

```typescript
...
...

  useEffect(() => {
    // If the user types in a search query, create a filtered group of
    // notes such that only notes that include possible matches will be included
    if (_isMounted.current && !isLoading && searchQuery)
      setFilteredNotes(Object.fromEntries(
        Object.entries(notes as Object).filter(item => {
          return searchQuery.toLowerCase().split(/\s+/).every(token => {
            return item[1].trie.includesPossibleMatch(token);
          });
        })
      ))
  }, [ searchQuery ])

...
...
```

`frontend/src/types.ts`

```typescript
...
...

export class Trie {

  ...
  ...

  public includesPossibleMatch(word: string): boolean {
    // Returns true if the last character in the given search term completes a word
    // or if it has any children, which indicates that it may still potentially contain a match
    const lastCharacter = this.getLastCharacterNode(word)
    if (!lastCharacter) return false;
    return (lastCharacter.isCompleteWord || !!(Object.keys(lastCharacter.children).length));
  }

  ...
  ...

}

...
...
```

Finally, depending on whether or not the user has input search terms into the search bar, either the full set of notes fetched from the API is rendered (the `notes` variable in state) or a filtered subset of them (the `filteredNotes` variable). The presence or absence of search terms is determined by whether or not `searchQuery` is an empty string or not, and therefore 'truthy' or 'falsy' in idomatic JavaScript (and by extension, TypeScript): 

`frontend/src/components/notes/NotePreview.tsx`

```jsx
...
...

  {
    !isLoading &&
    <ul className={styles['note-list']}>
      {
        Object.values(((searchQuery && filteredNotes) ? filteredNotes : notes) as Object).map(item => {
          return (
            <Link
              key={item['note'].note_id}
              to={
                props.match.params.notebook_id
                ? `/notebooks/${item['note'].notebook}/notes/${item['note'].note_id}/`
                : `/all-notes/${item['note'].note_id}/`
              }
            >
              <Note
                note_id={item['note'].note_id}
                title={getTitlePreview(item['note'])}
                content={getContentPreview(item['note'])}
                date_modified={item['note'].date_modified}
              />
            </Link>
          );
        })
      }
    </ul>
  }

...
...
```

## Some backend highlights

ErsatzNote was built using React, and is served via a Django backend that provides a single-page app and an API that the former makes requests to. Backend-frontend integration is achieved through API requests that are secured using strict CORS policies and the HTTPS protocol. The backend doesn't just pass information to the frontend via HTTPS requests; it also securely passes environmental variables to it from the server, allowing the frontend to adjust the URL it sends requests to at compile time, among other things. PostgreSQL is used to manage the database. 

### User Authentication and Session Management

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

The JWT authentication tokens obtained from the backend are saved locally, where they will determine the user's access privileges until they are overwritten or expire. The Axios instance implemented in `frontend/src/axiosAPI.ts` then attempts to get a new access token from the backend or, failing that, redirects the user to the login page to re-enter their credentials. 

### Notes and Notebooks

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

## Dependencies

* React `17.0.1`
* Django `2.2`
* React `5.13.0`
* PostgreSQL