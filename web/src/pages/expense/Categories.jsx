import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [budgets, setBudgets] = useState({});

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/categories');
            setCategories(response.data);
            const budgetsObj = {};
            response.data.forEach(cat => {
                budgetsObj[cat.name] = cat.budget;
            });
            setBudgets(budgetsObj);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    const handleAddCategory = async () => {
        if (newCategory && !categories.find(cat => cat.name === newCategory)) {
            try {
                const response = await axios.post('http://localhost:5000/categories', {
                    name: newCategory,
                    budget: 0
                });
                setCategories(prev => [...prev, response.data]);
                setBudgets(prev => ({ ...prev, [newCategory]: 0 }));
                setNewCategory('');
            } catch (error) {
                console.error("Error adding category", error);
            }
        }
    };

    const handleBudgetChange = async (category, amount) => {
        setBudgets(prev => ({ ...prev, [category]: amount }));
        const cat = categories.find(cat => cat.name === category);
        try {
            await axios.put(`http://localhost:5000/categories/${cat._id}`, { budget: amount });
        } catch (error) {
            console.error("Error updating budget", error);
        }
    };

    return (
        <div className="categories">
            <h2>Categories</h2>
            <div className="add-category">
                <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New Category"
                />
                <button onClick={handleAddCategory}>Add Category</button>
            </div>
            <div className="category-list">
                {categories.map(category => (
                    <div key={category._id} className="category-item">
                        <span>{category.name}</span>
                        <input
                            type="number"
                            value={budgets[category.name] || ''}
                            onChange={(e) => handleBudgetChange(category.name, e.target.value)}
                            placeholder="Set budget"
                        />
                    </div>
                ))}
            </div>
            <button onClick={() => console.log('Budgets:', budgets)}>Save Budgets</button>
        </div>

    );
}
