import "../../../app/globals.css";
import { useState, useEffect } from "react";
import axios from "axios";
import AddTag from "../../../components/AddTag";
import AddCategory from "../../../components/AddCategory";

const AdminPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imgPath, setImgPath] = useState("");
  const [isTodaysBest, setIsTodaysBest] = useState(false);
  const [isWeeklyBest, setIsWeeklyBest] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState([]);

  useEffect(() => {
    // Fetch categories
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    }).catch((error) => {
      console.error("Failed to fetch categories:", error.message || error);
    });

    // Fetch tags
    axios.get("/api/tags").then((response) => {
      setTags(response.data);
    }).catch((error) => {
      console.error("Failed to fetch tags:", error.message || error);
    });

    // Fetch menu items
    axios.get("/api/menuItems").then((response) => {
      setMenuItems(response.data);
    }).catch((error) => {
      console.error("Failed to fetch menu items:", error.message || error);
    });
  }, []);

  const addMenuItem = async () => {
    try {
      const response = await axios.post("/api/menuItems", {
        name,
        description,
        price,
        imgPath,
        isTodaysBest,
        isWeeklyBest,
        categoryId: categoryId || null,
        tagIds,
      });
      setMenuItems([...menuItems, response.data]);
    } catch (error) {
      console.error("Failed to add menu item:", error.message || error);
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      await axios.delete(`/api/menuItems/${id}`);
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete menu item:", error.message || error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-semibold text-gray-800 mb-6">Admin Panel</h1>
      <AddTag />
      <AddCategory />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add MenuItem</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addMenuItem();
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Image Path"
              value={imgPath}
              onChange={(e) => setImgPath(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center text-black">
                <input
                  type="checkbox"
                  checked={isTodaysBest}
                  onChange={(e) => setIsTodaysBest(e.target.checked)}
                  className="mr-2"
                />
                Today's Best
              </label>
              <label className="flex items-center text-black">
                <input
                  type="checkbox"
                  checked={isWeeklyBest}
                  onChange={(e) => setIsWeeklyBest(e.target.checked)}
                  className="mr-2"
                />
                Weekly Best
              </label>
            </div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select 
              multiple 
              value={tagIds} 
              onChange={(e) => setTagIds(Array.from(e.target.selectedOptions, option => option.value))}
              className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Tags</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
            >
              Add MenuItem
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">MenuItems</h2>
          <div className="space-y-4">
            {menuItems.map((menuItem) => (
              <div
                key={menuItem.id}
                className="bg-white shadow rounded p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {menuItem.name}
                  </h3>
                  <p className="text-gray-600">{menuItem.description}</p>
                  <p className="text-gray-600">Price: ${menuItem.price}</p>
                  <p className="text-gray-600">{menuItem.tags.map((tag) => tag.name).join(', ')}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => deleteMenuItem(menuItem.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;