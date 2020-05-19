const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();

router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM companies;`);
        return res.json({
            'companies': result.rows
        })
    } catch (error) {
        return next(e)
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const {
            code
        } = req.params;
        const results = await db.query(`SELECT * FROM companies WHERE code = $1;`, [code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find compnay with code ${code}`, 404)
        }
        return res.send({
            company: results.rows[0]
        })
    } catch (error) {
        return next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const {code, name, description} = req.body;
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1,$2,$3) RETURNING code, name, description`, [code, name, description])
        return res.status(201).json({company: results.rows[0]})
    } catch (error) {
        next(e)
    }
})

router.put('/:code', async (req, res, next) => {
    try {
        const {code} = req.params;
        const {name, description} = req.body;
        const results = await db.query(`UPDATE companies SET code=$1, name=$2, description=$3 WHERE code=$1 RETURNING code, name, description`, [code, name, description])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't update company with code of ${code}`, 404)
          }
        return res.send({company: results.rows[0]})  
    } catch (error) {
        return next(error)
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const {code} = req.params
        const results = db.query(`DELETE FROM companies WHERE code=$1`, [code])
        return res.send({msg: "DELETED"})
    } catch (error) {
        return next(e)
    }
})

module.exports = router;