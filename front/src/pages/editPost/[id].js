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
    const [isLoading, setIsLoading] = useState(true);
  
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewDescription, setPreviewDescription] = useState('');
    const [previewLocation, setPreviewLocation] = useState('');
    const [previewCategory, setPreviewCategory] = useState('');
    const [previewPrice, setPreviewPrice] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
  
    useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const user = await userResponse.json();
          return user;
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      };
  
      const fetchPost = async () => {
        try {
          const postResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${id}`
          );
          const postData = await postResponse.json();
          return postData;
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };
  
      const fetchData = async () => {
        const [user, postData] = await Promise.all([fetchCurrentUser(), fetchPost()]);
      
        console.log("Current user:", user);
        console.log("Current user:", user.user._id);
        console.log("Post creator:", postData.createdBy._id);
      
        if (postData.createdBy._id !== user.user._id) {
          router.push('/404');
        } else {
          setPost(postData);
          setTitle(postData.title);
          setDescription(postData.description);
          setCountry(postData.country);
          setState(postData.state);
          setCity(postData.city);
          setPrice(postData.price);
          setMainCategory(postData.mainCategory);
          setSubCategory(postData.subCategory);
          setPhotoUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${postData.photo}`);
        }
        setIsLoading(false);
      };      
  
      if (id) {
        fetchData();
      }
    }, [id, router]);
  
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
      if (file) {
        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
      
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
                            <label htmlFor="title" className="form-label">Give a title to what you Want</label>
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
                            <label htmlFor="description" className="form-label">Now describe it in more detail</label>
                            <textarea
                                className="form-control"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">how much would you pay for what you Want</label>
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
    isRequired = {true}
    initialCountry={country}
    initialState={state}
    initialCity={city}
/>
                        </div>
                        <div className="mb-3">
                        <PostCategory
  onMainCategoryChange={(selectedMainCategory) => setMainCategory(selectedMainCategory)}
  onSubcategoryChange={(selectedSubCategory) => setSubCategory(selectedSubCategory)}
  initialMainCategory={mainCategory}
  initialSubcategory={subCategory}
  isRequired = {true}
/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="photo" className="form-label">Upload a guide photo of what you want</label>
                            <input
                                type="file"
                                className="form-control"
                                id="photo"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Update my post</button>
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
}

export default EditPost;
  