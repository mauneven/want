import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Location from '@/components/locations/Location';
import PostCategory from '@/components/categories/Categories';

const EditPost = () => {
    const router = useRouter();
    const { id } = router.query;

    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [price, setPrice] = useState('');
    const [mainCategory, setMainCategory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [subCategory, setSubCategory] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [previewTitle, setPreviewTitle] = useState('');
    const [previewDescription, setPreviewDescription] = useState('');
    const [previewLocation, setPreviewLocation] = useState('');
    const [previewCategory, setPreviewCategory] = useState('');
    const [previewPrice, setPreviewPrice] = useState('');


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
                    setPrice(data.price);
                    setMainCategory(data.mainCategory);
                    setSubCategory(data.subCategory);
                });
        }
    }, [id]);

    useEffect(() => {
        setPreviewTitle(title);
        setPreviewDescription(description);
        setPreviewLocation(`${city}, ${state}, ${country}`);
        setPreviewCategory(`${mainCategory} > ${subCategory}`);
        setPreviewPrice(Number(price).toLocaleString());
    }, [title, description, country, state, city, mainCategory, subCategory, price]);

    // Verificar si el objeto 'post' está definido antes de renderizar el contenido del componente
    if (!post) {
        return <div>Loading...</div>;
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log('Submitting post with values:', {
            title,
            description,
            country,
            state,
            city,
            price,
            mainCategory,
            subCategory,
        });

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('country', country);
            formData.append('state', state);
            formData.append('city', city);
            formData.append('price', price);
            formData.append('mainCategory', mainCategory);
            formData.append('subCategory', subCategory);
            if (imageFile) {
                formData.append('photo', imageFile);
            }

            const response = await fetch(`http://localhost:4000/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(Object.fromEntries(formData)),
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
        <div className="mt-5 mb-5">
            <div className="row row-cols-1 row-cols-md-4 g-4">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit} className="container">
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">What do you Want?</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Give some details to the people about it</label>
                            <textarea
                                className="form-control"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Max Price</label>
                            <input
                                type="number"
                                className="form-control"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                            {price ? (
                                <small className="form-text text-muted">Price: {Number(price).toLocaleString()}</small>
                            ) : null}
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
                                onSubcategoryChange={(selectedSubCategory) => setSubCategory(selectedSubCategory)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="photo" className="form-label">Upload a photo about what you want</label>
                            <input
                                type="file"
                                className="form-control"
                                id="photo"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                        <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
                    </form>
                </div>
                <div className="col-md-3">
                    <div className="card post rounded-5 card-preview">
                    {!imageFile && post.photo && (
    <div style={{ height: "200px", overflow: "hidden" }}>
        <img
            src={post.photo} // Asegúrate de que 'post.photo' tenga la ruta correcta de la imagen original
            className="card-img-top"
            alt="Original"
            style={{ objectFit: "cover", height: "100%" }}
        />
    </div>
)}
                        <div className="card-body">
                            <h5 className="card-title post-title mb-2">{previewTitle || "Title"}</h5>
                            <h5 className="text-success">${previewPrice}</h5>
                            <p className="card-text post-text mb-2">{previewDescription || "Description"}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EditPost;