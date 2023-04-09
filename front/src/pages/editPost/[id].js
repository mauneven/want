import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Location from '@/components/locations/Location';
import PostCategory from '@/components/categories/Categories';

const EditPost = () => {
    const router = useRouter();
    const { id } = router.query;

    const [post, setPost] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isPostLoaded, setIsPostLoaded] = useState(false);
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
    const [isLoading, setIsLoading] = useState(true);

    const [previewTitle, setPreviewTitle] = useState('');
    const [previewDescription, setPreviewDescription] = useState('');
    const [previewLocation, setPreviewLocation] = useState('');
    const [previewCategory, setPreviewCategory] = useState('');
    const [previewPrice, setPreviewPrice] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        const fetchPostData = async () => {
            const response = await fetch(`/api/posts/${id}`);
            if (response.ok) {
                const postData = await response.json();
                setPost(postData.post);
                setCurrentUser(postData.currentUser);
                setIsPostLoaded(true); // Añadir esta línea
                setIsLoading(false);
            } else {
                setIsPostLoaded(true); // Añadir esta línea
            }
        };

        fetchPostData();
    }, [id]);

    if (!post) {
        router.push('/404');
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${id}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData,
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
                        {previewImage ? (
                            <div style={{ height: "200px", overflow: "hidden" }}>
                                <img
                                    src={previewImage}
                                    className="card-img-top"
                                    alt="Preview"
                                    style={{ objectFit: "cover", height: "100%" }}
                                />
                            </div>
                        ) : (
                            <div style={{ height: "200px", overflow: "hidden" }}>
                                <img
                                    src={photoUrl}
                                    className="card-img-top"
                                    alt="Post"
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