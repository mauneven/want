import { useState } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostCategory from '@/components/posts/postCategory';
import Location from '@/components/location/location';
import Megamenu from '@/components/navigation/Navbar';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('Submitting post with values:', { title, description, country, state, city, mainCategory, subCategory });

    try {
      const response = await fetch('http://localhost:4000/api/posts', {
        method: 'POST',
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
      router.push('/'); // Redirige al inicio después de crear un post exitosamente
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="container">
    <Megamenu/>
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
      <button type="submit" className="btn btn-primary">Create Post</button>
    </form>
    </div>
  );
};

export default CreatePost;
