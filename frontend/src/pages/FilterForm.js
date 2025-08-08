import React, { useState } from "react";
import '../css/FilterForm.css';

function FilterForm(props) {

    const [formData, setFormData] = useState({
        mood: '',
        dayStatus: '',
        craving: '',
        diet: '',
        cuisines: [],
        priceMin: '',
        priceMax: '',
        timeNeed: '',
        location: 'Ahmedabad',
        email: '',
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value });
    }

    function handleCuisineChange(event) {
        const value = event.target.value;
        const checked = event.target.checked;

        setFormData((prev) => {
            const newCuisine = checked ? [...prev.cuisines, value] : prev.cuisines.filter((c) => c !== value);
            return { ...prev, cuisines: newCuisine };
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log("Form Submitted")
        props.onRecommend(formData);

        // axios.post('http://localhost:5000/api/recommend', formData)
        // .then(response => {
        //     console.log(response.data);
        // })
        // .catch(error => {
        //     console.error(error);
        // });
    }

    return (
        // Original FilterForm

        // <form onSubmit={handleSubmit} className="recommendation-form">
        //     <h2>Meal Recommendation</h2>

        //     <label>Mood</label>
        //     <select name='mood' value={formData.mood} onChange={handleChange} required>
        //         <option value=''>Select Mood</option>
        //         <option value='Happy'>Happy</option>
        //         <option value='Sad'>Sad</option>
        //         <option value='Tired'>Tired</option>
        //         <option value='Stressed'>Stressed</option>
        //     </select>

        //     <label>How was you day?</label>
        //     <select name='dayStatus' value={formData.dayStatus} onChange={handleChange} required>
        //         <option value=''>Select</option>
        //         <option value='Productive'>Productive</option>
        //         <option value='Lazy'>Lazy</option>
        //         <option value='Hectic'>Hectic</option>
        //         <option value='Normal'>Normal</option>
        //     </select>

        //     <label>What do you feel like eating?</label>
        //     <select name='craving' value={formData.craving} onChange={handleChange} required>
        //         <option value=''>Select</option>
        //         <option value='Spicy'>Spicy</option>
        //         <option value='Sweet'>Sweet</option>
        //         <option value='Light'>Light</option>
        //         <option value='Heavy'>Heavy</option>
        //     </select>

        //     <label>Diet Preference</label>
        //     <div className="radio-group">
        //         <label><input type="radio" name='diet' value='Veg' checked={formData.diet === 'Veg'} onChange={handleChange} />Veg</label>
        //         <label><input type="radio" name='diet' value='Non-Veg' checked={formData.diet === 'Non-Veg'} onChange={handleChange} />Non-Veg</label>
        //         <label><input type="radio" name='diet' value='Jain' checked={formData.diet === 'Jain'} onChange={handleChange} />Jain</label>
        //     </div>

        //     <label>Cuisine Preferences</label>
        //     <div className="checkbox-group">
        //         {
        //             ["North Indian", "South Indian", "Chinese", "Fast Food", "Snacks", "Dessert"].map((cuisine) => (
        //                 <label key={cuisine}>
        //                     <input type="checkbox" name="cuisine" value={cuisine} checked={formData.cuisines.includes(cuisine)} onChange={handleCuisineChange} />{cuisine}
        //                 </label>
        //             ))
        //         }
        //     </div>

        //     <label>Price Range</label>
        //     <div>
        //         <input type="number" name="priceMin" value={formData.priceMin} onChange={handleChange} required />
        //         <input type="number" name="priceMax" value={formData.priceMax} onChange={handleChange} required />
        //     </div>

        //     <label>Time to eat (in minutes)</label>
        //     <select name="timeNeed" value={formData.timeNeed} onChange={handleChange} required>
        //         <option value=''>Select</option>
        //         <option value='15'>15 min</option>
        //         <option value='30'>30 min</option>
        //         <option value='60'>1 hour</option>
        //     </select>

        //     <label>Location</label>
        //     <input type="text" name="location" value={formData.location} onChange={handleChange} required />

        //     <button type="submit">Get Recommendation</button>
        // </form>




        <div className="form-container">
            <form onSubmit={handleSubmit} className="recommendation-form">
                <div className="form-header">
                    <h2>Meal Recommendation</h2>
                    <p>Tell us about your preferences to get personalized suggestions</p>
                </div>

                <div className="form-content">
                    <div className="form-group">
                        <label htmlFor="mood">How are you feeling?</label>
                        <select id="mood" name="mood" value={formData.mood} onChange={handleChange} required className="form-select">
                            <option value="">Select your mood</option>
                            <option value="Happy">😊 Happy</option>
                            <option value="Sad">😢 Sad</option>
                            <option value="Tired">😴 Tired</option>
                            <option value="Stressed">😰 Stressed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dayStatus">How was your day?</label>
                        <select id="dayStatus" name="dayStatus" value={formData.dayStatus} onChange={handleChange} required className="form-select">
                            <option value="">Select day status</option>
                            <option value="Productive">✨ Productive</option>
                            <option value="Lazy">😌 Lazy</option>
                            <option value="Hectic">⚡ Hectic</option>
                            <option value="Normal">🙂 Normal</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="craving">What do you feel like eating?</label>
                        <select id="craving" name="craving" value={formData.craving} onChange={handleChange} required className="form-select">
                            <option value="">Select your craving</option>
                            <option value="Spicy">🌶️ Spicy</option>
                            <option value="Sweet">🍯 Sweet</option>
                            <option value="Light">🥗 Light</option>
                            <option value="Heavy">🍖 Heavy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Diet Preference</label>
                        <div className="radio-group">
                            <label className="radio-option">
                                <input type="radio" name="diet" value="Veg" checked={formData.diet === "Veg"} onChange={handleChange} />
                                <span className="radio-custom"></span>
                                <span className="radio-text">🥬 Veg</span>
                            </label>
                            <label className="radio-option">
                                <input type="radio" name="diet" value="Non-Veg" checked={formData.diet === "Non-Veg"} onChange={handleChange}/>
                                <span className="radio-custom"></span>
                                <span className="radio-text">🍗 Non-Veg</span>
                            </label>
                            <label className="radio-option">
                                <input type="radio" name="diet" value="Jain" checked={formData.diet === "Jain"} onChange={handleChange}/>
                                <span className="radio-custom"></span>
                                <span className="radio-text">🙏 Jain</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Cuisine Preferences</label>
                        <div className="checkbox-group">
                            {["North Indian", "South Indian", "Chinese", "Fast Food", "Snacks", "Dessert"].map((cuisine) => (
                                <label key={cuisine} className="checkbox-option">
                                    <input
                                        type="checkbox"
                                        name="cuisine"
                                        value={cuisine}
                                        checked={formData.cuisines.includes(cuisine)}
                                        onChange={handleCuisineChange}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="checkbox-text">{cuisine}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Price Range (₹)</label>
                        <div className="price-inputs">
                            <input type="number" name="priceMin" value={formData.priceMin} onChange={handleChange} placeholder="Min price" required className="form-input price-input"/>
                            <span className="price-separator">to</span>
                            <input type="number" name="priceMax" value={formData.priceMax} onChange={handleChange} placeholder="Max price" required className="form-input price-input"/>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="timeNeed">Time to eat</label>
                            <select id="timeNeed" name="timeNeed" value={formData.timeNeed} onChange={handleChange} required className="form-select">
                                <option value="">Select time</option>
                                <option value="15">⚡ 15 minutes</option>
                                <option value="30">⏰ 30 minutes</option>
                                <option value="60">🕐 1 hour</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                id="location"
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Enter your location"
                            />
                        </div>
                    </div>

                    {/* <div className="form-group">
                        <label htmlFor="email">Email (Optional)</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter your email for personalized recommendations"
                        />
                    </div> */}

                    <button type="submit" className="submit-button">
                        <span className="button-icon">🎯</span>
                        Get My Recommendation
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FilterForm;