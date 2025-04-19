import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { toast, ToastContainer } from "react-toastify";

const CategoryManager = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, "categories"));
    const categoryArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCategories(categoryArray);
  };

  const addCategory = async () => {
    if (category) {
      await addDoc(collection(db, "categories"), { name: category });
      toast.success("Category added");
      setCategory("");
      fetchCategories();
    } else {
      toast.warning("Enter a category");
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Delete this category?")) {
      await deleteDoc(doc(db, "categories", id));
      toast.success("Deleted");
      fetchCategories();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container p-5" style={{
      backgroundImage: 'url("https://e0.pxfuel.com/wallpapers/343/987/desktop-wallpaper-credit-card-payment-adam-gault-graphy-thumbnail.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
    }}>
      <ToastContainer />
        <h3 className="text-light ">Manage Categories</h3>
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter category name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button className="btn btn-primary mb-3" onClick={addCategory}>Add Category</button>
        <ul className="list-group">
          {categories.map((cat) => (
            <li key={cat.id} className="list-group-item d-flex justify-content-between bg-dark text-white">
              {cat.name}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteCategory(cat.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default CategoryManager;
