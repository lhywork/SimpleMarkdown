const express = require('express');
const router = express.Router();

const marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

router.get('/', (req, res) => {
  let data = {
    ab: 'a'
  }
  res.render('index', data);
});

router.post('/save', (req, res) => {
  let title = req.body.title;
  let markdown = req.body.markdown;
  let html = `# ${title} # \n`  + markdown;
  let data ={};
  data.html = marked(html);
  res.json(data);
});

module.exports = router;