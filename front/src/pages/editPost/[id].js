import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Location from '@/components/locations/location';
import PostCategory from '@/components/posts/postCategory';

const EditPost = () => {
    const router = useRouter();
    const { id } = router.query;

    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [mainCategory, setMainCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const response = await fetch('http://localhost:4000/api/is-logged-in', {
                credentials: 'include',
            });
    
            if (!response.ok) {
                router.push('/login');
            }
        };
    
        checkLoggedIn();
    }, []);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:4000/api/posts/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setPost(data);
                    setTitle(data.title);
                    setDescription(data.description);
                    setCountry(data.country);
                    setState(data.state);
                    setCity(data.city);
                    setMainCategory(data.mainCategory);
                    setSubCategory(data.subCategory)
                });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log('Submitting post with values:', { title, description, country, state, city, mainCategory, subCategory });

        try {
            const response = await fetch(`http://localhost:4000/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ title, description, country, state, city, mainCategory, subCategory }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            setLoading(false);
            router.push('/myPosts'); // Redirige a "Mis Posts" después de editar un post exitosamente
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>
            <div className="mb-3">
                <Location
                    onCountryChange={(selectedCountry) => setCountry(selectedCountry)}
                    onStateChange={(selectedState) => setState(selectedState)}
                    onCityChange={(selectedCity) => setCity(selectedCity)}
                />
            </div>
            <div className="mb-3">
                <PostCategory
                    onMainCategoryChange={(selectedMainCategory) => setMainCategory(selectedMainCategory)}
                    onSubCategoryChange={(selectedSubCategory) => setSubCategory(selectedSubCategory)}
                />
            </div>
            <button type="submit" className="btn btn-primary">Update Post</button>
        </form>
    )
};
export default EditPost;