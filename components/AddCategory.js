// components/AddCategory.js
import { useState } from 'react';
import axios from 'axios';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/categories/create', { name });
      setSuccessMessage(`Category "${response.data.name}" created successfully!`);
      setName('');
      setErrorMessage(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage('Name is required');
      } else {
        setErrorMessage('Failed to create category');
      }
      setSuccessMessage(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add Category</h2>
      {successMessage && <div className="mb-2 text-green-600">{successMessage}</div>}
      {errorMessage && <div className="mb-2 text-red-600">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 p-2 rounded border w-full"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
