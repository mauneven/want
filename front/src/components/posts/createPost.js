import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const post = { title, content };

    try {
      const response = await fetch('http://localhost:4000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
      });

      if (response.ok) {
        alert('Post creado!');
      } else {
        alert('No se pudo crear el post');
      }
    } catch (error) {
      console.error(error);
      alert('Ha ocurrido un error al crear el post');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="postTitle">
        <Form.Label>Título</Form.Label>
        <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="postContent">
        <Form.Label>Contenido</Form.Label>
        <Form.Control as="textarea" rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Crear post
      </Button>
    </Form>
  );
}

export default CreatePostForm;