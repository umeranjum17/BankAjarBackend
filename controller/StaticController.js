const { countryIbanMap } = require("../static/countryCodeIban");


const currencyLookUp=(req,res)=>{
   let value= Object.keys(countryIbanMap).find(key=>{
        return key==req.params.country
    })
    res.json({details:countryIbanMap[value]})
}
module.exports={
    currencyLookUp
}