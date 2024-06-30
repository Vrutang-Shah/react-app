import React, { useState, useEffect } from "react";
import axios from 'axios';
import { WithContext as ReactTags } from 'react-tag-input';
import $ from 'jquery';
import "./HomePageStyle.css";
const Products = () => {
    const [productList, setproductList] = useState(null);
    const [searchOptions, setSearchOptions] = useState(null);
    const [optionsChecked, setOptionsChecked] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    //
    const KeyCodes = {
        comma: 188,
        enter: 13,
    };

    const delimiters = [KeyCodes.comma, KeyCodes.enter];
    const [tags, setTags] = useState('');

    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = (tag) => {
        setTags([...tags, tag]);
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        setTags(newTags);
    };
    //

    //
    const handleOptionChange = (option) => {
        setOptionsChecked(prevState => ({
            ...prevState,
            [option]: !prevState[option]
        }));
    };

    //

    const sendSearchQuery = async () => {
        console.log(tags);
        if (tags != '') {
            try {
                const response = await fetch('http://localhost:5000', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tags }),
                });
                const data = await response.json();
                setSearchOptions(data);
                setIsSubmitted(true);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handleTableDeletion = (parentIndex, childIndex, entityId) => {

        setOptionsChecked(prevState => ({
            ...prevState,
            [entityId]: false
        }));
    };
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    };

    const thStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'left',
        backgroundColor: '#f2f2f2',
    };

    const tdStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'left',
    };

    return (
        <div>
            <div>
                <h1>Product Search</h1>
                {tags ?
                    <ReactTags
                        tags={tags}
                        suggestions={[]}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        handleDrag={handleDrag}
                        delimiters={delimiters}
                        placeholder="Add a tag"
                        allowNew
                    />
                    :
                    <ReactTags
                        suggestions={[]}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        handleDrag={handleDrag}
                        delimiters={delimiters}
                        placeholder="Add a tag"
                        allowNew
                    />
                }
                <button
                    onClick={sendSearchQuery}
                >
                    Submit
                </button>
            </div>
            {searchOptions &&
                <div>
                    <ul>
                        {searchOptions.map((value) => (
                            <>
                                {value.data.site.search.searchProducts.products.edges.map((checkboxOption) => (
                                    <li>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={optionsChecked[checkboxOption.node.entityId] || false}
                                                onChange={() => handleOptionChange(checkboxOption.node.entityId)}
                                            />
                                            {checkboxOption.node.name}
                                        </label>
                                    </li>

                                ))}
                            </>
                        ))}
                    </ul>
                </div>
            }
            {isSubmitted && (
                searchOptions && searchOptions.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th >Name</th>
                                <th >SKU</th>
                                <th >Price</th>
                                <th >Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchOptions.map((row, parentIndex) => (
                                <>
                                    {row.data.site.search.searchProducts.products.edges.map((tabbleData, childIndex) => (
                                        optionsChecked[tabbleData.node.entityId] && (
                                            <tr key={childIndex}>
                                                <td >{tabbleData.node.name}</td>
                                                <td >{tabbleData.node.sku}</td>
                                                <td >${tabbleData.node.prices.price.value}</td>
                                                <td><i class="fa fa-trash-o" onClick={() => handleTableDeletion(parentIndex, childIndex, tabbleData.node.entityId)}></i></td>
                                            </tr>
                                        )
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data</p>
                )
            )}

        </div>
    );
};

export default Products;
