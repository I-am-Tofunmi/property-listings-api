const { getAllUsers } = require('./userService');
const properties = [];
let nextId = 1;

const getAllProperties = () => {
    return properties;
};

const getPropertyById = (id) => {
    return properties.find(p => p.id == id);
};

const createProperty = (data) => {
    const users = getAllUsers();
    const owner = users.find(u => u.id === data.ownerId && u.role === 'owner');
    if (!owner) return null;
    const newProperty = { 
        id: nextId++, 
        ...data, 
        status: data.status || 'draft'
    };
    properties.push(newProperty);
    return newProperty;
};

const updateProperty = (id, data) => {  
    const index = properties.findIndex(p => p.id == id);
    if (index === -1) return null;
    properties[index] = { ...properties[index], ...data };
    return properties[index];
};

const deleteProperty = (id) => {
    const index = properties.findIndex(p => p.id == id);
    if (index === -1) return false;
    properties.splice(index, 1);
    return true;
}

module.exports = { getAllProperties, getPropertyById, createProperty, updateProperty, deleteProperty };
