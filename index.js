import express from 'express';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// de teller.
let posts = [];
let nextId = 1;

const findPost = (id) => posts.find((post) => post.id === Number(id));

// View all posts + create form
app.get('/', (req, res) => {
  res.render('index.ejs', { posts });
});

// Create
app.post('/posts', (req, res) => {
  const title = req.body.title?.trim();
  const content = req.body.content?.trim();

  if (title && content) {
    posts.unshift({ id: nextId++, title, content, createdAt: new Date() });
  }
  res.redirect('/');
});

// Edit form (loads the existing post)
app.get('/posts/:id/edit', (req, res) => {
  const post = findPost(req.params.id);
  if (!post) return res.redirect('/');
  res.render('edit.ejs', { post });
});

// Save edit
app.post('/posts/:id/edit', (req, res) => {
  const post = findPost(req.params.id);
  const title = req.body.title?.trim();
  const content = req.body.content?.trim();

  if (post && title && content) {
    post.title = title;
    post.content = content;
  }
  res.redirect('/');
});

// Delete
app.post('/posts/:id/delete', (req, res) => {
  posts = posts.filter((post) => post.id !== Number(req.params.id));
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
