const { getAllProperties } = require('./propertyService');
const { getAllUsers } = require('./userService');

const enquiries = [];
let nextId = 1;

const getAllEnquiries = () => {
    return enquiries;
};

const getEnquiryById = (id) => {
    return enquiries.find(e => e.id == id);
};

const createEnquiry = (data) => {
    const properties = getAllProperties();
    const property = properties.find(p => p.id === data.propertyId);
    if (!property) return { error: 'propertyId does not reference an existing property' };

    const users = getAllUsers();
    const renter = users.find(u => u.id === data.userId && u.role === 'renter');
    if (!renter) return { error: 'userId does not reference an existing renter' };

    const newEnquiry = {
        id: nextId++,
        ...data,
        status: 'new',
        createdAt: new Date().toISOString(),
    };
    enquiries.push(newEnquiry);
    return newEnquiry;
};

const updateEnquiryStatus = (id, status) => {
    const index = enquiries.findIndex(e => e.id == id);
    if (index === -1) return null;
    enquiries[index].status = status;
    return enquiries[index];
};

module.exports = { getAllEnquiries, getEnquiryById, createEnquiry, updateEnquiryStatus };