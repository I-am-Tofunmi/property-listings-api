const users = [];
let nextId = 1;

const getAllUsers = () => {
    return users;
};

const getUserById = (id) => {
    return users.find(u => u.id == id);
};

const createUser = (data) => {
    const existing = users.find(u => u.email === data.email);
    if (existing) return null;
    const newUser = { id: nextId++, ...data, createdAt: new Date().toISOString() };
    users.push(newUser);
    return newUser;
};

const updateUser = (id, data) => {
    const index = users.findIndex(u => u.id == id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...data };
    return users[index];
};

const deleteUser = (id) => {
    const index = users.findIndex(u => u.id == id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };