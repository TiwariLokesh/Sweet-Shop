const Sweet = require('../models/Sweet');

async function createSweet(data) {
  const { name, category, price, quantity } = data;
  if (!name || !category || price === undefined || quantity === undefined) {
    const err = new Error('All fields are required');
    err.status = 400;
    throw err;
  }
  const sweet = await Sweet.create({ name, category, price, quantity });
  return toDto(sweet);
}

async function listSweets() {
  const sweets = await Sweet.find().sort({ createdAt: -1 }).lean();
  return sweets.map(toDto);
}

async function searchSweets({ q, category, minPrice, maxPrice }) {
  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }
  const sweets = await Sweet.find(filter).lean();
  return sweets.map(toDto);
}

async function updateSweet(id, data) {
  const sweet = await Sweet.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!sweet) {
    const err = new Error('Sweet not found');
    err.status = 404;
    throw err;
  }
  return toDto(sweet);
}

async function deleteSweet(id) {
  const deleted = await Sweet.findByIdAndDelete(id);
  if (!deleted) {
    const err = new Error('Sweet not found');
    err.status = 404;
    throw err;
  }
}

async function purchaseSweet(id, quantity) {
  if (!quantity || quantity <= 0) {
    const err = new Error('Quantity must be positive');
    err.status = 400;
    throw err;
  }
  const sweet = await Sweet.findById(id);
  if (!sweet) {
    const err = new Error('Sweet not found');
    err.status = 404;
    throw err;
  }
  if (sweet.quantity < quantity) {
    const err = new Error('Insufficient stock');
    err.status = 400;
    throw err;
  }
  sweet.quantity -= quantity;
  await sweet.save();
  return toDto(sweet);
}

async function restockSweet(id, quantity) {
  if (!quantity || quantity <= 0) {
    const err = new Error('Quantity must be positive');
    err.status = 400;
    throw err;
  }
  const sweet = await Sweet.findById(id);
  if (!sweet) {
    const err = new Error('Sweet not found');
    err.status = 404;
    throw err;
  }
  sweet.quantity += quantity;
  await sweet.save();
  return toDto(sweet);
}

function toDto(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id.toString(),
    name: obj.name,
    category: obj.category,
    price: obj.price,
    quantity: obj.quantity,
  };
}

module.exports = {
  createSweet,
  listSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};
