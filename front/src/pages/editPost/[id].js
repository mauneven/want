// pages/editPost/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditPost() {
    const router = useRouter();
    const { id } = router.query;

    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:4000/api/posts/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setPost(data);
                    setTitle(data.title);
                    setDescription(data.description);
                });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:4000/api/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
            }),
        });

        if (response.ok) {
            router.push('/myPosts');
        } else {
            // Handle error
            console.error('Error updating the post');
        }
    };

    return (
        <div className="container">
            <h1>Edit Post</h1>
            {post && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                            Title
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            className="form-control"
                            id="description"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Update Post
                    </button>
                </form>
            )}
        </div>
    );
}

