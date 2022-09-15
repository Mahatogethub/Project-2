const internModel = require('../models/internModel')
const collegeModel = require('../models/collegeModel')

const createIntern = async function (req, res) {
   try{ 
    let data = req.body
    let { name, email, mobile, collegeName } = data

    //---------------------------------------validations-------------------------------------------------------------------------------//
    if(Object.keys(req.query) != 0){
        return res.status(400).send({ status: false, message: "Do not provide any filter !!" })
    }
    if (!name) {
        return res.status(400).send({ status: false, message: "Name is mandaotory !!" })
    }
    let Name = /^[a-zA-Z\s]+$/.test(name)
    if (!Name) {
        return res.status(400).send({ status: false, message: `${name} can be in alphabets only !!` })
    }

    if (!email) {
        return res.status(400).send({ status: false, message: "E-mail is mandaotory !!" })
    } 
    let emailValid = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)
    if (!emailValid) {
        return res.status(400).send({ status: false, message: `${email} is not a valid E-mail !!` })
    }

    if (!mobile) {
        return res.status(400).send({ status: false, message: "Mobile is mandaotory !!" })
    }
    let mobileValid = /^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)
     if (!mobileValid) {
        return res.status(400).send({ status: false, message: `${mobile} is not a valid Mobile Number !!` })
    }

    if (!collegeName) {
        return res.status(400).send({ status: false, message: "Please provide the Name of Your College !!" })
    }

    let checkEmail = await internModel.findOne({email : email})
    if (checkEmail) {
        return res.status(400).send({ status: false, message: `${email} already exists !!` })
    }

    let checkMobile = await internModel.findOne({mobile: mobile})
    if (checkMobile) {
        return res.status(400).send({ status: false, message: `${mobile} already exists !!` })
    }

    let checkCollege = await collegeModel.findOne({name: collegeName})
    if (!checkCollege) {
        return res.status(400).send({ status: false, message: `${collegeName} does not exist !!` })
    }
    req.body.collegeId = checkCollege._id
    let intern = await internModel.create(data)
    let Data={name:intern.name,email:intern.email,mobile:intern.mobile,collegeId:intern.collegeId,isDeleted:intern.isDeleted}
    res.status(201).send({ status: true, data: Data })
}
catch(error){
    res.status(500).send({status: false, message: error.message})
}

}

module.exports = { createIntern }