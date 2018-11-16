const Tenants = require('../models/Tenants.js');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/CheckAuth.js')



function addTenantsRoutes(app) {
    app.get('/tenants', checkAuth, (req, res) => { // get all tenants form db
        Tenants.find()
        
            .then(tenants => res.json(tenants))
            .catch(err => console.warn(err, 'failed to get query from db')
            );
    });

    app.get('/tenants/:tenatId', checkAuth, (req, res) => { //get tenant by id
        var tenatId = req.params.tenatId;
        Tenants.find({ _id: tenatId })
            .then(tenant => res.json(tenant))
            .catch(err => console.warn(err, 'failed to get tenant by id from db')
            );
    })

    app.delete('/tenants/:tenantId', checkAuth, (req, res) => {  //delete tenant from db
        var tenantId = req.params.tenantId;
        Tenants.deleteOne({ _id: tenantId })
            .then(result => res.json(result))
            .catch(err => console.warn(err, 'failed to remove tenant by id from db'));
    })

    app.post('/tenants', checkAuth, (req, res) => { // add new tenant to db
        const tenant = new Tenants({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            debt: req.body.debt
        })
        tenant.save()
            .then(result => res.json(tenant))
            .catch(err => console.warn(err, 'failed to add new tenant to db'));
    })

    app.put('/tenants/:tenantId', checkAuth, (req, res) => { // update tenant in db
        const tenant = req.body;
        Tenants.updateOne({ _id: tenant._id }, {
            $set: {
                name: tenant.name,
                phone: tenant.phone,
                address: tenant.address,
                debt: tenant.debt
            }
        })
            .then(result => res.status(200).json({
                message: 'tenant saved successfully',
                result:result,
            })
            )
            .catch(err => console.log('failed to update tenant on db'));
    })
}

module.exports = addTenantsRoutes;

