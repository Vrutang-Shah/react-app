import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './HomePageStyle.css';

const Search = () => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [products, setProducts] = useState([]);
    const [options, setoptions] = useState([]);

    const handleChange = (selectedOptions) => {
        console.log(selectedOptions);
        setSelectedOptions(selectedOptions);
    };

    const generateOptions = (products) => {
        return products.map(product => ({
            sku: product.node.sku,
            value: product.node.entityId,
            label: product.node.name,
            price: product.node.prices.price.value,
            currencyCode: product.node.prices.price.currencyCode
        }));
    };

    const handleRemove = (optionToRemove) => {
        const updatedOptions = selectedOptions.filter(option => option.value !== optionToRemove.value);
        setSelectedOptions(updatedOptions);
    };


    useEffect(() => {
        fetch("http://localhost:5000/")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setProducts(data.data.site.products.edges);
                const generatedOptions = generateOptions(data.data.site.products.edges);
                setoptions(generatedOptions);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className="container">
            <h1>Product Search</h1>
            {options &&
                <Select
                    value={selectedOptions}
                    onChange={handleChange}
                    options={options}
                    placeholder="Select items..."
                    isMulti
                />
            }
            <div>
                <h2>Table Data</h2>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedOptions.map((item, index) => (
                            <tr key={index}>
                                <td>{item.label}</td>
                                <td>{item.sku}</td>
                                <td>${item.price}</td>
                                <td>
                                    <i class="fa fa-trash-o" onClick={() => handleRemove(item)}></i>
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
};


export default Search;
