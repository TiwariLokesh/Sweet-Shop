const sweetService = require('../services/sweetService');

async function create(req, res, next) {
  try {
    const sweet = await sweetService.createSweet(req.body);
    res.status(201).json(sweet);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const sweets = await sweetService.listSweets();
    res.status(200).json(sweets);
  } catch (err) {
    next(err);
  }
}

async function search(req, res, next) {
  try {
    const sweets = await sweetService.searchSweets(req.query);
    res.status(200).json(sweets);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const sweet = await sweetService.updateSweet(req.params.id, req.body);
    res.status(200).json(sweet);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await sweetService.deleteSweet(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function purchase(req, res, next) {
  try {
    const sweet = await sweetService.purchaseSweet(req.params.id, req.body.quantity);
    res.status(200).json(sweet);
  } catch (err) {
    next(err);
  }
}

async function restock(req, res, next) {
  try {
    const sweet = await sweetService.restockSweet(req.params.id, req.body.quantity);
    res.status(200).json(sweet);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, search, update, remove, purchase, restock };
